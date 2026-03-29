<?php

namespace App\Http\Controllers;

use App\Models\Booking;
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
                'special_requests' => 'nullable|string',
                'add_on_ids' => 'nullable|array',
                'add_on_ids.*' => 'exists:add_ons,id',
            ]);

            // Verify user is authenticated
            if (!$request->user()) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'service_id' => $validated['service_id'],
                'booking_date' => $validated['booking_date'],
                'booking_time' => $validated['booking_time'],
                'total_amount' => $validated['total_amount'],
                'special_requests' => $validated['special_requests'] ?? null,
                'status' => 'pending',
            ]);

            if (!empty($validated['add_on_ids'])) {
                $booking->addOns()->attach($validated['add_on_ids']);
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
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $booking->update(['status' => $validated['status']]);

        return response()->json($booking);
    }
}
