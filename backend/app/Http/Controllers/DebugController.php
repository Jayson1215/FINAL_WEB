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
            $servicesCount = $dbConnected ? Service::count() : 0;
            $portfoliosCount = $dbConnected ? Portfolio::count() : 0;
            $bookingsCount = $dbConnected ? Booking::count() : 0;
            $paymentsCount = $dbConnected ? Payment::count() : 0;
            
            return response()->json([
                'status' => 'ok',
                'timestamp' => now(),
                'app_url' => config('app.url'),
                'app_env' => config('app.env'),
                'database' => [
                    'connected' => $dbConnected,
                    'services_count' => $servicesCount,
                    'portfolios_count' => $portfoliosCount,
                    'bookings_count' => $bookingsCount,
                    'payments_count' => $paymentsCount,
                ],
                'paymongo' => [
                    'key_type' => str_starts_with(env('PAYMONGO_SECRET_KEY'), 'sk_live') ? 'LIVE' : 'TEST',
                    'key_set' => !empty(env('PAYMONGO_SECRET_KEY')),
                ]
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

    public function forceFixPayment()
    {
        try {
            $payments = \App\Models\Payment::where('amount', 20)->get();
            $count = 0;
            
            foreach ($payments as $payment) {
                $payment->update([
                    'paymongo_payment_id' => 'pay_9ykeNx9ZH5ozyDxfZLSAwff7',
                    'payment_status' => 'paid'
                ]);
                
                // Also restore the booking if missing
                if (!\App\Models\Booking::find($payment->booking_id)) {
                    \App\Models\Booking::create([
                        'id' => $payment->booking_id,
                        'user_id' => \App\Models\User::value('id'),
                        'service_id' => \App\Models\Service::where('name', 'like', '%Wedding%')->value('id'),
                        'booking_date' => '2026-04-26',
                        'booking_time' => '18:00',
                        'status' => 'paid',
                        'total_amount' => 20,
                        'paid_amount' => 20,
                        'location' => 'Emergency Recovery'
                    ]);
                }
                $count++;
            }
            
            return response()->json(['message' => "Fixed $count Payment records! All are now linked to Paymongo ID."]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
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
