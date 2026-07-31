<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatrolController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GuardController;

/*
|--------------------------------------------------------------------------
| API Routes - AYOLA OCARINA PATROLI SATPAM
|--------------------------------------------------------------------------
*/

// Public Auth Routes
Route::post('/v1/auth/login', [AuthController::class, 'login']);

// Guard & Admin Protected Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/v1/auth/me', [AuthController::class, 'me']);
    
    // Patrol Scanner & Submission
    Route::post('/v1/patrol/verify-qr', [PatrolController::class, 'verifyQrCode']);
    Route::post('/v1/patrol/submit', [PatrolController::class, 'submitPatrol']);
    Route::get('/v1/patrol/history', [PatrolController::class, 'history']);

    // Admin Monitoring & Management Endpoints
    Route::prefix('v1/admin')->group(function () {
        Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
        Route::get('/live-map', [DashboardController::class, 'liveMap']);
        Route::get('/logs', [DashboardController::class, 'logs']);
        Route::post('/points', [DashboardController::class, 'createPoint']);
        Route::get('/reports/export', [DashboardController::class, 'exportReport']);

        // Guard Management Routes
        Route::get('/guards', [GuardController::class, 'index']);
        Route::post('/guards', [GuardController::class, 'store']);
        Route::delete('/guards/{id}', [GuardController::class, 'destroy']);
    });
});
