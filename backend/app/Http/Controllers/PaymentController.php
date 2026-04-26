<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Booking;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

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
            
            // If downpayment or full is paid, mark booking as paid (Ready for Session)
            if ($payment->type === 'downpayment' || $payment->type === 'full') {
                $booking->status = 'paid';
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
     * Verify a Paymongo Checkout Session status
     */
    public function verify(Request $request)
    {
        $v = $request->validate([
            'session_id' => 'required|string',
        ]);

        $payment = Payment::where('transaction_reference', $v['session_id'])->first();
        if (!$payment) return response()->json(['message' => 'Payment record not found'], 404);

        if ($payment->payment_status === 'paid') {
            return response()->json(['message' => 'Payment already verified', 'status' => 'paid']);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY') . ':'),
            ])->get("https://api.paymongo.com/v1/checkout_sessions/{$v['session_id']}");

            if ($response->failed()) {
                return response()->json(['message' => 'Failed to verify with Paymongo'], 500);
            }

            $session = $response->json();
            $status = $session['data']['attributes']['status'] ?? 'pending';
            $paymentIntentStatus = $session['data']['attributes']['payment_intent']['attributes']['status'] ?? '';

            if ($status === 'expired') {
                $payment->update(['payment_status' => 'failed']);
                return response()->json(['message' => 'Session expired', 'status' => 'failed']);
            }

            if ($paymentIntentStatus === 'succeeded') {
                DB::transaction(function () use ($payment, $session) {
                    // Extract the payment ID from the session response
                    $paymongoPaymentId = $session['data']['attributes']['payments'][0]['id'] ?? null;
                    
                    $payment->update([
                        'payment_status' => 'paid',
                        'paymongo_payment_id' => $paymongoPaymentId
                    ]);
                    
                    $booking = $payment->booking;
                    $booking->paid_amount = (float)$booking->paid_amount + (float)$payment->amount;
                    
                    if ($payment->type === 'downpayment' || 
                        $payment->type === 'full' || 
                        $booking->paid_amount >= $booking->total_amount) {
                        $booking->status = 'paid';
                    }
                    
                    $booking->save();

                    \Log::info("Payment Verified: Booking {$booking->id} marked as {$booking->status}");

                    Notification::create([
                        'user_id' => $booking->user_id,
                        'type' => 'payment_confirmed',
                        'title' => 'Payment Received',
                        'message' => "Successfully received ₱" . number_format((float)$payment->amount) . " via GCash. Your session is now secured.",
                        'link' => '/client/MyBookings'
                    ]);
                });

                return response()->json(['message' => 'Payment verified', 'status' => 'paid']);
            }

            return response()->json(['message' => 'Payment still pending', 'status' => 'pending']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Verification error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a Paymongo Checkout Session for GCash
     */
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'type' => 'required|in:downpayment,balance,full',
        ]);

        $booking = Booking::with('service')->findOrFail($request->booking_id);

        // Security check
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Calculate amount in cents (Paymongo uses cents)
        $amount = match($request->type) {
            'downpayment' => $booking->downpayment_amount,
            'balance' => max(0, $booking->total_amount - $booking->paid_amount),
            'full' => $booking->total_amount,
            default => 0
        };

        if ($amount <= 0) {
            return response()->json(['message' => 'No balance to pay'], 400);
        }

        // Paymongo minimum is 20.00 PHP
        if ($amount < 20) {
            return response()->json([
                'message' => 'Paymongo requires a minimum payment of ₱20.00. Please update the service price to test.'
            ], 400);
        }
            
        $amountInCents = (int)($amount * 100);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode(config('services.paymongo.secret_key') . ':'),
                'Content-Type' => 'application/json',
            ])->post('https://api.paymongo.com/v1/checkout_sessions', [
                'data' => [
                    'attributes' => [
                        'send_email_receipt' => true,
                        'show_description' => true,
                        'show_line_items' => true,
                        'line_items' => [
                            [
                                'currency' => 'PHP',
                                'amount' => $amountInCents,
                                'description' => "{$booking->service->name} - " . ucfirst($request->type),
                                'name' => "Studio Booking: {$booking->service->name}",
                                'quantity' => 1,
                            ]
                        ],
                        'payment_method_types' => ['gcash', 'qrph'],
                        'description' => "Booking payment for {$booking->service->name}",
                        'success_url' => env('FRONTEND_URL') . '/client/MyBookings?payment=success&session_id={CHECKOUT_SESSION_ID}',
                        'cancel_url' => env('FRONTEND_URL') . '/client/MyBookings?payment=cancelled',
                    ]
                ]
            ]);

            if ($response->failed()) {
                \Log::error('Paymongo Session Creation Failed', [
                    'status' => $response->status(),
                    'body' => $response->json(),
                    'booking_id' => $booking->id
                ]);
                $errDetail = $response->json()['errors'][0]['detail'] ?? 'Unknown Paymongo Error';
                return response()->json([
                    'message' => 'Paymongo API Error: ' . $errDetail,
                    'error' => $response->json()
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Paymongo Connection Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Connection to Paymongo failed: ' . $e->getMessage()
            ], 500);
        }

        $session = $response->json();
        
        // Create a pending payment record
        Payment::create([
            'booking_id' => $booking->id,
            'payment_method' => 'gcash',
            'amount' => $amount,
            'payment_status' => 'pending',
            'transaction_reference' => $session['data']['id'],
            'type' => $request->type,
        ]);

        return response()->json([
            'checkout_url' => $session['data']['attributes']['checkout_url']
        ]);
    }

    /**
     * Get payment reports (admin only)
     */
    public function reports()
    {
        try {
            // Actual income (total collected from paid payments)
            $totalIncome = Payment::where('payment_status', 'paid')
                ->sum('amount');

            // Total bookings count
            $totalBookings = Booking::count();

            // Confirmed or Finished bookings count
            $confirmedBookings = Booking::whereIn('status', ['confirmed', 'finished'])->count();

            // Pending revenue (amount due from confirmed/finished bookings)
            $pendingRevenue = Booking::whereIn('status', ['confirmed', 'finished'])
                ->get()
                ->sum(function($booking) {
                    $total = (float)($booking->total_amount ?? 0);
                    $paid = (float)($booking->paid_amount ?? 0);
                    return max(0, $total - $paid);
                });

            // Refunded amount
            $refundedAmount = Booking::where('refund_status', 'refunded')
                ->sum('paid_amount');

            // Pending refunds
            $pendingRefunds = Booking::where('refund_status', 'requested')
                ->sum('paid_amount');

            return response()->json([
                'total_revenue' => (float)$totalIncome,
                'total_bookings' => $totalBookings,
                'confirmed_bookings' => $confirmedBookings,
                'pending_revenue' => (float)$pendingRevenue,
                'refunded_amount' => (float)$refundedAmount,
                'pending_refunds' => (float)$pendingRefunds,
                'pending_payments' => Payment::where('payment_status', 'pending')->count(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Reports Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error calculating reports: ' . $e->getMessage(),
                'error' => true
            ], 500);
        }
    /**
     * Refund a payment (admin only)
     */
    public function refund(Request $request, Payment $payment)
    {
        if ($payment->payment_status !== 'paid') {
            return response()->json(['message' => 'Only paid payments can be refunded'], 400);
        }

        if (!$payment->paymongo_payment_id) {
            return response()->json(['message' => 'Paymongo Payment ID not found. Refund must be done manually via Dashboard for this old record.'], 400);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY') . ':'),
                'Content-Type' => 'application/json',
            ])->post('https://api.paymongo.com/v1/refunds', [
                'data' => [
                    'attributes' => [
                        'amount' => (int)($payment->amount * 100), // in cents
                        'payment_id' => $payment->paymongo_payment_id,
                        'reason' => $request->reason ?? 'user_requested'
                    ]
                ]
            ]);

            if ($response->failed()) {
                return response()->json([
                    'message' => 'Paymongo Refund Failed: ' . ($response->json()['errors'][0]['detail'] ?? 'Unknown error'),
                ], 500);
            }

            // Update local records
            DB::transaction(function () use ($payment) {
                $payment->update(['payment_status' => 'refunded']);
                
                $booking = $payment->booking;
                $booking->paid_amount = max(0, (float)$booking->paid_amount - (float)$payment->amount);
                $booking->refund_status = 'refunded';
                $booking->status = 'cancelled'; // Mark as cancelled after refund
                $booking->save();

                Notification::create([
                    'user_id' => $booking->user_id,
                    'type' => 'refund_processed',
                    'title' => 'Refund Processed',
                    'message' => "A refund of ₱" . number_format((float)$payment->amount) . " has been sent back to your original payment method.",
                    'link' => '/client/MyBookings'
                ]);
            });

            return response()->json(['message' => 'Refund processed successfully']);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Refund error: ' . $e->getMessage()], 500);
        }
    }
}
