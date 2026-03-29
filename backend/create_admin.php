<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Delete existing user if they exist
User::where('email', 'admin@gmail.com')->delete();

// Create admin user
$admin = User::create([
    'name' => 'Admin',
    'email' => 'admin@gmail.com',
    'password' => Hash::make('admin123'),
    'role' => 'admin',
]);

echo "✓ Admin user created!\n";
echo "  Email: {$admin->email}\n";
echo "  Password: admin123\n";
echo "  Role: admin\n";
