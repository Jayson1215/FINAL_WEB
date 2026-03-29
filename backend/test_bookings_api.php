<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\User;

// Get Jayson user and create a token
$user = User::where('email', 'Jayson@gmail.com')->first();

if (!$user) {
    echo "✗ User not found\n";
    exit;
}

echo "✓ User found: {$user->email}\n";

$token = $user->createToken('test_token')->plainTextToken;
echo "✓ Token created: {$token}\n";

// Test the API endpoint with authentication
$url = 'http://localhost:8000/api/client/bookings';
$options = [
    'http' => [
        'header'  => "Authorization: Bearer {$token}\r\nContent-Type: application/json\r\n",
        'method'  => 'GET',
    ]
];

$context = stream_context_create($options);
$result = @file_get_contents($url, false, $context);

echo "\n✓ Response:\n";
echo $result . "\n\n";

if ($http_response_header) {
    echo "Headers:\n";
    foreach ($http_response_header as $header) {
        if (strpos($header, 'HTTP') === 0 || strpos($header, 'Content-Type') === 0) {
            echo "  $header\n";
        }
    }
}
