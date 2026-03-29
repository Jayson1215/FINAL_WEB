<?php

require __DIR__.'/vendor/autoload.php';

$app = require __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

use App\Models\Service;

$services = Service::all();
echo "Services in database:\n";
foreach ($services as $service) {
    echo "  ID: {$service->id}\n";
    echo "     Name: {$service->name}\n";
    echo "     Price: \${$service->price}\n\n";
}
