<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('lapors', function (Blueprint $table) {
            $table->string('nama_pelapor')->after('judul')->nullable();
            $table->string('foto')->after('kategori')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('lapors', function (Blueprint $table) {
            $table->dropColumn(['nama_pelapor', 'foto']);
        });
    }
};
