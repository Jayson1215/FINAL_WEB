<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Exception handler - middleware handles CORS headers, so we just return JSON
        $exceptions->render(function (\Throwable $e, $request) {
            if ($request->expectsJson() || str_starts_with($request->path(), 'api')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => class_basename($e),
                ], $e->getCode() ?: 500);
            }
        });
    })->create();
