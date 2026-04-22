<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Portfolio;
use Illuminate\Support\Facades\DB;

class DebugController extends Controller
{
    public function health()
    {
        try {
            $dbConnected = $this->testDatabaseConnection();
            $servicesCount = $dbConnected ? Service::count() : 0;
            $portfoliosCount = $dbConnected ? Portfolio::count() : 0;
            
            return response()->json([
                'status' => 'ok',
                'timestamp' => now(),
                'app_url' => config('app.url'),
                'app_env' => config('app.env'),
                'database' => [
                    'connected' => $dbConnected,
                    'services_count' => $servicesCount,
                    'portfolios_count' => $portfoliosCount,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'timestamp' => now(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
            'url' => config('app.url'),
        ]);
    }

    private function testDatabaseConnection()
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
