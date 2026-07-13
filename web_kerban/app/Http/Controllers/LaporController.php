<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Lapor;

class LaporController extends Controller
{
    // halaman peta & form lapor
    public function index()
    {
        $lapor = Lapor::all();
        return view('lapor.index', compact('lapor'));
    }

    // simpan lapor baru
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'nama_pelapor' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'kategori' => 'nullable|string',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['judul', 'nama_pelapor', 'deskripsi', 'kategori', 'lat', 'lng']);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('lapor_fotos', 'supabase');
            $data['foto'] = $path;
        }

        Lapor::create($data);

        return response()->json(['status' => 'success']);
    }

    public function update(Request $request, $id)
    {
        $lapor = Lapor::findOrFail($id);

        $request->validate([
            'judul' => 'required|string|max:255',
            'nama_pelapor' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'kategori' => 'nullable|string',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['judul', 'nama_pelapor', 'deskripsi', 'kategori', 'lat', 'lng']);

        if ($request->hasFile('foto')) {
            if ($lapor->foto) {
                Storage::disk('supabase')->delete($lapor->foto);
            }
            $data['foto'] = $request->file('foto')->store('lapor_fotos', 'supabase');
        }

        $lapor->update($data);

        return response()->json(['status' => 'success']);
    }

    public function destroy($id)
    {
        $lapor = Lapor::findOrFail($id);
        if ($lapor->foto) {
            Storage::disk('supabase')->delete($lapor->foto);
        }
        $lapor->delete();
        return response()->json(['status' => 'success']);
    }

    // ambil semua lapor sebagai GeoJSON
    public function geojson()
    {
        $lapor = Lapor::all();

        $features = $lapor->map(function ($lap) {
            return [
                'type' => 'Feature',
                'geometry' => [
                    'type' => 'Point',
                    'coordinates' => [(float)$lap->lng, (float)$lap->lat],
                ],
                'properties' => [
                    'judul' => $lap->judul,
                    'nama_pelapor' => $lap->nama_pelapor,
                    'deskripsi' => $lap->deskripsi,
                    'kategori' => $lap->kategori,
                    'foto' => $lap->foto ? asset('storage/' . $lap->foto) : null,
                ]
            ];
        });

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features
        ]);
    }
}
