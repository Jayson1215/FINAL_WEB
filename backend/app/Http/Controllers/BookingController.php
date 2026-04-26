<?php
namespace App\Http\Controllers;

use App\Models\{Booking, Notification, User, Service};
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request) {
        return response()->json($request->user()->bookings()->with(['service', 'addOns', 'payment'])->latest()->get());
    }

    public function indexAll() {
        return response()->json(Booking::with(['user', 'service', 'addOns', 'payment'])->latest()->get());
    }

    public function store(Request $request) {
        try {
            $v = $request->validate([
                'service_id' => 'required|exists:services,id',
                'booking_date' => 'required|date|after_or_equal:today',
                'booking_time' => 'required',
                'total_amount' => 'required|numeric|min:0',
                'location' => 'required|string|max:255',
                'special_requests' => 'nullable|string',
                'add_on_ids' => 'nullable|array',
                'add_on_ids.*' => 'exists:add_ons,id',
            ]);

            $service = Service::findOrFail($v['service_id']);
            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'service_id' => $v['service_id'],
                'booking_date' => $v['booking_date'],
                'booking_time' => $v['booking_time'],
                'total_amount' => $v['total_amount'],
                'downpayment_amount' => (($service->downpayment_rate ?? 20) / 100) * $v['total_amount'],
                'paid_amount' => 0,
                'location' => $v['location'],
                'special_requests' => $v['special_requests'] ?? null,
                'status' => 'pending',
                'refund_status' => 'none',
            ]);

            if (!empty($v['add_on_ids'])) $booking->addOns()->attach($v['add_on_ids']);

            try {
                User::where('role', 'admin')->get()->each(fn($a) => Notification::create([
                    'user_id' => $a->id, 'type' => 'booking_created', 'title' => 'New Booking',
                    'message' => "{$request->user()->name} booked {$service->name}",
                    'link' => "/admin/bookings?booking={$booking->id}&highlight=1"
                ]));
            } catch (\Exception $e) {
                // Ignore notification failures to ensure booking is saved
            }

            return response()->json($booking->load('service', 'addOns'), 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Booking failed: ' . $e->getMessage()], 500);
        }
    }

    public function show(Booking $booking) { return response()->json($booking->load('service', 'addOns', 'payment')); }

    public function update(Request $request, Booking $booking) {
        if ($request->user()->id !== $booking->user_id && $request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $booking->update($request->validate(['booking_date' => 'sometimes|date|after:today', 'booking_time' => 'sometimes|date_format:H:i', 'special_requests' => 'nullable|string']));
        return response()->json($booking);
    }

    public function destroy(Request $request, Booking $booking) {
        if ($request->user()->id !== $booking->user_id && $request->user()->role !== 'admin') return response()->json(['message' => 'Unauthorized'], 403);
        $booking->update(['status' => 'cancelled']);
        
        // Auto-delete payments when cancelled so they vanish from the reports
        \App\Models\Payment::where('booking_id', $booking->id)->delete();
        
        return response()->json(['message' => 'Cancelled']);
    }

    public function updateStatus(Request $request, Booking $booking) {
        $v = $request->validate(['status' => 'required|in:pending,approved,awaiting_payment,paid,confirmed,cancelled,finished,completed,rejected', 'admin_notes' => 'nullable|string|max:1000']);
        
        // Map 'finished' to 'completed' for consistency if needed, but we'll support both
        $booking->update($v);

        // Auto-delete payments when cancelled so they vanish from the reports
        if ($v['status'] === 'cancelled' || $v['status'] === 'rejected') {
            \App\Models\Payment::where('booking_id', $booking->id)->delete();
        }

        $msg = match($v['status']) {
            'approved', 'confirmed' => 'Your booking is available.',
            'awaiting_payment' => "Proceed to payment.",
            'paid' => "Payment received! Confirmed.",
            'rejected' => 'Booking declined.',
            'finished', 'completed' => "Session complete.",
            default => "Status updated to " . $v['status']
        };

        Notification::create([
            'user_id' => $booking->user_id, 'type' => 'booking_status_updated',
            'title' => in_array($v['status'], ['confirmed', 'approved']) ? 'Confirmed' : 'Update',
            'message' => $msg, 'link' => "/client/MyBookings?booking={$booking->id}&highlight=1"
        ]);

        return response()->json($booking->fresh(['service', 'addOns', 'payment']));
    }

    public function requestCancellation(Request $request, Booking $booking) {
        if ($request->user()->id !== $booking->user_id) return response()->json(['message' => 'Unauthorized'], 403);
        $v = $request->validate(['reason' => 'required|string|max:500']);
        $booking->update(['status' => 'cancelled', 'refund_status' => $booking->paid_amount > 0 ? 'requested' : 'none', 'cancellation_reason' => $v['reason']]);

        User::where('role', 'admin')->get()->each(fn($a) => Notification::create([
            'user_id' => $a->id, 'type' => 'cancellation_requested', 'title' => 'Cancellation',
            'message' => "{$request->user()->name} requested cancellation.",
            'link' => "/admin/bookings?booking={$booking->id}&highlight=1"
        ]));
        return response()->json(['message' => 'Requested', 'booking' => $booking]);
    }

    public function processRefund(Request $request, Booking $booking) {
        if ($booking->refund_status !== 'requested') return response()->json(['message' => 'No refund requested'], 400);
        $booking->update(['refund_status' => 'refunded']);
        return response()->json(['message' => 'Refunded', 'booking' => $booking]);
    }
}
