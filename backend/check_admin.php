<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\User;

echo "=== Admin Users in Database ===\n\n";

$admins = User::where('role', 'admin')->get();

if ($admins->isEmpty()) {
    echo "✗ No admin users found in database\n";
} else {
    foreach ($admins as $admin) {
        echo "✓ Found Admin:\n";
        echo "  Name: {$admin->name}\n";
        echo "  Email: {$admin->email}\n";
        echo "  Role: {$admin->role}\n";
        echo "  ID: {$admin->id}\n\n";
    }
}

echo "=== All Users ===\n";
$allUsers = User::all();
foreach ($allUsers as $user) {
    echo "  - {$user->email} ({$user->role})\n";
}
