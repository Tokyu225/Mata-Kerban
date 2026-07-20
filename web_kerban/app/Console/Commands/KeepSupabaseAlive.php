<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KeepSupabaseAlive extends Command
{
    protected $signature = 'keepalive:supabase';
    protected $description = 'Ping Supabase to prevent free-tier pausing from inactivity';

    public function handle(): int
    {
        $supabaseUrl = rtrim(env('SUPABASE_URL', ''), '/');
        $anonKey    = env('SUPABASE_PUBLISHABLE_KEY', '');
        $projectRef = env('VITE_SUPABASE_URL', $supabaseUrl);

        if (!$projectRef && !$supabaseUrl) {
            Log::warning('KeepSupabaseAlive: No Supabase URL configured.');
            $this->warn('No Supabase URL configured — skipping.');
            return self::FAILURE;
        }

        $results = [];

        // 1) Health / REST ping — keeps the PostgREST / project alive
        $healthUrl = rtrim($projectRef ?: $supabaseUrl, '/') . '/rest/v1/';
        try {
            $res = Http::timeout(10)
                ->withHeaders(array_filter([
                    'apikey' => $anonKey,
                    'Authorization' => $anonKey ? "Bearer {$anonKey}" : null,
                ]))
                ->get($healthUrl);

            $results['rest'] = $res->successful()
                ? 'OK (' . $res->status() . ')'
                : 'FAIL (' . $res->status() . ')';
        } catch (\Throwable $e) {
            $results['rest'] = 'ERROR: ' . $e->getMessage();
        }

        // 2) Storage ping — keeps the S3-compatible storage warm
        $storageUrl = rtrim($projectRef ?: $supabaseUrl, '/') . '/storage/v1/bucket';
        try {
            $res = Http::timeout(10)
                ->withHeaders(array_filter([
                    'apikey' => $anonKey,
                    'Authorization' => $anonKey ? "Bearer {$anonKey}" : null,
                ]))
                ->get($storageUrl);

            $results['storage'] = $res->successful()
                ? 'OK (' . $res->status() . ')'
                : 'FAIL (' . $res->status() . ')';
        } catch (\Throwable $e) {
            $results['storage'] = 'ERROR: ' . $e->getMessage();
        }

        // 3) Auth ping — keeps the GoTrue auth service warm
        $authUrl = rtrim($projectRef ?: $supabaseUrl, '/') . '/auth/v1/health';
        try {
            $res = Http::timeout(10)
                ->withHeaders(array_filter([
                    'apikey' => $anonKey,
                    'Authorization' => $anonKey ? "Bearer {$anonKey}" : null,
                ]))
                ->get($authUrl);

            $results['auth'] = $res->successful()
                ? 'OK (' . $res->status() . ')'
                : 'FAIL (' . $res->status() . ')';
        } catch (\Throwable $e) {
            $results['auth'] = 'ERROR: ' . $e->getMessage();
        }

        $summary = json_encode($results);
        Log::info("KeepSupabaseAlive ping results: {$summary}");
        $this->info("Supabase keep-alive pinged: {$summary}");

        return self::SUCCESS;
    }
}
