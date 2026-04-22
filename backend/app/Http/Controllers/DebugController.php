<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Portfolio;
use Illuminate\Support\Facades\DB;

class DebugController extends Controller
{
    public function health()
    {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now(),
            'database' => [
                'connected' => $this->testDatabaseConnection(),
                'services_count' => Service::count(),
                'portfolios_count' => Portfolio::count(),
            ],
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
