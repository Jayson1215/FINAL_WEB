<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Delete if exists
User::where('email', 'Jayson@gmail.com')->delete();

// Create client user
$client = User::create([
    'name' => 'Jayson',
    'email' => 'Jayson@gmail.com',
    'password' => Hash::make('jayson123'),
    'role' => 'client',
]);

echo "✓ Client account created successfully!\n";
echo "  Email: {$client->email}\n";
echo "  Password: jayson123\n";
echo "  Role: {$client->role}\n";
echo "  ID: {$client->id}\n";
