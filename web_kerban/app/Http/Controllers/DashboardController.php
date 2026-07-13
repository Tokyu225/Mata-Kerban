<?php

namespace App\Http\Controllers;

use App\Models\Lapor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index()
    {
        $lapors = Lapor::orderBy('created_at', 'desc')->get();
        return view('dashboard', compact('lapors'));
    }

    /**
     * Update a lapor from the admin dashboard.
     */
    public function updateLapor(Request $request, $id)
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

        return redirect()->route('dashboard')->with('status', 'Laporan berhasil diperbarui.');
    }

    /**
     * Delete a lapor from the admin dashboard.
     */
    public function destroyLapor($id)
    {
        $lapor = Lapor::findOrFail($id);
        if ($lapor->foto) {
            Storage::disk('supabase')->delete($lapor->foto);
        }
        $lapor->delete();

        return redirect()->route('dashboard')->with('status', 'Laporan berhasil dihapus.');
    }
}
