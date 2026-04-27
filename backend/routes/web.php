<?php

use Illuminate\Support\Facades\Route;

Route::get('/{path}', function (string $path) {
    $decoded = urldecode($path);

    if (!preg_match('#/api/images/([A-Za-z0-9._-]+\.(?:png|jpe?g|webp|gif))$#i', $decoded, $matches)) {
        abort(404);
    }

    $filename = basename($matches[1]);

    $candidatePaths = [
        public_path('assets/images/' . $filename),
        public_path('images/' . $filename),
        public_path('storage/images/' . $filename),
    ];

    $persistentImagePath = env('IMAGES_STORAGE_PATH');
    if (!empty($persistentImagePath)) {
        $candidatePaths[] = rtrim($persistentImagePath, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;
    }

    $filePath = null;
    foreach ($candidatePaths as $candidate) {
        if (file_exists($candidate)) {
            $filePath = $candidate;
            break;
        }
    }

    if (!$filePath) {
        abort(404);
    }

    $mimeType = @mime_content_type($filePath) ?: 'application/octet-stream';

    return response(file_get_contents($filePath), 200)
        ->header('Content-Type', $mimeType)
        ->header('Cache-Control', 'public, max-age=86400');
})->where('path', '.*api\/images\/[A-Za-z0-9._-]+\.(?:png|jpe?g|webp|gif).*');
