<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Portfolio;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DebugController extends Controller
{
    public function health()
    {
        try {
            return response()->json([
                'status' => 'ok',
                'timestamp' => now(),
                'database' => [
                    'bookings' => Booking::count(),
                    'payments' => Payment::count(),
                ],
                'paymongo' => [
                    'live_mode' => str_starts_with(env('PAYMONGO_SECRET_KEY'), 'sk_live'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function forceFixPayment()
    {
        try {
            return DB::transaction(function () {
                // 1. Delete EVERYTHING first (Payments first to avoid constraint errors)
                Payment::query()->delete();
                Booking::query()->delete();
                
                // 2. Find a user and service
                $user = User::where('role', 'admin')->first() ?: User::first();
                $service = Service::where('name', 'like', '%Wedding%')->first() ?: Service::first();

                if (!$user || !$service) {
                    throw new \Exception("User or Service missing in database. Please run seeders.");
                }

                // 3. Create ONE clean booking
                $booking = Booking::create([
                    'id' => '019dc880-d0cf-714f-a24f-d172c876813b',
                    'user_id' => $user->id,
                    'service_id' => $service->id,
                    'booking_date' => now()->format('Y-m-d'),
                    'booking_time' => '12:00',
                    'status' => 'paid',
                    'total_amount' => 20,
                    'paid_amount' => 20,
                    'location' => 'Live Test Verified'
                ]);

                // 4. Create ONE clean payment linked to it
                Payment::create([
                    'id' => (string) Str::uuid(),
                    'booking_id' => $booking->id,
                    'amount' => 20,
                    'payment_method' => 'gcash',
                    'payment_status' => 'paid',
                    'transaction_reference' => 'TXN-LIVE-VERIFIED',
                    'paymongo_payment_id' => 'pay_9ykeNx9ZH5ozyDxfZLSAwff7',
                    'type' => 'full'
                ]);

                return response()->json([
                    'message' => 'Deep Cleanup Successful!',
                    'linked_to_user' => $user->name,
                    'records_remaining' => 1
                ]);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
