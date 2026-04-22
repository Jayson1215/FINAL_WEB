<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CorsMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // CORS middleware must run first, before all others
        $middleware->prepend(CorsMiddleware::class);
        
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, $request) {
            // Add CORS headers to error responses
            if ($request->expectsJson() || str_starts_with($request->path(), 'api')) {
                $origin = $request->header('Origin');
                
                // Check if origin is allowed
                $allowedOrigins = [
                    'https://finalweb-pied.vercel.app',
                    'https://finalweb.vercel.app',
                    'http://localhost:5173',
                    'http://localhost:5174',
                    'http://localhost:8000',
                    'http://127.0.0.1:5173',
                    'http://127.0.0.1:5174',
                ];
                
                $isAllowed = in_array($origin, $allowedOrigins) || 
                            ($origin && preg_match('#^https://finalweb-.*\.vercel\.app$#', $origin));
                
                if ($isAllowed && $origin) {
                    return response()->json([
                        'message' => $e->getMessage(),
                        'error' => class_basename($e),
                    ], $e->getCode() ?: 500)->header('Access-Control-Allow-Origin', $origin)
                        ->header('Access-Control-Allow-Credentials', 'true')
                        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
                        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
                }
            }
        });
    })->create();
