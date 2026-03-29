<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

// Get Jayson user and create a token
$user = User::where('email', 'Jayson@gmail.com')->first();

if (!$user) {
    echo "✗ User not found\n";
    exit;
}

echo "✓ User found: {$user->email}\n";

$token = $user->createToken('test_token')->plainTextToken;
echo "✓ Token created\n";

// Test creating a booking
$bookingData = [
    'service_id' => '019d3897-95ba-7041-914e-7764a24236cd',
    'booking_date' => '2026-04-05',
    'booking_time' => '10:00',
    'total_amount' => 150.00,
    'special_requests' => 'Please use natural lighting',
    'add_on_ids' => [],
];

$url = 'http://localhost:8000/api/client/bookings';
$data = json_encode($bookingData);

$options = [
    'http' => [
        'header'  => "Authorization: Bearer {$token}\r\nContent-Type: application/json\r\n",
        'method'  => 'POST',
        'content' => $data,
    ]
];

$context = stream_context_create($options);
$result = @file_get_contents($url, false, $context);

echo "\n✓ Response:\n";
echo $result . "\n\n";

if ($http_response_header) {
    echo "Headers:\n";
    foreach ($http_response_header as $header) {
        if (strpos($header, 'HTTP') === 0) {
            echo "  $header\n";
        }
    }
}
