<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class KeepAlive extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'keepalive:ping
                            {--url= : Custom URL to ping (defaults to APP_URL/up)}
                            {--endpoint=up : Health check endpoint path}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ping the application health endpoint to keep the server alive';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $baseUrl = $this->option('url') ?: config('app.url');
        $endpoint = $this->option('endpoint');
        $url = rtrim($baseUrl, '/') . '/' . ltrim($endpoint, '/');

        $this->info("[keepalive] Pinging: {$url}");

        try {
            $response = Http::timeout(15)->get($url);

            if ($response->successful()) {
                $this->info("[keepalive] OK — HTTP {$response->status()} at " . now()->toDateTimeString());
                return self::SUCCESS;
            }

            $this->warn("[keepalive] WARN — HTTP {$response->status()} at " . now()->toDateTimeString());
            return self::FAILURE;

        } catch (\Throwable $e) {
            $this->error("[keepalive] FAIL — {$e->getMessage()} at " . now()->toDateTimeString());
            return self::FAILURE;
        }
    }
}
