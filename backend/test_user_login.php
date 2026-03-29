<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\User;

// Check if user exists
$user = User::where('email', 'Jayson@gmail.com')->first();

if ($user) {
    echo "✓ User found!\n";
    echo "  Email: {$user->email}\n";
    echo "  Name: {$user->name}\n";
    echo "  Role: {$user->role}\n";
    echo "  ID: {$user->id}\n";
    echo "  Password Hash: {$user->password}\n";
    
    // Test password
    echo "\n✓ Testing password...\n";
    $test = \Illuminate\Support\Facades\Hash::check('jayson123', $user->password);
    echo "  Password match: " . ($test ? 'YES' : 'NO') . "\n";
} else {
    echo "✗ User NOT found with email: Jayson@gmail.com\n";
    echo "\nAll users in database:\n";
    $users = User::all();
    foreach ($users as $u) {
        echo "  - {$u->email} ({$u->role})\n";
    }
}
