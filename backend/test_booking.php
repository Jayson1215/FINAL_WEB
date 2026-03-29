<?php
require 'vendor/autoload.php';

// Boot the application
$app = require 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Service;
use Illuminate\Support\Str;

// Get test user
$user = User::where('email', 'client@example.com')->first();
if (!$user) {
    echo "No test user found\n";
    exit;
}

// Get first service
$service = Service::first();
if (!$service) {
    echo "No services found\n";
    exit;
}

echo "Test User: " . $user->email . " (ID: " . $user->id . ")\n";
echo "Test Service: " . $service->name . " (ID: " . $service->id . ")\n";
echo "Service Price: ₱" . $service->price . "\n";
echo "\n";

// Test data that would be sent from frontend
$testBooking = [
    'service_id' => $service->id,
    'booking_date' => '2026-03-30', // Tomorrow
    'booking_time' => '10:00',      // Time in H:i format
    'total_amount' => $service->price,
    'special_requests' => 'Test special request',
    'add_on_ids' => [],
];

echo "Test Booking Payload:\n";
echo json_encode($testBooking, JSON_PRETTY_PRINT) . "\n";
echo "\n";

// Simulate creating the booking
$booking = \App\Models\Booking::create([
    'user_id' => $user->id,
    'service_id' => $testBooking['service_id'],
    'booking_date' => $testBooking['booking_date'],
    'booking_time' => $testBooking['booking_time'],
    'total_amount' => $testBooking['total_amount'],
    'special_requests' => $testBooking['special_requests'],
    'status' => 'pending',
]);

echo "✅ Booking Created Successfully!\n";
echo "Booking ID: " . $booking->id . "\n";
echo "Status: " . $booking->status . "\n";
echo "Date: " . $booking->booking_date . "\n";
echo "Time: " . $booking->booking_time . "\n";
echo "Amount: ₱" . $booking->total_amount . "\n";
echo "\nFull Booking Data:\n";
echo json_encode($booking->toArray(), JSON_PRETTY_PRINT) . "\n";
