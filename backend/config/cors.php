<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure CORS settings for your application. This is
    | loaded by the HandleCors middleware provided by this package.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(array_map('trim', explode(',', 
        (string) env('FRONTEND_URLS', 'https://finalweb-pied.vercel.app,http://localhost:5173,http://localhost:5174')
    )))),

    'allowed_origins_patterns' => [
        '#^https://finalweb.*\.vercel\.app$#',
        '#^https://.*\.vercel\.app$#',
        '#^http://localhost.*$#',
        '#^http://127\.0\.0\.1.*$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['*'],

    'max_age' => 0,

    'supports_credentials' => true,
];
