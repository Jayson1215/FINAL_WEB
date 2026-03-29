<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Check actual database schema
$connection = \Illuminate\Support\Facades\DB::connection();
$columns = $connection->getDoctrineSchemaManager()->listTableColumns('services');

echo "Services table schema:" . PHP_EOL;
foreach ($columns as $column) {
    echo "- " . $column->getName() . ": " . $column->getType() . " (nullable: " . ($column->getNotnull() ? 'NO' : 'YES') . ")" . PHP_EOL;
}

echo "\nRaw database query:" . PHP_EOL;
$services = \Illuminate\Support\Facades\DB::table('services')->limit(3)->get();
foreach ($services as $service) {
    echo "ID (raw): " . var_export($service->id, true) . PHP_EOL;
}
