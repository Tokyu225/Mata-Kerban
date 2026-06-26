@extends('layouts.public')

@section('styles')
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

    <style>
        html, body {
            margin: 0;
            height: 100%;
        }

        #map {
            height: calc(100vh - 56px);
            width: 100%;
        }
    </style>
@endsection

@section('content')
<div id="map"></div>
@endsection

@section('scripts')
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
    var map = L.map('map').setView([-7.8, 110.3], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap'
    }).addTo(map);

    L.marker([-7.8, 110.3]).addTo(map)
        .bindPopup("Dusun Kerban")
        .openPopup();

    // Map title control — bottom left
    var titleControl = L.control({ position: 'bottomleft' });
    titleControl.onAdd = function () {
        var div = L.DomUtil.create('div', 'map-title');
        div.innerHTML = '🗺️ MyMap Dusun Kerban';
        div.style.cssText = 'background: white; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-family: Arial; font-size: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);';
        return div;
    };
    titleControl.addTo(map);
</script>
@endsection
