<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== Database Schema Check ===\n\n";

// Test booking_addons table
echo "Checking booking_addons table:\n";
try {
    $result = DB::select("PRAGMA table_info(booking_addons)");
    if (empty($result)) {
        echo "✗ booking_addons table does NOT exist!\n";
    } else {
        echo "Columns:\n";
        foreach ($result as $col) {
            echo "  - {$col->name} ({$col->type})\n";
        }
    }
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// Check bookings
echo "\nChecking bookings table:\n";
try {
    $result = DB::select("PRAGMA table_info(bookings)");
    if (empty($result)) {
        echo "✗ bookings table does NOT exist!\n";
    } else {
        echo "Columns:\n";
        foreach ($result as $col) {
            echo "  - {$col->name} ({$col->type})\n";
        }
    }
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// Check add_ons
echo "\nChecking add_ons table:\n";
try {
    $result = DB::select("PRAGMA table_info(add_ons)");
    if (empty($result)) {
        echo "✗ add_ons table does NOT exist!\n";
    } else {
        echo "Columns:\n";
        foreach ($result as $col) {
            echo "  - {$col->name} ({$col->type})\n";
        }
    }
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
