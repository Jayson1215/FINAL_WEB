<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

$db = \Illuminate\Support\Facades\DB::connection()->getPdo();

// Get all tables
$tables = $db->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_ASSOC);

echo "Tables in database:\n";
foreach ($tables as $table) {
    echo "  - " . $table['name'] . "\n";
}

// Check if users table exists and show its schema
if (!empty($tables)) {
    echo "\nUsers table schema:\n";
    $schema = $db->query("PRAGMA table_info(users)")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($schema as $col) {
        echo "  - " . $col['name'] . " (" . $col['type'] . ")\n";
    }
}

// Count users
echo "\nUsers in database: \n";
$users = \App\Models\User::all();
foreach ($users as $user) {
    echo "  - {$user->email} ({$user->role})\n";
}
