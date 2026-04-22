<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;

/**
 * Public Routes (No Authentication Required)
 */
Route::get('/health', [\App\Http\Controllers\DebugController::class, 'health']);
Route::get('/images/{filename}', function ($filename) {
    // Generate placeholder image URL using placeholder service
    $allowed = ['service_wedding.png', 'service_portrait.png', 'service_editorial.png', 'service_event.png', 
                 'portfolio_bride.png', 'portfolio_fashion.png', 'portfolio_newborn.png', 'portfolio_corporate.png',
                 'portfolio_architecture.png', 'portfolio_nature.png'];
    
    if (!in_array($filename, $allowed)) {
        return response()->json(['error' => 'File not found'], 404);
    }
    
    // Return placeholder image from placeholder service
    return redirect('https://via.placeholder.com/400x300?text=' . urlencode(pathinfo($filename, PATHINFO_FILENAME)));
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Social Authentication Routes
Route::get('/auth/{provider}/redirect', [\App\Http\Controllers\SocialAuthController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [\App\Http\Controllers\SocialAuthController::class, 'handleProviderCallback']);

// Public services and portfolio access (for browsing before login)
Route::get('/client/services', [ServiceController::class, 'index']);
Route::get('/client/services/{service}', [ServiceController::class, 'show']);
Route::get('/client/portfolio', [PortfolioController::class, 'index']);
Route::get('/client/portfolio/{portfolio}', [PortfolioController::class, 'show']);

/**
 * Protected Routes (Authentication Required)
 */
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
        Route::get('/client/bookings', [BookingController::class, 'index']);
        Route::post('/client/bookings', [BookingController::class, 'store']);
        Route::get('/client/bookings/{booking}', [BookingController::class, 'show']);
        Route::put('/client/bookings/{booking}', [BookingController::class, 'update']);
        Route::delete('/client/bookings/{booking}', [BookingController::class, 'destroy']);
        Route::post('/client/bookings/{booking}/cancel', [BookingController::class, 'requestCancellation']);

        // Payments routes (client)
        Route::post('/client/payments', [PaymentController::class, 'store']);
    });

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
        Route::get('/admin/reports', [PaymentController::class, 'reports']);
    });
});
