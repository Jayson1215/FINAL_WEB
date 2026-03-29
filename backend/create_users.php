<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Delete existing test users if they exist
User::where('email', 'admin@studio.com')->delete();
User::where('email', 'client@studio.com')->delete();

// Create admin user
$admin = User::create([
    'name' => 'Admin User',
    'email' => 'admin@studio.com',
    'password' => Hash::make('password'),
    'role' => 'admin',
]);

echo "✓ Admin user created: {$admin->email}\n";

// Create client user
$client = User::create([
    'name' => 'Test Client',
    'email' => 'client@studio.com',
    'password' => Hash::make('password'),
    'role' => 'client',
]);

echo "✓ Client user created: {$client->email}\n";

// Verify
$count = User::count();
echo "\n✓ Total users in database: {$count}\n";
