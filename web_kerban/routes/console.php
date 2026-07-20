<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ── Keep Supabase alive ──────────────────────────────────────────
// Pings Supabase REST, Storage, and Auth every 5 minutes so the
// free-tier project doesn't get paused for inactivity.
Schedule::command('keepalive:supabase')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->runInBackground()
    ->evenInMaintenanceMode()
    ->appendOutputTo(storage_path('logs/supabase-keepalive.log'));
