<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MapLayer extends Model
{
    protected $table = 'map_layers';

    protected $fillable = [
        'name',
        'type',
        'geojson',
        'category'
    ];

    protected $casts = [
        'geojson' => 'array'
    ];
}
