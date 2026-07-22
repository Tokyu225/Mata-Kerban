<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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
        if (!Gate::allows('manage-layers')) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $layer = MapLayer::create([
            'name' => $request->name ?? 'Objek Baru',
            'type' => $request->type ?? 'polygon',
            'geojson' => $request->geojson,
            'category' => $request->category ?? 'umum'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data berhasil disimpan',
            'id' => $layer->id
        ]);
    }

    // hapus layer
    public function destroy($id)
    {
        if (!Gate::allows('manage-layers')) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $layer = MapLayer::findOrFail($id);
        $layer->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data berhasil dihapus'
        ]);
    }

    // ambil semua data jadi GeoJSON
    public function geojson()
    {
        $layers = MapLayer::all();

        $features = [];

        foreach ($layers as $layer) {
            if (!$layer->geojson) continue;

            // geojson is stored as geometry JSON string, decode it
            $geometry = is_string($layer->geojson) ? json_decode($layer->geojson, true) : $layer->geojson;

            if (!$geometry) continue;

            $features[] = [
                "type" => "Feature",
                "geometry" => $geometry,
                "properties" => [
                    "id"           => $layer->id,
                    "name"         => $layer->name,
                    "category"     => $layer->category,
                    "label_field"  => $layer->label_field,
                    "symbology"    => $layer->symbology,
                    "source_layer" => $layer->source_layer,
                ]
            ];
        }

        return response()->json([
            "type" => "FeatureCollection",
            "features" => $features
        ]);
    }
}
