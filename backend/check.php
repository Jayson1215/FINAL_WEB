<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$price = App\Models\Service::first()->price;
echo "Price is: " . $price . "\n";
