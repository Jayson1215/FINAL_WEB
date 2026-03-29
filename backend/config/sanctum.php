<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Stateless API Tokens
    |--------------------------------------------------------------------------
    |
    | When building SPAs that communicate to your Laravel API, you may want to
    | use Sanctum for API token management instead of relying on sessions for
    | authentication. This configuration option enables API mode.
    */

    'stateless' => true,

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | This array contains the authentication guards that will be checked when
    | Sanctum is trying to authenticate a request. If none of these guards
    | are able to authenticate the request, a 401 response is returned.
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | This value controls the number of minutes until an issued token will be
    | considered expired. If this value is null, personal access tokens do
    | not expire. This won't tweak the lifetime of first-party sessions.
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Sanctum can prefix new tokens in order to take advantage of eloquent's
    | prefix allowlisting feature. This is disabled by default for now.
    */

    'token_prefix' => '',

    /*
    |--------------------------------------------------------------------------
    | CORS Allowed Origins
    |--------------------------------------------------------------------------
    |
    | By default, Sanctum allows requests from any origin. If you'd like to
    | restrict which origins can make requests to your API, define them here.
    */

    'allowed_origins' => ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],

    /*
    |--------------------------------------------------------------------------
    | CORS Allowed Methods
    |--------------------------------------------------------------------------
    |
    | Allowed HTTP methods for CORS requests.
    */

    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | CORS Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Allowed headers for CORS requests.
    */

    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | CORS Max Age
    |--------------------------------------------------------------------------
    |
    | The number of seconds the CORS preflight response can be cached.
    */

    'max_age' => 600,

    /*
    |--------------------------------------------------------------------------
    | CORS Supports Credentials
    |--------------------------------------------------------------------------
    |
    | When responding to a credentialed requests request, the value of the
    | 'Access-Control-Allow-Credentials' header should be set to true, as it
    | tells the browser to expose the response to the frontend JavaScript code.
    */

    'supports_credentials' => false,
];
