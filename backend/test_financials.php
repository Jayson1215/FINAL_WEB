<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Payment;
use App\Models\Booking;

echo "--- Payments ---\n";
$payments = Payment::all();
foreach ($payments as $p) {
    echo "ID: {$p->id}, Status: {$p->payment_status}, Amount: {$p->amount}, Type: {$p->type}\n";
}

echo "\n--- Bookings ---\n";
$bookings = Booking::all();
foreach ($bookings as $b) {
    echo "ID: {$b->id}, Status: {$b->status}, Paid Amount: {$b->paid_amount}, Total Amount: {$b->total_amount}\n";
}
