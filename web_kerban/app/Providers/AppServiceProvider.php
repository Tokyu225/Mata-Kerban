<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Only Endministrator can draw/modify maps
        Gate::define('draw-maps', fn (?User $user) =>
            $user?->isEndministrator() ?? false
        );

        Gate::define('manage-layers', fn (?User $user) =>
            $user?->isEndministrator() ?? false
        );
    }
}
