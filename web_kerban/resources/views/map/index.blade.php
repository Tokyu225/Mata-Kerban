<!DOCTYPE html>
<html>
<head>
    <title>MyMap Dusun Kerban</title>

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

    <style>
        html, body {
            margin: 0;
            height: 100%;
        }

        #map {
            height: 100vh;
            width: 100%;
        }

        .title {
            position: absolute;
            z-index: 9999;
            background: white;
            padding: 10px;
            margin: 10px;
            border-radius: 8px;
            font-family: Arial;
        }
    </style>
</head>
<body>

<div class="title">
    🗺️ MyMap Dusun Kerban
</div>

<div id="map"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
    var map = L.map('map').setView([-7.8, 110.3], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'OpenStreetMap'
    }).addTo(map);

    L.marker([-7.8, 110.3]).addTo(map)
        .bindPopup("Dusun Kerban")
        .openPopup();
</script>

</body>
</html>
