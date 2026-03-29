<?php
require 'vendor/autoload.php';

// Boot the application
$app = require 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Service;

// Get all services
$services = Service::select('id', 'name', 'price')->get();

echo "Total Services: " . count($services) . PHP_EOL;
echo "=====================================" . PHP_EOL;

foreach ($services as $service) {
    echo "ID: " . $service->id . " | Name: " . $service->name . " | Price: " . $service->price . PHP_EOL;
}

echo "=====================================" . PHP_EOL;
echo "First Service Full Data:" . PHP_EOL;
$firstService = Service::first();
if ($firstService) {
    echo json_encode($firstService->toArray(), JSON_PRETTY_PRINT) . PHP_EOL;
} else {
    echo "No services found" . PHP_EOL;
}
