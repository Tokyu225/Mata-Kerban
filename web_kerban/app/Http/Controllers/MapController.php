<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MapLayer;

class MapController extends Controller
{
    // halaman map
    public function index()
    {
        return view('map.index');
    }

    // simpan data dari leaflet draw
    public function store(Request $request)
    {
        MapLayer::create([
            'name' => 'Objek Baru',
            'type' => $request->type ?? 'polygon',
            'geojson' => $request->geojson,
            'category' => $request->category ?? 'umum'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data berhasil disimpan'
        ]);
    }

    // ambil semua data jadi GeoJSON
    public function geojson()
    {
        $layers = MapLayer::all();

        $features = [];

        foreach ($layers as $layer) {

            if (!$layer->geojson) continue;

            $features[] = [
                "type" => "Feature",
                "geometry" => $layer->geojson["geometry"] ?? null,
                "properties" => [
                    "id" => $layer->id,
                    "name" => $layer->name,
                    "category" => $layer->category
                ]
            ];
        }

        return response()->json([
            "type" => "FeatureCollection",
            "features" => $features
        ]);
    }
}
