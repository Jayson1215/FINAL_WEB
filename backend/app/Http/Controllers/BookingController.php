<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Get all bookings for the authenticated client user
     */
    public function index(Request $request)
    {
        $bookings = $request->user()->bookings()->with(['service', 'addOns', 'payment'])->get();

        return response()->json($bookings);
    }

    /**
     * Get all bookings (for admin)
     */
    public function indexAll()
    {
        $bookings = Booking::with(['user', 'service', 'addOns', 'payment'])->get();

        return response()->json($bookings);
    }

    /**
     * Create a new booking
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'service_id' => 'required|exists:services,id',
                'booking_date' => 'required|date|after:today',
                'booking_time' => 'required|date_format:H:i',
                'total_amount' => 'required|numeric|min:0',
                'location' => 'required|string|max:255',
                'special_requests' => 'nullable|string',
                'add_on_ids' => 'nullable|array',
                'add_on_ids.*' => 'exists:add_ons,id',
            ]);

            // Verify user is authenticated
            if (!$request->user()) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $service = \App\Models\Service::findOrFail($validated['service_id']);
            $downpaymentRate = $service->downpayment_rate ?? 20.00;
            $downpaymentAmount = ($downpaymentRate / 100) * $validated['total_amount'];

            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'service_id' => $validated['service_id'],
                'booking_date' => $validated['booking_date'],
                'booking_time' => $validated['booking_time'],
                'total_amount' => $validated['total_amount'],
                'downpayment_amount' => $downpaymentAmount,
                'paid_amount' => 0,
                'location' => $validated['location'],
                'special_requests' => $validated['special_requests'] ?? null,
                'status' => 'pending',
                'refund_status' => 'none',
            ]);

            if (!empty($validated['add_on_ids'])) {
                $booking->addOns()->attach($validated['add_on_ids']);
            }

            // Notify Admins
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'booking_created',
                    'title' => 'New Booking Received',
                    'message' => "{$request->user()->name} has booked {$service->name} for " . date('M d, Y', strtotime($booking->booking_date)),
                    'link' => '/admin/bookings'
                ]);
            }

            return response()->json($booking->load('service', 'addOns'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Booking creation error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create booking: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a single booking
     */
    public function show(Booking $booking)
    {
        return response()->json($booking->load('service', 'addOns', 'payment'));
    }

    /**
     * Update a booking (client can only update their own)
     */
    public function update(Request $request, Booking $booking)
    {
        if ($request->user()->id !== $booking->user_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'booking_date' => 'sometimes|date|after:today',
            'booking_time' => 'sometimes|date_format:H:i',
            'special_requests' => 'nullable|string',
        ]);

        $booking->update($validated);

        return response()->json($booking);
    }

    /**
     * Cancel/Delete a booking (client can only delete their own before booking date)
     */
    public function destroy(Request $request, Booking $booking)
    {
        if ($request->user()->id !== $booking->user_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->status = 'cancelled';
        $booking->save();

        return response()->json(['message' => 'Booking cancelled']);
    }

    /**
     * Update booking status (admin only)
     */
    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,awaiting_payment,paid,confirmed,cancelled,finished,rejected',
        ]);

        $booking->update(['status' => $validated['status']]);

        // Custom messages based on the new flow
        $messages = [
            'approved' => "Availability confirmed! We are ready for your session on " . date('M d', strtotime($booking->booking_date)) . ".",
            'awaiting_payment' => "Your request is ready. Please proceed to payment to finalize your booking.",
            'paid' => "Payment received! Your booking ID {$booking->id} is now fully confirmed.",
            'rejected' => "We're sorry, but we cannot accommodate your request at this time.",
            'finished' => "Thank you for choosing LIGHT Photography. Your session is now complete."
        ];

        $message = $messages[$validated['status']] ?? "Your booking status is now " . ucfirst($validated['status']) . ".";

        // Notify Client
        Notification::create([
            'user_id' => $booking->user_id,
            'type' => 'booking_status_updated',
            'title' => 'Booking Update',
            'message' => $message,
            'link' => '/client/bookings'
        ]);

        return response()->json($booking);
    }

    /**
     * Request cancellation and refund (client)
     */
    public function requestCancellation(Request $request, Booking $booking)
    {
        if ($request->user()->id !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $booking->update([
            'status' => 'cancelled',
            'refund_status' => $booking->paid_amount > 0 ? 'requested' : 'none',
            'cancellation_reason' => $validated['reason'],
        ]);

        // Notify Admins
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'cancellation_requested',
                'title' => 'Cancellation Request',
                'message' => "{$request->user()->name} has requested to cancel their booking for {$booking->service->name}.",
                'link' => '/admin/bookings'
            ]);
        }

        return response()->json([
            'message' => 'Cancellation requested successfully',
            'booking' => $booking
        ]);
    }

    /**
     * Process refund (admin only)
     */
    public function processRefund(Request $request, Booking $booking)
    {
        if ($booking->refund_status !== 'requested') {
            return response()->json(['message' => 'No refund requested for this booking'], 400);
        }

        $booking->update(['refund_status' => 'refunded']);

        return response()->json([
            'message' => 'Refund processed successfully',
            'booking' => $booking
        ]);
    }
}
