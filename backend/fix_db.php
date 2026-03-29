<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

$db = \Illuminate\Support\Facades\DB::connection()->getPdo();

// Add deleted_at column to users table if it doesn't exist
try {
    $db->exec("ALTER TABLE users ADD COLUMN deleted_at datetime NULL");
    echo "✓ Added deleted_at column to users table\n";
} catch (\Exception $e) {
    if (strpos($e->getMessage(), 'duplicate column') !== false) {
        echo "✓ Column already exists\n";
    } else {
        echo "✗ Error: " . $e->getMessage() . "\n";
    }
}

// Now test querying users
echo "\nUsers in database:\n";
$users = \App\Models\User::all();
if ($users->isEmpty()) {
    echo "  No users found\n";
} else {
    foreach ($users as $user) {
        echo "  - {$user->email} ({$user->role})\n";
    }
}
