<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->header('Origin');

        // Check if origin is allowed
        $isAllowed = $this->isOriginAllowed($origin);

        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            return $this->handlePreflightRequest($origin, $isAllowed);
        }

        // Process the request
        $response = $next($request);

        // Add CORS headers to response
        if ($isAllowed && $origin) {
            $response->header('Access-Control-Allow-Origin', $origin);
            $response->header('Access-Control-Allow-Credentials', 'true');
            $response->header('Access-Control-Expose-Headers', 'Content-Length, X-JSON-Response-Body');
        }

        // These headers should always be present
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        $response->header('Access-Control-Max-Age', '86400');

        return $response;
    }

    /**
     * Check if origin is allowed
     */
    private function isOriginAllowed($origin): bool
    {
        if (!$origin) {
            return false;
        }

        // Hardcoded allowed origins
        $hardcodedOrigins = [
            'https://finalweb-pied.vercel.app',
            'https://finalweb.vercel.app',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:8000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
        ];

        // Check hardcoded origins
        if (in_array($origin, $hardcodedOrigins)) {
            return true;
        }

        // Check patterns
        $patterns = [
            '#^https://finalweb-.*\.vercel\.app$#',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $origin)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Handle preflight requests.
     */
    private function handlePreflightRequest($origin, $isAllowed)
    {
        $headers = [
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Max-Age' => '86400',
        ];

        if ($isAllowed && $origin) {
            $headers['Access-Control-Allow-Origin'] = $origin;
            $headers['Access-Control-Allow-Credentials'] = 'true';
        }

        return response('', 200, $headers);
    }
}
