<?php

use Illuminate\Support\Facades\Route;

Route::get('/{path}', function (string $path) {
    $decoded = urldecode($path);

    if (!preg_match('#/api/images/([A-Za-z0-9._-]+\.(?:png|jpe?g|webp|gif))$#i', $decoded, $matches)) {
        abort(404);
    }

    $filename = basename($matches[1]);
    $filePath = public_path('assets/images/' . $filename);

    if (!file_exists($filePath)) {
        abort(404);
    }

    return response()->file($filePath, [
        'Cache-Control' => 'public, max-age=86400',
    ]);
})->where('path', '.*api\/images\/[A-Za-z0-9._-]+\.(?:png|jpe?g|webp|gif).*');
