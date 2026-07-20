<?php

use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\MapController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\LaporController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return view('home');
});

Route::get('/map', [MapController::class, 'index']);
Route::get('/map/geojson', [MapController::class, 'geojson']);
Route::post('/map/store', [MapController::class, 'store']);
Route::delete('/map/delete/{id}', [MapController::class, 'destroy']);
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth')->name('dashboard');

// Admin CRUD lapor from dashboard (Endministrator only)
Route::middleware('auth')->group(function () {
    Route::put('/dashboard/lapor/{id}', [DashboardController::class, 'updateLapor'])
        ->name('dashboard.lapor.update');
    Route::delete('/dashboard/lapor/{id}', [DashboardController::class, 'destroyLapor'])
        ->name('dashboard.lapor.destroy');
});

Route::delete('/profile', function () {
    $user = auth()->user();

    // Logout first
    auth()->logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    // Delete user
    $user->delete();

    return redirect('/')->with('status', 'Akun Anda telah dihapus.');
})->middleware('auth')->name('profile.destroy');

Route::get('/quiz', [QuizController::class, 'index']);
Route::post('/quiz/submit', [QuizController::class, 'submit']);

Route::get('/lapor', [LaporController::class, 'index']);
Route::post('/lapor/store', [LaporController::class, 'store']);
Route::put('/lapor/{id}', [LaporController::class, 'update']);
Route::delete('/lapor/{id}', [LaporController::class, 'destroy']);
Route::get('/lapor/geojson', [LaporController::class, 'geojson']);

// ── Keep-alive ping for external cron services (cron-job.org, etc.) ──
// Hits the same Supabase keep-alive command via HTTP.
// Call: GET /api/keepalive?token=YOUR_CRON_SECRET
Route::get('/api/keepalive', function () {
    $secret = env('KEEPALIVE_CRON_SECRET', 'kerban-keepalive-2024');
    if (request('token') !== $secret) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    Artisan::call('keepalive:supabase');
    return response()->json([
        'status'  => 'ok',
        'output'  => trim(Artisan::output()),
        'time'    => now()->toIso8601String(),
    ]);
});
