<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

// Get admin user
$admin = User::where('role', 'admin')->first();

if (!$admin) {
    echo "✗ Admin user not found\n";
    exit;
}

echo "✓ Admin found: {$admin->email}\n";

$token = $admin->createToken('test_token')->plainTextToken;
echo "✓ Token created\n";

// Test the reports endpoint
$url = 'http://localhost:8000/api/admin/reports';

$options = [
    'http' => [
        'header'  => "Authorization: Bearer {$token}\r\nContent-Type: application/json\r\n",
        'method'  => 'GET',
    ]
];

$context = stream_context_create($options);
$result = @file_get_contents($url, false, $context);

echo "\n✓ Reports Response:\n";
echo $result . "\n\n";

// Parse and display nicely
$data = json_decode($result, true);
if ($data) {
    echo "=== Dashboard Stats ===\n";
    echo "Total Revenue: ₱" . $data['total_revenue'] . "\n";
    echo "Total Bookings: " . $data['total_bookings'] . "\n";
    echo "Confirmed Bookings: " . $data['confirmed_bookings'] . "\n";
    echo "Pending Payments: " . $data['pending_payments'] . "\n";
}
