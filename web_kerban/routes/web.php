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
Route::get('/dashboard', [MapController::class, 'dashboard'])->name('dashboard');

Route::get('/quiz', [QuizController::class, 'index']);
Route::post('/quiz/submit', [QuizController::class, 'submit']);
