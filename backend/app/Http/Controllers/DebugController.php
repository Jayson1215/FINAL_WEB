<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Portfolio;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class DebugController extends Controller
{
    public function health()
    {
        try {
            $dbConnected = $this->testDatabaseConnection();
            
            return response()->json([
                'status' => 'ok',
                'timestamp' => now(),
                'database' => [
                    'connected' => $dbConnected,
                    'bookings' => $dbConnected ? Booking::count() : 0,
                    'payments' => $dbConnected ? Payment::count() : 0,
                ],
                'paymongo' => [
                    'live_mode' => str_starts_with(env('PAYMONGO_SECRET_KEY'), 'sk_live'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
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
