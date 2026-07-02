<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lapor extends Model
{
    protected $fillable = [
        'judul',
        'nama_pelapor',
        'deskripsi',
        'kategori',
        'lat',
        'lng',
        'foto'
    ];
}
