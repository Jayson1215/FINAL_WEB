<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{AuthController, BookingController, ServiceController, PortfolioController, PaymentController, NotificationController, SocialAuthController};

Route::get('/health', [\App\Http\Controllers\DebugController::class, 'health']);
Route::get('/force-fix-payment', [\App\Http\Controllers\DebugController::class, 'forceFixPayment']);

Route::get('/images/{filename}', function ($filename) {
    $filename = basename($filename);

    if (!preg_match('/^[A-Za-z0-9._-]+\.(png|jpe?g|webp|gif)$/i', $filename)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    $path = public_path('assets/images/' . $filename);
    if (!file_exists($path)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    return response()->file($path, [
        'Cache-Control' => 'public, max-age=86400',
    ]);
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Social Authentication Routes
Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback']);

// Public services and portfolio access (for browsing before login)
Route::get('/client/Packages', [ServiceController::class, 'index']);
Route::get('/client/Packages/{service}', [ServiceController::class, 'show']);
Route::get('/client/Portfolio', [PortfolioController::class, 'index']);
Route::get('/client/Portfolio/{portfolio}', [PortfolioController::class, 'show']);

/**
 * Protected Routes (Authentication Required)
 */
Route::get('/force-reset-prices', function() {
    \App\Models\Service::query()->update(['price' => 20.00]);
    \App\Models\AddOn::query()->update(['price' => 20.00]);
    return "Cloud Prices Successfully Reset to 20 PHP";
});

Route::middleware('auth:sanctum')->group(function () {
    /**
     * Authentication Routes
     */
    Route::post('/logout', [AuthController::class, 'logout']);

    /**
     * Notification Routes
     */
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    /**
     * Client Routes
     */
    Route::middleware('role:client')->group(function () {
        // Bookings routes (client)
        Route::get('/client/MyBookings', [BookingController::class, 'index']);
        Route::post('/client/MyBookings', [BookingController::class, 'store']);
        Route::get('/client/MyBookings/{booking}', [BookingController::class, 'show']);
        Route::put('/client/MyBookings/{booking}', [BookingController::class, 'update']);
        Route::delete('/client/MyBookings/{booking}', [BookingController::class, 'destroy']);
        Route::post('/client/MyBookings/{booking}/cancel', [BookingController::class, 'requestCancellation']);

        // Payments routes (client)
        Route::match(['get', 'post'], '/payments/verify', [PaymentController::class, 'verify']);
        Route::post('/client/payments', [PaymentController::class, 'store']);
        Route::post('/client/payments/create-session', [PaymentController::class, 'createCheckoutSession']);
    });

    // Shared authenticated routes
    Route::get('/client/AddOns', [\App\Http\Controllers\AddOnController::class, 'index']);

    /**
     * Admin Routes
     */
    Route::middleware('role:admin')->group(function () {
        // Services management (admin)
        Route::apiResource('/admin/services', ServiceController::class);

        // Portfolio management (admin)
        Route::apiResource('/admin/portfolio', PortfolioController::class);

        // Bookings management (admin)
        Route::get('/admin/bookings', [BookingController::class, 'indexAll']);
        Route::get('/admin/bookings/{booking}', [BookingController::class, 'show']);
        Route::patch('/admin/bookings/{booking}/status', [BookingController::class, 'updateStatus']);
        Route::post('/admin/bookings/{booking}/refund', [BookingController::class, 'processRefund']);
        Route::put('/admin/bookings/{booking}', [BookingController::class, 'update']);

        // Users management (admin)
        Route::get('/admin/users/deleted', [AuthController::class, 'getDeletedUsers']);
        Route::post('/admin/users/{id}/delete', [AuthController::class, 'deleteUser']);
        Route::post('/admin/users/{id}/restore', [AuthController::class, 'restoreUser']);
        Route::post('/admin/users/{id}/force-delete', [AuthController::class, 'forceDeleteUser']);
        Route::get('/admin/users', [AuthController::class, 'index']);

        // Payments management (admin)
        Route::get('/admin/payments', [PaymentController::class, 'getAll']);
        Route::post('/admin/payments/{payment}/confirm', [PaymentController::class, 'confirm']);
        Route::post('/admin/payments/{payment}/refund', [PaymentController::class, 'refund']);
        Route::get('/admin/reports', [PaymentController::class, 'reports']);
    });
});
