<?php

use App\Http\Controllers\MapController;

Route::get('/', function () {
    return view('home');
});

Route::get('/map', [MapController::class, 'index']);
Route::get('/map/geojson', [MapController::class, 'geojson']);
Route::post('/map/store', [MapController::class, 'store']);
Route::get('/map', function () {
    return view('map.index');
});
Route::get('/dashboard', [MapController::class, 'dashboard'])->name('dashboard');
