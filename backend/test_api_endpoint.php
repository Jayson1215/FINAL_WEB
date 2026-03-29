<?php
require 'vendor/autoload.php';

// Boot the application
$app = require 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Simulate an HTTP request to the API
$request = \Illuminate\Http\Request::create('/api/client/services', 'GET');
$request->headers->set('Accept', 'application/json');

// Create the router and dispatch
$router = app(\Illuminate\Routing\Router::class);
$response = $kernel->handle($request);

echo $response->content();
