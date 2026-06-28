@extends('layouts.public')

@section('title', 'MyMap Dusun Kerban')

@section('styles')
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css"/>

    <style>
        html, body {
            margin: 0;
            height: 100%;
        }

        #map {
            height: 100vh;
            width: 100%;
        }

        /* Custom draw toolbar styling */
        .leaflet-draw-toolbar {
            margin-top: 0;
        }

        .leaflet-draw-toolbar a {
            background-color: #fff;
        }

        .draw-instruction {
            position: absolute;
            top: 10px;
            left: 60px;
            z-index: 1000;
            background: rgba(0,0,0,0.7);
            color: #fff;
            padding: 6px 14px;
            border-radius: 4px;
            font-family: Arial;
            font-size: 13px;
            pointer-events: none;
            display: none;
        }

        /* Category selector popup styling */
        .category-select {
            width: 100%;
            padding: 6px;
            margin: 6px 0;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
    </style>
@endsection

@section('content')
<div id="map"></div>
<div class="draw-instruction" id="drawInstruction">Klik pada peta untuk mulai menggambar</div>
@endsection

@section('scripts')
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"></script>

<script>
    // =============================================
    // INIT MAP
    // =============================================
    var map = L.map('map').setView([-7.8, 110.3], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | MyMap Dusun Kerban'
    }).addTo(map);

    // =============================================
    // LAYER GROUPS
    // =============================================
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var allLayers = {}; // track layers by id for delete

    // =============================================
    // DRAW CONTROLS
    // =============================================
    var drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true,
                shapeOptions: { color: '#2f6f3e', weight: 2 }
            },
            polyline: {
                shapeOptions: { color: '#e74c3c', weight: 3 }
            },
            rectangle: {
                shapeOptions: { color: '#3498db', weight: 2 }
            },
            circle: {
                shapeOptions: { color: '#e67e22', weight: 2 }
            },
            marker: true,
            circlemarker: false
        },
        edit: {
            featureGroup: drawnItems,
            remove: true
        }
    });
    map.addControl(drawControl);

    // =============================================
    // DRAW INSTRUCTIONS
    // =============================================
    var instructionEl = document.getElementById('drawInstruction');

    map.on(L.Draw.Event.DRAWSTART, function () {
        instructionEl.style.display = 'block';
    });

    map.on(L.Draw.Event.DRAWSTOP, function () {
        instructionEl.style.display = 'none';
    });

    // =============================================
    // HANDLE DRAW CREATED → SAVE TO SERVER
    // =============================================
    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);

        // Determine type from layer
        var type;
        if (layer instanceof L.Marker) type = 'point';
        else if (layer instanceof L.Polyline && !(layer instanceof L.Polygon) && !(layer instanceof L.Rectangle) && !(layer instanceof L.Circle)) type = 'line';
        else type = 'polygon';

        var geojson = layer.toGeoJSON();
        var geojsonStr = JSON.stringify(geojson.geometry);

        // Default values (prompt fallback for real browsers)
        var category = 'umum';
        var name = 'Objek Baru';

        // Use prompt only if available (real browser), else use defaults
        try {
            var catInput = prompt('Kategori (umum, UMKM, fasilitas, batas, sawah):', 'umum');
            if (catInput) category = catInput;
            var nameInput = prompt('Nama objek:', 'Objek Baru');
            if (nameInput) name = nameInput;
        } catch (e) {
            // prompt not available (headless/test env), use defaults
        }

        // Get CSRF token
        var csrf = document.querySelector('meta[name="csrf-token"]');
        var token = csrf ? csrf.getAttribute('content') : '';

        // Save to server
        fetch('/map/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                type: type,
                geojson: geojsonStr,
                category: category
            })
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            console.log('Saved:', data);
            if (data.id) {
                layer._mapLayerId = data.id;
            }
            // Update popup with info
            layer.bindPopup('<b>' + name + '</b><br>Kategori: ' + category + '<br>ID: ' + (data.id || '?'));
        })
        .catch(function (err) {
            console.error('Save failed:', err);
        });

        instructionEl.style.display = 'none';
    });

    // =============================================
    // HANDLE DRAW DELETED → REMOVE FROM SERVER
    // =============================================
    map.on(L.Draw.Event.DELETED, function (event) {
        var layers = event.layers;
        var csrf = document.querySelector('meta[name="csrf-token"]');
        var token = csrf ? csrf.getAttribute('content') : '';

        layers.eachLayer(function (layer) {
            if (layer._mapLayerId) {
                fetch('/map/delete/' + layer._mapLayerId, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': token,
                        'Accept': 'application/json'
                    }
                })
                .then(function (r) { return r.json(); })
                .then(function (d) {
                    console.log('Deleted:', d);
                })
                .catch(function (err) {
                    console.error('Delete failed:', err);
                });
            }
        });
    });

    // =============================================
    // LOAD EXISTING FEATURES FROM SERVER
    // =============================================
    function loadFeatures() {
        fetch('/map/geojson')
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (!data.features) return;

                L.geoJSON(data, {
                    style: function (feature) {
                        var cat = feature.properties.category;
                        var colors = {
                            'umum': '#2f6f3e',
                            'UMKM': '#e67e22',
                            'fasilitas': '#3498db',
                            'batas': '#e74c3c',
                            'sawah': '#27ae60'
                        };
                        return {
                            color: colors[cat] || '#2f6f3e',
                            weight: 2,
                            fillOpacity: 0.2
                        };
                    },
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng);
                    },
                    onEachFeature: function (feature, layer) {
                        layer._mapLayerId = feature.properties.id;

                        var popup = '<b>' + (feature.properties.name || 'Tanpa Nama') + '</b><br>' +
                                    'Kategori: ' + (feature.properties.category || '-') + '<br>' +
                                    'ID: ' + feature.properties.id;

                        layer.bindPopup(popup);
                    }
                }).addTo(drawnItems);
            })
            .catch(function (err) {
                console.error('Load features failed:', err);
            });
    }

    // Load on start
    loadFeatures();

    // =============================================
    // BASE LAYERS
    // =============================================
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    });

    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri &copy;'
    });

    var baseMaps = {
        "Peta Jalan": osm,
        "Satelit": satellite
    };

    var overlayMaps = {
        "Layer Gambar": drawnItems
    };

    L.control.layers(baseMaps, overlayMaps, { position: 'topright', collapsed: false }).addTo(map);

    // =============================================
    // TITLE CONTROL
    // =============================================
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
