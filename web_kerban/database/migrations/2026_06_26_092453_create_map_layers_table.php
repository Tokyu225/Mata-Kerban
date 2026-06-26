<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('map_layers', function (Blueprint $table) {
            $table->id();

            // nama layer
            $table->string('name');

            // tipe geometry
            $table->enum('type', ['point', 'line', 'polygon']);

            // simpan geojson (simple version dulu)
            $table->json('geojson');

            // kategori (UMKM, fasilitas, batas RT, dll)
            $table->string('category')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('map_layers');
    }
};
