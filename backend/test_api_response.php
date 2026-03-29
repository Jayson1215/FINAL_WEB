<?php
require 'vendor/autoload.php';

// Boot the application
$app = require 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Service;
use Illuminate\Http\JsonResponse;

// Simulate what the API returns
$services = Service::select('id', 'name', 'description', 'category', 'price', 'duration', 'created_at', 'updated_at')->get();

echo "API Response (JSON):" . PHP_EOL;
echo json_encode($services, JSON_PRETTY_PRINT) . PHP_EOL;

echo PHP_EOL . "=====================================" . PHP_EOL;
echo "First Service ID only:" . PHP_EOL;
$firstService = Service::first();
if ($firstService) {
    echo "ID type: " . gettype($firstService->id) . PHP_EOL;
    echo "ID value: " . $firstService->id . PHP_EOL;
    echo "ID json: " . json_encode(['id' => $firstService->id]) . PHP_EOL;
} else {
    echo "No services found" . PHP_EOL;
}
