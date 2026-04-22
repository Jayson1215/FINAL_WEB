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

        // Add CORS headers to response (check if not already set to avoid duplicates)
        if ($isAllowed && $origin) {
            // Use set() instead of header() to ensure replacement, not appending
            $response->headers->set('Access-Control-Allow-Origin', $origin, false);
            $response->headers->set('Access-Control-Allow-Credentials', 'true', false);
            $response->headers->set('Access-Control-Expose-Headers', 'Content-Length, X-JSON-Response-Body', false);
        }

        // These headers should always be present
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH', false);
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With', false);
        $response->headers->set('Access-Control-Max-Age', '86400', false);

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
            'https://final-web-ls8m.onrender.com',
            'https://finalweb-ew3vztz1y-jaysons-projects-5e0cbb2a.vercel.app',
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
