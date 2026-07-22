<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\MapLayer;

class ImportGdbLayers extends Command
{
    protected $signature = 'gis:import-gdb 
                            {--geojson-dir= : Path to GeoJSON directory}
                            {--truncate : Clear existing layers first}';

    protected $description = 'Import GeoJSON layers (converted from GDB) into map_layers table with symbology';

    /**
     * Layer configuration: label_field, category, symbology per shapefile name.
     * "field yg dipake sesuai nama shpnya" — label field derived from shapefile purpose.
     */
    private array $layerConfig = [
        // --- Toponim (Point) ---
        'NAMA_DUSUN' => [
            'category'    => 'toponim',
            'label_field' => 'KETERANGAN',
            'symbology'   => ['color' => '#1a73e8', 'fillColor' => '#1a73e8', 'fillOpacity' => 1, 'weight' => 1, 'radius' => 6],
        ],
        'NAMA_JALAN' => [
            'category'    => 'toponim',
            'label_field' => 'KETERANGAN',
            'symbology'   => ['color' => '#ea4335', 'fillColor' => '#ea4335', 'fillOpacity' => 1, 'weight' => 1, 'radius' => 6],
        ],
        // --- Sarana Prasarana (Point) ---
        'Sarana_Prasarana' => [
            'category'    => 'sarana',
            'label_field' => 'TOPONIM',
            'symbology'   => ['color' => '#34a853', 'fillColor' => '#34a853', 'fillOpacity' => 0.8, 'weight' => 1, 'radius' => 8],
        ],
        // --- Perairan (Point / Line / Area) ---
        'Perairan_Titik' => [
            'category'    => 'perairan',
            'label_field' => 'Toponimi',
            'symbology'   => ['color' => '#4285f4', 'fillColor' => '#4285f4', 'fillOpacity' => 0.9, 'weight' => 1, 'radius' => 6],
        ],
        'Perairan_Garis' => [
            'category'    => 'perairan',
            'label_field' => 'Toponimi',
            'symbology'   => ['color' => '#4285f4', 'weight' => 3, 'dashArray' => null],
        ],
        'Perairan_Area' => [
            'category'    => 'perairan',
            'label_field' => 'Toponimi',
            'symbology'   => ['color' => '#4285f4', 'fillColor' => '#a8d1ff', 'fillOpacity' => 0.5, 'weight' => 2],
        ],
        // --- Transportasi (Line) ---
        'Jaringan_Infrastruktur_Transportasi' => [
            'category'    => 'transportasi',
            'label_field' => 'Toponim',
            'symbology'   => ['color' => '#fbbc04', 'weight' => 3, 'dashArray' => null],
        ],
        // --- Penggunaan Lahan (Polygon) ---
        'PL_MERGE' => [
            'category'    => 'penggunaan_lahan',
            'label_field' => 'NAMOBJ',
            'symbology'   => ['color' => '#34a853', 'fillColor' => '#81c784', 'fillOpacity' => 0.4, 'weight' => 1.5],
        ],
        'PL_MERGE_Merge1' => [
            'category'    => 'penggunaan_lahan',
            'label_field' => 'NAMOBJ',
            'symbology'   => ['color' => '#34a853', 'fillColor' => '#81c784', 'fillOpacity' => 0.4, 'weight' => 1.5],
        ],
        'PLPERSIL2' => [
            'category'    => 'penggunaan_lahan',
            'label_field' => 'NAMOBJ',
            'symbology'   => ['color' => '#ff9800', 'fillColor' => '#ffcc80', 'fillOpacity' => 0.4, 'weight' => 1.5],
        ],
        // --- Persil (Polygon) ---
        'Persil_Kerban' => [
            'category'    => 'persil',
            'label_field' => 'NAMOBJ',
            'symbology'   => ['color' => '#9c27b0', 'fillColor' => '#ce93d8', 'fillOpacity' => 0.4, 'weight' => 1.5],
        ],
    ];

    public function handle(): int
    {
        $geojsonDir = $this->option('geojson-dir') ?? storage_path('app/geojson');

        if (!is_dir($geojsonDir)) {
            $this->error("Directory not found: $geojsonDir");
            return self::FAILURE;
        }

        if ($this->option('truncate')) {
            MapLayer::truncate();
            $this->warn('Existing map_layers truncated.');
        }

        $files = glob($geojsonDir . '/*.geojson');
        if (empty($files)) {
            $this->error("No GeoJSON files found in $geojsonDir");
            return self::FAILURE;
        }

        $imported = 0;
        $skipped  = 0;

        foreach ($files as $file) {
            $layerName = pathinfo($file, PATHINFO_FILENAME);
            $config    = $this->layerConfig[$layerName] ?? null;

            if (!$config) {
                $this->line("  <fg=yellow>⚠ $layerName — no config, skipping</>");
                $skipped++;
                continue;
            }

            $geojsonRaw = file_get_contents($file);
            $geojson    = json_decode($geojsonRaw, true);

            if (!$geojson || empty($geojson['features'])) {
                $this->line("  <fg=yellow>⚠ $layerName — empty, skipping</>");
                $skipped++;
                continue;
            }

            // Each feature becomes its own row (hardbaked per shape)
            foreach ($geojson['features'] as $feature) {
                $geometry = $feature['geometry'] ?? null;
                if (!$geometry) continue;

                $props = $feature['properties'] ?? [];

                // Determine display name from label_field
                $labelField = $config['label_field'];
                $name       = $props[$labelField] ?? ($props['NAMOBJ'] ?? ($props['TOPONIM'] ?? ($props['KETERANGAN'] ?? $layerName)));

                $type = match ($geometry['type']) {
                    'Point', 'MultiPoint'                     => 'point',
                    'LineString', 'MultiLineString'           => 'line',
                    'Polygon', 'MultiPolygon'                 => 'polygon',
                    default                                    => 'polygon',
                };

                MapLayer::create([
                    'name'         => $name,
                    'type'         => $type,
                    'geojson'      => $geometry,
                    'category'     => $config['category'],
                    'label_field'  => $labelField,
                    'symbology'    => $config['symbology'],
                    'source_layer' => $layerName,
                ]);

                $imported++;
            }

            $this->line("  <fg=green>✓ $layerName</> (" . count($geojson['features']) . " features)");
        }

        $this->newLine();
        $this->info("Done: $imported features imported, $skipped layers skipped.");
        return self::SUCCESS;
    }
}
