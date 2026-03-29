<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$services = \App\Models\Service::all();
echo "Total Services: " . $services->count() . PHP_EOL;

foreach ($services as $service) {
    echo "- ID: " . $service->id . " | Name: " . $service->name . " | Price: " . $service->price . PHP_EOL;
}

echo "\nFirst service details:" . PHP_EOL;
$first = $services->first();
if ($first) {
    echo json_encode($first, JSON_PRETTY_PRINT) . PHP_EOL;
}
