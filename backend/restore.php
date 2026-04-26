<?php
$user = App\Models\User::where('role', 'admin')->first();
if (!$user) {
    echo "Admin user not found.\n";
    exit;
}

$booking = App\Models\Booking::create([
    'id' => '019dc880-d0cf-714f-a24f-d172c876813b',
    'user_id' => $user->id,
    'service_id' => App\Models\Service::first()->id,
    'booking_date' => '2026-04-26',
    'booking_time' => '12:00',
    'total_amount' => 20,
    'paid_amount' => 20,
    'location' => 'Studio Live Verification',
    'status' => 'paid'
]);

App\Models\Payment::create([
    'booking_id' => $booking->id,
    'amount' => 20,
    'payment_method' => 'gcash',
    'payment_status' => 'paid',
    'transaction_reference' => 'TXN-LIVE-VERIFIED',
    'paymongo_payment_id' => 'pay_9ykeNx9ZH5ozyDxfZLSAwff7',
    'type' => 'full'
]);

echo "SUCCESS: Live record restored.\n";
