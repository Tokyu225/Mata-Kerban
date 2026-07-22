<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('map_layers', function (Blueprint $table) {
            // field untuk label / popup (sesuai nama shapefile)
            $table->string('label_field')->nullable()->after('category');

            // simbologi: JSON { color, fillColor, fillOpacity, weight, radius, icon, dashArray etc }
            $table->json('symbology')->nullable()->after('label_field');

            // source file asli (nama layer dari GDB)
            $table->string('source_layer')->nullable()->after('symbology');
        });
    }

    public function down(): void
    {
        Schema::table('map_layers', function (Blueprint $table) {
            $table->dropColumn(['label_field', 'symbology', 'source_layer']);
        });
    }
};
