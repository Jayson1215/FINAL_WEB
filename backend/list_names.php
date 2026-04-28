<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$services = App\Models\Service::all();
foreach ($services as $s) {
    echo $s->name . " -> " . $s->price . "\n";
}
