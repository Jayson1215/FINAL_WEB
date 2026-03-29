<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Booking;
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
        ]);

        $booking = Booking::find($validated['booking_id']);

        // Verify the booking belongs to the user
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Map new payment method names to database values if needed
        $paymentMethod = $validated['payment_method'];
        $dbPaymentMethod = $paymentMethod;
        
        // If new payment methods, try to use them; otherwise map to compatible values
        if (!in_array($paymentMethod, ['online', 'in-person'])) {
            // New payment method - store as-is if possible, otherwise map
            if (in_array($paymentMethod, ['card', 'gcash'])) {
                $dbPaymentMethod = 'online'; // Treat card/gcash as online
            } else if ($paymentMethod === 'cash') {
                $dbPaymentMethod = 'in-person'; // Treat cash as in-person
            }
        }

        $payment = Payment::create([
            'booking_id' => $validated['booking_id'],
            'payment_method' => $dbPaymentMethod,
            'amount' => $booking->total_amount,
            'payment_status' => 'pending',
            'transaction_reference' => 'TXN-' . uniqid(),
        ]);

        // For online payments (card, gcash), you would integrate with a payment gateway
        if (in_array($paymentMethod, ['card', 'gcash'])) {
            // TODO: Integrate with payment gateway (e.g., Stripe, PayMongo, GCash API)
        } else if ($paymentMethod === 'cash') {
            // Cash payments - mark as pending until paid at studio
        }

        return response()->json($payment, 201);
    }

    /**
     * Get all payments (admin only)
     */
    public function getAll()
    {
        return response()->json(Payment::with('booking')->get());
    }

    /**
     * Get payment reports (admin only)
     */
    public function reports()
    {
        // Total revenue from paid payments
        $paidAmount = DB::table('payments')
            ->where('payment_status', 'paid')
            ->sum('amount');

        // Revenue from confirmed bookings (whether paid or pending)
        $confirmedBookingsAmount = Booking::where('status', 'confirmed')
            ->sum('total_amount');

        // Total revenue is paid amount + confirmed bookings amount
        $totalRevenue = $paidAmount + $confirmedBookingsAmount;

        $totalBookings = Booking::count();

        $confirmedBookings = Booking::where('status', 'confirmed')->count();

        $pendingPayments = Payment::where('payment_status', 'pending')->count();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_bookings' => $totalBookings,
            'confirmed_bookings' => $confirmedBookings,
            'pending_payments' => $pendingPayments,
        ]);
    }
}
