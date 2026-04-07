<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Booking;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Create a new payment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'payment_method' => 'required|in:card,gcash,cash,online,in-person',
            'type' => 'required|in:downpayment,balance,full',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        // Verify the booking belongs to the user
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Calculate amount based on type
        $amount = $booking->total_amount;
        if ($validated['type'] === 'downpayment') {
            $amount = $booking->downpayment_amount;
        } else if ($validated['type'] === 'balance') {
            $amount = $booking->total_amount - $booking->paid_amount;
        }

        $payment = Payment::create([
            'booking_id' => $validated['booking_id'],
            'payment_method' => $validated['payment_method'],
            'amount' => $amount,
            'payment_status' => 'pending',
            'transaction_reference' => 'TXN-' . strtoupper(uniqid()),
            'type' => $validated['type'],
        ]);

        return response()->json($payment, 201);
    }

    /**
     * Confirm a payment (admin only)
     */
    public function confirm(Request $request, Payment $payment)
    {
        if ($payment->payment_status === 'paid') {
            return response()->json(['message' => 'Payment already paid'], 400);
        }

        DB::transaction(function () use ($payment) {
            $payment->update(['payment_status' => 'paid']);
            
            $booking = $payment->booking;
            $booking->paid_amount += $payment->amount;
            
            // If downpayment is paid, mark booking as confirmed
            if ($payment->type === 'downpayment' || $payment->type === 'full') {
                $booking->status = 'confirmed';
            }
            
            $booking->save();

            // Notify Client
            Notification::create([
                'user_id' => $booking->user_id,
                'type' => 'payment_confirmed',
                'title' => 'Payment Confirmed',
                'message' => "Your payment of ₱" . number_format((float)$payment->amount) . " for {$booking->service->name} has been confirmed.",
                'link' => '/my-bookings'
            ]);
        });

        return response()->json([
            'message' => 'Payment confirmed and booking updated',
            'payment' => $payment->load('booking')
        ]);
    }

    /**
     * Get all payments (admin only)
     */
    public function getAll()
    {
        return response()->json(Payment::with(['booking.user', 'booking.service'])->get());
    }

    /**
     * Get payment reports (admin only)
     */
    public function reports()
    {
        // Actual income (total collected from paid payments)
        $totalIncome = Payment::where('payment_status', 'paid')
            ->sum('amount');

        // Total bookings count
        $totalBookings = Booking::count();

        // Confirmed or Finished bookings count (Sessions that happened or are confirmed to happen)
        $confirmedBookings = Booking::whereIn('status', ['confirmed', 'finished'])->count();

        // Pending revenue (amount due from confirmed/finished bookings)
        $pendingRevenue = Booking::whereIn('status', ['confirmed', 'finished'])
            ->get()
            ->sum(function($booking) {
                return max(0, $booking->total_amount - $booking->paid_amount);
            });

        // Refunded amount
        $refundedAmount = Booking::where('refund_status', 'refunded')
            ->sum('paid_amount');

        // Pending refunds
        $pendingRefunds = Booking::where('refund_status', 'requested')
            ->sum('paid_amount');

        return response()->json([
            'total_revenue' => $totalIncome, // We'll call it total_revenue for frontend compatibility
            'total_bookings' => $totalBookings,
            'confirmed_bookings' => $confirmedBookings,
            'pending_revenue' => $pendingRevenue,
            'refunded_amount' => $refundedAmount,
            'pending_refunds' => $pendingRefunds,
            'pending_payments' => Payment::where('payment_status', 'pending')->count(),
        ]);
    }
}
