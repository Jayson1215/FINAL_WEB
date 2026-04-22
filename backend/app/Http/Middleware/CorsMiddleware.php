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
        $allowedOrigins = [
            'https://finalweb-pied.vercel.app',
            'https://finalweb.vercel.app',
        ];

        // Get the origin from the request
        $origin = $request->header('Origin');

        // Check if origin is allowed or matches pattern
        $isAllowed = false;
        foreach ($allowedOrigins as $allowed) {
            if ($origin === $allowed) {
                $isAllowed = true;
                break;
            }
        }

        // Check if it matches the pattern for preview deployments
        if (!$isAllowed && preg_match('#^https://finalweb-.*\.vercel\.app$#', $origin)) {
            $isAllowed = true;
        }

        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            return $this->handlePreflightRequest($origin, $isAllowed);
        }

        // Regular request
        $response = $next($request);

        if ($isAllowed) {
            $response->header('Access-Control-Allow-Origin', $origin);
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            $response->header('Access-Control-Expose-Headers', 'Content-Length, X-JSON-Response-Body');
            $response->header('Access-Control-Allow-Credentials', 'true');
            $response->header('Access-Control-Max-Age', '86400');
        }

        return $response;
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

        if ($isAllowed) {
            $headers['Access-Control-Allow-Origin'] = $origin;
            $headers['Access-Control-Allow-Credentials'] = 'true';
        }

        return response('', 200, $headers);
    }
}
