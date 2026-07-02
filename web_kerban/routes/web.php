<?php

use App\Http\Controllers\MapController;
use App\Http\Controllers\QuizController;

Route::get('/', function () {
    return view('home');
});

Route::get('/map', [MapController::class, 'index']);
Route::get('/map/geojson', [MapController::class, 'geojson']);
Route::post('/map/store', [MapController::class, 'store']);
Route::delete('/map/delete/{id}', [MapController::class, 'destroy']);
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth')->name('dashboard');

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
