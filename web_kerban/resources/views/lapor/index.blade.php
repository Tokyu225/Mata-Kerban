@extends('layouts.public')

@section('title', 'Lapor Kejadian - Desa Kerban')

@section('styles')
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"/>

    <style>
        :root {
            --green: #2f6f3e;
            --green-dark: #1a4d2e;
            --green-light: #e8f5e9;
            --radius: 20px;
            --radius-sm: 14px;
            --shadow: 0 2px 16px rgba(0,0,0,.07);
        }

        /* ── Header ── */
        .lapor-header {
            background: linear-gradient(135deg, var(--green-dark) 0%, var(--green) 100%);
            color: white;
            border-radius: 0 0 var(--radius) var(--radius);
            padding: 50px 0 40px;
            position: relative;
            overflow: hidden;
        }
        .lapor-header::after {
            content: ""; position: absolute; top: -40%; right: -10%;
            width: 300px; height: 300px;
            background: radial-gradient(circle, rgba(255,255,255,.08) 0%, transparent 70%);
            border-radius: 50%; pointer-events: none;
        }
        .lapor-header h2 { position: relative; z-index: 1; font-weight: 800; font-size: clamp(1.4rem, 4vw, 2.2rem); }
        .lapor-header p { position: relative; z-index: 1; font-size: clamp(0.85rem, 2vw, 1.05rem); }
        .lapor-badge {
            display: inline-flex; align-items: center; padding: 5px 14px;
            font-size: 0.78rem; border-radius: 50px;
            background: rgba(255,255,255,.15); color: white;
            border: 1px solid rgba(255,255,255,.2);
            backdrop-filter: blur(4px);
        }

        /* ── Mode Toggle ── */
        .mode-toggle-wrap {
            display: flex; align-items: center; gap: 10px;
            background: #fff; padding: 5px 6px; border-radius: 50px;
            box-shadow: var(--shadow); border: 1px solid #e8ece8;
        }
        .mode-toggle-btn {
            border: none; background: transparent; padding: 8px 20px;
            border-radius: 50px; font-weight: 600; font-size: 0.88rem;
            color: #6c757d; cursor: pointer; transition: all .25s;
            white-space: nowrap;
        }
        .mode-toggle-btn.active {
            background: var(--green); color: white; box-shadow: 0 2px 8px rgba(47,111,62,.25);
        }
        .mode-toggle-btn i { margin-right: 4px; }

        /* ── Cards ── */
        .card-custom {
            border: none; border-radius: var(--radius); box-shadow: var(--shadow);
            background: #fff; overflow: hidden;
        }
        .card-custom .card-header {
            background: #fff; border-bottom: 1px solid #eef2ef;
            padding: 16px 20px;
        }

        /* ── Map ── */
        #map { width: 100%; border-radius: var(--radius-sm); }
        #map.simple-map { height: 220px; }
        #map.full-map { height: 420px; }

        /* ── Simple mode card ── */
        .simple-card {
            border: none; border-radius: var(--radius); box-shadow: var(--shadow);
            background: #fff; overflow: hidden;
        }
        .simple-card .card-body { padding: clamp(16px, 3vw, 28px); }

        .input-simple {
            border-radius: var(--radius-sm); padding: 14px 18px;
            border: 2px solid #e0e6e1; font-size: 1rem;
            transition: border-color .25s, box-shadow .25s;
            width: 100%;
        }
        .input-simple:focus {
            border-color: var(--green); box-shadow: 0 0 0 4px rgba(47,111,62,.08);
            outline: none;
        }
        textarea.input-simple {
            resize: vertical; min-height: 120px;
        }

        .btn-lapor-besar {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            width: 100%; padding: 16px; border-radius: var(--radius-sm);
            font-size: 1.1rem; font-weight: 700; border: none;
            background: var(--green); color: white;
            transition: all .3s; cursor: pointer;
        }
        .btn-lapor-besar:hover {
            background: var(--green-dark); transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(47,111,62,.3);
        }
        .btn-lapor-besar:active { transform: scale(0.98); }
        .btn-lapor-besar.loading { opacity: .7; pointer-events: none; }

        .location-badge {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 8px 14px; border-radius: 50px;
            background: var(--green-light); color: var(--green);
            font-weight: 600; font-size: 0.85rem;
        }
        .location-badge.pending {
            background: #fff3cd; color: #856404;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%,100% { opacity: 1; } 50% { opacity: .6; }
        }

        /* ── Form fields (complete mode) ── */
        .form-control, .form-select {
            border-radius: var(--radius-sm); padding: 12px 16px;
            border: 1px solid #dde5dc; font-size: 0.95rem;
            transition: border-color .25s, box-shadow .25s;
        }
        .form-control:focus, .form-select:focus {
            border-color: var(--green); box-shadow: 0 0 0 3px rgba(47,111,62,.1);
            outline: none;
        }
        .form-label { font-weight: 600; color: #2d3a2d; font-size: 0.9rem; margin-bottom: 4px; }
        .coord-input {
            background: #f8faf8 !important; color: var(--green) !important;
            font-weight: 600; font-family: 'SF Mono', 'Cascadia Code', monospace; font-size: 0.85rem;
        }

        /* ── Locate button ── */
        .btn-locate {
            border-radius: 50px; padding: 8px 18px; font-weight: 600;
            font-size: 0.85rem; background: var(--green); color: white;
            border: none; cursor: pointer; transition: all .2s; white-space: nowrap;
        }
        .btn-locate:hover { background: var(--green-dark); transform: translateY(-1px); }
        .btn-locate.loading { opacity: .7; pointer-events: none; }

        /* ── Popup ── */
        .report-popup { min-width: 220px; max-width: 280px; font-size: 0.9rem; }
        .report-popup .popup-title { font-weight: 700; color: var(--green); margin-bottom: .3rem; }
        .report-popup .popup-meta { font-size: 0.82rem; color: #6c757d; margin-bottom: .6rem; }
        .report-popup .popup-description { color: #343a40; margin-bottom: .6rem; }
        .report-popup .popup-badge {
            display: inline-flex; padding: .25rem .65rem; font-size: .75rem;
            border-radius: 999px; background: var(--green-light); color: var(--green);
        }
        .report-popup .popup-photo { margin-top: .6rem; border-radius: 10px; overflow: hidden; }
        .report-popup .popup-photo img { width: 100%; height: 140px; object-fit: cover; }

        /* ── Category markers ── */
        .category-marker { display: block; width: 30px; height: 42px; position: relative; }
        .category-marker .marker-pin {
            width: 30px; height: 30px; border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg); position: absolute; left: 0; top: 0;
            box-shadow: 0 4px 10px rgba(0,0,0,.25); border: 2px solid white;
        }
        .category-marker .marker-dot {
            width: 10px; height: 10px; background: white; border-radius: 50%;
            position: absolute; left: 10px; top: 10px;
        }

        /* ── Guide / tips ── */
        .guide-box {
            border: none; border-radius: var(--radius-sm);
            background: #f0f7f1; border-left: 4px solid var(--green);
            padding: 16px 20px; font-size: 0.9rem;
        }

        /* ── Dark mode ── */
        body.dark-mode .card-custom,
        body.dark-mode .simple-card,
        body.dark-mode .mode-toggle-wrap {
            background: #16281b !important; color: #d4ddd6;
        }
        body.dark-mode .card-custom .card-header { background: #16281b !important; border-color: #2a4030; }
        body.dark-mode .form-control, body.dark-mode .form-select, body.dark-mode .input-simple {
            background: #1a3020 !important; border-color: #2a4030 !important; color: #d4ddd6 !important;
        }
        body.dark-mode .form-control:focus, body.dark-mode .form-select:focus, body.dark-mode .input-simple:focus {
            border-color: var(--green) !important;
        }
        body.dark-mode .coord-input { background: #1a3020 !important; }
        body.dark-mode .guide-box { background: #16281b; }
        body.dark-mode .location-badge { background: #1a3020; color: #5aaf6e; }
        body.dark-mode .mode-toggle-wrap { border-color: #2a4030; }

        /* ── Mobile ── */
        @media (max-width: 767px) {
            .lapor-header { padding: 65px 0 28px; border-radius: 0 0 var(--radius-sm) var(--radius-sm); }
            #map.full-map { height: 280px; }
            #map.simple-map { height: 180px; }
            .mode-toggle-wrap { width: 100%; }
            .mode-toggle-btn { flex: 1; text-align: center; padding: 10px 12px; font-size: 0.82rem; }
            .btn-lapor-besar { font-size: 1rem; padding: 14px; }
            .guide-box { display: none; }
            .container { padding-left: 12px !important; padding-right: 12px !important; }
        }
        @media (max-width: 400px) {
            .lapor-header h2 { font-size: 1.2rem; }
            #map.simple-map { height: 150px; }
            #map.full-map { height: 220px; }
        }
    </style>
@endsection

@section('content')

{{-- HEADER --}}
<section class="lapor-header">
    <div class="container" style="margin-top: 20px;">
        <h2 class="display-5 fw-bold mb-2"><i class="bi bi-megaphone-fill me-2"></i>Lapor Kejadian</h2>
        <p class="lead text-white-75 mb-3">Laporkan masalah di sekitar Dusun Kerban dengan cepat dan mudah.</p>
        <div class="d-flex gap-2 flex-wrap">
            <span class="lapor-badge"><i class="bi bi-geo-alt-fill me-1"></i>Cepat</span>
            <span class="lapor-badge"><i class="bi bi-lightning-charge-fill me-1"></i>Mudah</span>
            <span class="lapor-badge"><i class="bi bi-shield-fill-check me-1"></i>Terpercaya</span>
        </div>
    </div>
</section>

{{-- MAIN --}}
<div class="container py-4">
    {{-- MODE TOGGLE --}}
    <div class="d-flex justify-content-center mb-4">
        <div class="mode-toggle-wrap">
            <button class="mode-toggle-btn active" id="btnSimpleMode" onclick="switchMode('simple')">
                <i class="bi bi-lightning-charge-fill"></i> Simpel
            </button>
            <button class="mode-toggle-btn" id="btnFullMode" onclick="switchMode('full')">
                <i class="bi bi-list-ul"></i> Lengkap
            </button>
        </div>
    </div>

    {{-- ALERT --}}
    <div id="alertPlaceholder" class="mb-3"></div>

    <div class="row g-4">
        {{-- MAP --}}
        <div class="col-lg-7">
            <div class="card-custom">
                <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h5 class="mb-0 fw-bold"><i class="bi bi-map-fill me-2"></i>Peta Lokasi</h5>
                        <small class="text-muted" id="mapSubtitle">Lokasi Anda terdeteksi otomatis</small>
                    </div>
                    <button class="btn-locate" id="btnLocate" onclick="locateMe()"><i class="bi bi-geo-alt-fill me-1"></i>Lokasi Saya</button>
                </div>
                <div class="p-2 p-md-3">
                    <div id="map" class="simple-map"></div>
                </div>
            </div>

            {{-- Tips (hidden on mobile) --}}
            <div class="guide-box mt-3 d-none d-md-block" id="guideSimple">
                <h6 class="fw-bold mb-2" style="color:var(--green);"><i class="bi bi-lightbulb-fill me-1"></i>Mode Simpel</h6>
                <p class="mb-0 small text-muted">
                    Isi <strong>nama</strong> dan <strong>deskripsi</strong> singkat.
                    Lokasi Anda sudah otomatis terdeteksi. Tekan <strong>Kirim</strong> — selesai!
                </p>
            </div>
            <div class="guide-box mt-3 d-none d-md-block" id="guideFull" style="display:none;">
                <h6 class="fw-bold mb-2" style="color:var(--green);"><i class="bi bi-lightbulb-fill me-1"></i>Mode Lengkap</h6>
                <p class="mb-0 small text-muted">
                    Lengkapi semua detail: judul, kategori, foto. Klik peta untuk menandai lokasi secara manual.
                </p>
            </div>
        </div>

        {{-- FORM --}}
        <div class="col-lg-5">
            {{-- ═══ SIMPLE MODE CARD ═══ --}}
            <div id="simpleModeCard" class="simple-card">
                <div class="card-body">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-lightning-charge-fill text-warning fs-5"></i>
                        <h5 class="fw-bold mb-0">Lapor Cepat</h5>
                    </div>

                    <div class="mb-3">
                        <div id="locationStatus" class="location-badge pending">
                            <span class="spinner-border spinner-border-sm" style="width:14px;height:14px;"></span>
                            Mendeteksi lokasi...
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold"><i class="bi bi-person-fill me-1"></i>Nama Pelapor</label>
                        <input type="text" id="simpleNama" class="input-simple"
                               placeholder="Nama lengkap Anda" required>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-bold"><i class="bi bi-chat-square-text-fill me-1"></i>Apa yang terjadi?</label>
                        <textarea id="simpleDeskripsi" class="input-simple"
                                  placeholder="Ceritakan secara singkat apa yang Anda laporkan..."
                                  rows="4" required></textarea>
                        <div class="form-text mt-1">Minimal 10 karakter. Jelaskan dengan singkat dan jelas.</div>
                    </div>

                    <button type="button" id="btnSimpleSubmit" class="btn-lapor-besar" onclick="submitSimple()">
                        <i class="bi bi-send-fill"></i> Kirim Laporan
                    </button>

                    <p class="text-center text-muted small mt-3 mb-0">
                        Butuh opsi lebih lengkap? <a href="#" onclick="switchMode('full');return false;" class="text-decoration-none fw-semibold" style="color:var(--green);">Buka Mode Lengkap →</a>
                    </p>
                </div>
            </div>

            {{-- ═══ COMPLETE MODE CARD ═══ --}}
            <div id="fullModeCard" class="card-custom" style="display:none;">
                <div class="card-body" style="padding: clamp(16px, 3vw, 28px);">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-list-ul text-primary fs-5"></i>
                        <h5 class="fw-bold mb-0">Form Lengkap</h5>
                    </div>

                    <form id="laporForm" class="needs-validation" novalidate enctype="multipart/form-data">
                        <div class="mb-3">
                            <label for="nama_pelapor" class="form-label"><i class="bi bi-person-fill me-1"></i>Nama Pelapor</label>
                            <input type="text" id="nama_pelapor" name="nama_pelapor" class="form-control"
                                   placeholder="Nama lengkap Anda" required>
                            <div class="invalid-feedback">Nama pelapor wajib diisi.</div>
                        </div>
                        <div class="mb-3">
                            <label for="judul" class="form-label"><i class="bi bi-pin-map-fill me-1"></i>Judul Laporan</label>
                            <input type="text" id="judul" name="judul" class="form-control"
                                   placeholder="Contoh: Jalan rusak parah di RT 03" required>
                            <div class="invalid-feedback">Judul laporan wajib diisi.</div>
                        </div>
                        <div class="mb-3">
                            <label for="deskripsi" class="form-label"><i class="bi bi-pencil-fill me-1"></i>Deskripsi</label>
                            <textarea id="deskripsi" name="deskripsi" class="form-control" rows="4"
                                      placeholder="Jelaskan kondisi atau kejadian secara detail..." required></textarea>
                            <div class="invalid-feedback">Deskripsi laporan wajib diisi.</div>
                        </div>
                        <div class="mb-3">
                            <label for="kategori" class="form-label"><i class="bi bi-tag-fill me-1"></i>Kategori</label>
                            <select id="kategori" name="kategori" class="form-select">
                                <option value="">Pilih kategori...</option>
                                <option value="Banjir">Banjir</option>
                                <option value="Longsor">Longsor</option>
                                <option value="Kebakaran">Kebakaran</option>
                                <option value="Kesehatan">Kesehatan</option>
                                <option value="Fasilitas Umum">Fasilitas Umum</option>
                                <option value="Infrastruktur">Infrastruktur</option>
                                <option value="Keamanan">Keamanan</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div class="mb-3 d-none" id="kategoriLainnyaGroup">
                            <label for="kategori_lainnya" class="form-label">Kategori Lainnya</label>
                            <input type="text" id="kategori_lainnya" name="kategori_lainnya" class="form-control"
                                   placeholder="Tuliskan kategori lain...">
                        </div>
                        <div class="mb-3">
                            <label for="foto" class="form-label"><i class="bi bi-camera-fill me-1"></i>Foto Bukti</label>
                            <input type="file" id="foto" name="foto" class="form-control"
                                   accept="image/jpeg,image/png">
                            <div class="form-text">Maksimal 2 MB. Format JPG/PNG.</div>
                        </div>
                        <div class="row gy-3 mb-4">
                            <div class="col-6">
                                <label class="form-label">Latitude</label>
                                <input type="text" name="lat" class="form-control coord-input"
                                       readonly placeholder="Klik peta →">
                            </div>
                            <div class="col-6">
                                <label class="form-label">Longitude</label>
                                <input type="text" name="lng" class="form-control coord-input"
                                       readonly placeholder="Klik peta →">
                            </div>
                        </div>
                        <button type="submit" class="btn-lapor-besar">
                            <i class="bi bi-send-fill me-1"></i>Kirim Laporan
                        </button>
                    </form>

                    <p class="text-center text-muted small mt-3 mb-0">
                        <a href="#" onclick="switchMode('simple');return false;" class="text-decoration-none fw-semibold" style="color:var(--green);">← Kembali ke Mode Simpel</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js"></script>

<script>
    // ── State ──
    var currentMode = 'simple';
    var userLat = null;
    var userLng = null;
    var locationReady = false;
    var map, drawnItems, drawControl, userMarker;

    // ── Init map ──
    function initMap() {
        map = L.map('map').setView([-7.8, 110.3], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        drawControl = new L.Control.Draw({
            draw: { polygon:false, polyline:false, rectangle:false, circle:false, marker:true },
            edit: { featureGroup: drawnItems, edit: false }
        });
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, function(e) {
            drawnItems.clearLayers();
            var layer = e.layer;
            drawnItems.addLayer(layer);
            var coords = layer.getLatLng();
            setCoords(coords.lat, coords.lng);
        });

        // Load existing reports
        loadExistingReports();

        // Auto-locate
        setTimeout(locateMe, 300);
    }

    // ── Locate user ──
    function locateMe() {
        var btn = document.getElementById('btnLocate');
        if (!navigator.geolocation) {
            showAlert('Geolokasi tidak didukung browser ini.', 'warning');
            return;
        }
        btn.classList.add('loading');
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Mencari...';
        navigator.geolocation.getCurrentPosition(
            function(pos) {
                userLat = pos.coords.latitude;
                userLng = pos.coords.longitude;
                locationReady = true;

                if (userMarker) map.removeLayer(userMarker);
                userMarker = L.marker([userLat, userLng]).addTo(map)
                    .bindPopup('<b><i class="bi bi-geo-alt-fill"></i> Lokasi Anda</b>').openPopup();
                map.setView([userLat, userLng], 17);

                setCoords(userLat, userLng);
                updateLocationStatus();

                btn.classList.remove('loading');
                btn.innerHTML = '<i class="bi bi-geo-alt-fill me-1"></i>Lokasi Saya';
            },
            function() {
                locationReady = false;
                updateLocationStatus();
                btn.classList.remove('loading');
                btn.innerHTML = '<i class="bi bi-geo-alt-fill me-1"></i>Lokasi Saya';
                showAlert('Gagal mendeteksi lokasi. Klik peta untuk menandai manual.', 'warning');
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }

    function setCoords(lat, lng) {
        var latInput = document.querySelector('input[name=lat]');
        var lngInput = document.querySelector('input[name=lng]');
        if (latInput) latInput.value = lat.toFixed(6);
        if (lngInput) lngInput.value = lng.toFixed(6);
    }

    function updateLocationStatus() {
        var el = document.getElementById('locationStatus');
        if (!el) return;
        if (locationReady) {
            el.className = 'location-badge';
            el.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>Lokasi terdeteksi';
        } else {
            el.className = 'location-badge pending';
            el.innerHTML = '<span class="spinner-border spinner-border-sm" style="width:14px;height:14px;"></span> Mendeteksi lokasi...';
        }
    }

    // ── Mode switching ──
    function switchMode(mode) {
        currentMode = mode;
        var simpleCard = document.getElementById('simpleModeCard');
        var fullCard = document.getElementById('fullModeCard');
        var btnSimple = document.getElementById('btnSimpleMode');
        var btnFull = document.getElementById('btnFullMode');
        var mapEl = document.getElementById('map');
        var guideSimple = document.getElementById('guideSimple');
        var guideFull = document.getElementById('guideFull');
        var mapSub = document.getElementById('mapSubtitle');

        if (mode === 'simple') {
            simpleCard.style.display = '';
            fullCard.style.display = 'none';
            btnSimple.classList.add('active');
            btnFull.classList.remove('active');
            mapEl.className = 'simple-map';
            if (guideSimple) guideSimple.style.display = '';
            if (guideFull) guideFull.style.display = 'none';
            if (mapSub) mapSub.textContent = 'Lokasi Anda terdeteksi otomatis';
            // Hide draw controls
            if (drawControl) map.removeControl(drawControl);
            updateLocationStatus();
        } else {
            simpleCard.style.display = 'none';
            fullCard.style.display = '';
            btnSimple.classList.remove('active');
            btnFull.classList.add('active');
            mapEl.className = 'full-map';
            if (guideSimple) guideSimple.style.display = 'none';
            if (guideFull) guideFull.style.display = '';
            if (mapSub) mapSub.textContent = 'Klik peta untuk menandai lokasi';
            // Show draw controls
            if (drawControl) map.addControl(drawControl);
            // Sync coords from simple mode
            if (userLat && userLng) setCoords(userLat, userLng);
            map.invalidateSize();
        }
    }

    // ── Simple mode submit ──
    function submitSimple() {
        var nama = document.getElementById('simpleNama').value.trim();
        var deskripsi = document.getElementById('simpleDeskripsi').value.trim();
        var btn = document.getElementById('btnSimpleSubmit');

        if (!nama) {
            showAlert('Silakan isi nama pelapor.', 'warning');
            document.getElementById('simpleNama').focus();
            return;
        }
        if (!deskripsi || deskripsi.length < 10) {
            showAlert('Deskripsi minimal 10 karakter.', 'warning');
            document.getElementById('simpleDeskripsi').focus();
            return;
        }
        if (!locationReady || !userLat || !userLng) {
            showAlert('Menunggu lokasi... Coba lagi sebentar.', 'warning');
            locateMe();
            return;
        }

        btn.classList.add('loading');
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Mengirim...';

        // Auto-generate judul from first 50 chars of deskripsi
        var judul = deskripsi.length > 50 ? deskripsi.substring(0, 50).trim() + '...' : deskripsi;

        var formData = new FormData();
        formData.append('nama_pelapor', nama);
        formData.append('judul', judul);
        formData.append('deskripsi', deskripsi);
        formData.append('kategori', 'Laporan Cepat');
        formData.append('lat', userLat);
        formData.append('lng', userLng);

        fetch('{{ url('/lapor/store') }}', {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
            body: formData
        })
        .then(function(res) { return res.json(); })
        .then(function(res) {
            btn.classList.remove('loading');
            btn.innerHTML = '<i class="bi bi-send-fill"></i> Kirim Laporan';
            if (res.status === 'success') {
                showAlert('<i class="bi bi-check-circle-fill me-1"></i>Laporan berhasil dikirim! Halaman akan dimuat ulang...', 'success');
                document.getElementById('simpleNama').value = '';
                document.getElementById('simpleDeskripsi').value = '';
                setTimeout(function() { location.reload(); }, 1500);
            } else {
                showAlert(res.message || 'Gagal mengirim laporan.', 'danger');
            }
        })
        .catch(function() {
            btn.classList.remove('loading');
            btn.innerHTML = '<i class="bi bi-send-fill"></i> Kirim Laporan';
            showAlert('Tidak dapat mengirim. Periksa koneksi Anda.', 'danger');
        });
    }

    // ── Full mode submit (existing logic, adapted) ──
    (function() {
        var form = document.getElementById('laporForm');
        if (!form) return;

        var kategoriSelect = document.getElementById('kategori');
        var kategoriLainnyaGroup = document.getElementById('kategoriLainnyaGroup');
        var kategoriLainnyaInput = document.getElementById('kategori_lainnya');

        kategoriSelect.addEventListener('change', function() {
            if (this.value === 'lainnya') {
                kategoriLainnyaGroup.classList.remove('d-none');
                kategoriLainnyaInput.setAttribute('required', 'required');
            } else {
                kategoriLainnyaGroup.classList.add('d-none');
                kategoriLainnyaInput.removeAttribute('required');
                kategoriLainnyaInput.classList.remove('is-invalid');
            }
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            form.classList.add('was-validated');
            if (!form.checkValidity()) return;

            var lat = form.lat.value.trim();
            var lng = form.lng.value.trim();
            if (!lat || !lng) {
                showAlert('Silakan pilih lokasi pada peta terlebih dahulu.', 'warning');
                return;
            }

            var cat = form.kategori.value;
            var categoryValue = cat;
            if (cat === 'lainnya') {
                categoryValue = form.kategori_lainnya.value.trim();
                if (!categoryValue) {
                    showAlert('Silakan isi kategori lainnya.', 'warning');
                    form.kategori_lainnya.classList.add('is-invalid');
                    return;
                }
            }

            var formData = new FormData();
            formData.append('nama_pelapor', form.nama_pelapor.value);
            formData.append('judul', form.judul.value);
            formData.append('deskripsi', form.deskripsi.value);
            formData.append('kategori', categoryValue);
            formData.append('lat', lat);
            formData.append('lng', lng);
            if (form.foto.files.length > 0) {
                formData.append('foto', form.foto.files[0]);
            }

            var url = '{{ url('/lapor/store') }}';
            var method = 'POST';
            if (form.dataset.editId) {
                url = '{{ url('/lapor') }}/' + form.dataset.editId;
                formData.append('_method', 'PUT');
            }

            var submitBtn = form.querySelector('.btn-lapor-besar');
            var originalHTML = submitBtn.innerHTML;
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Mengirim...';

            fetch(url, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
                body: formData
            })
            .then(function(res) { return res.json(); })
            .then(function(res) {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalHTML;
                if (res.status === 'success') {
                    var msg = form.dataset.editId ? 'Laporan berhasil diperbarui.' : 'Laporan berhasil dikirim.';
                    showAlert(msg + ' Halaman akan dimuat ulang.', 'success');
                    form.reset();
                    form.classList.remove('was-validated');
                    delete form.dataset.editId;
                    kategoriLainnyaGroup.classList.add('d-none');
                    setTimeout(function() { location.reload(); }, 1200);
                } else {
                    showAlert(res.message || 'Terjadi kesalahan.', 'danger');
                }
            })
            .catch(function() {
                submitBtn.classList.remove('loading');
                submitBtn.innerHTML = originalHTML;
                showAlert('Tidak dapat mengirim. Periksa koneksi.', 'danger');
            });
        });
    })();

    // ── Helpers ──
    function showAlert(message, type) {
        document.getElementById('alertPlaceholder').innerHTML =
            '<div class="alert alert-' + type + ' alert-dismissible fade show rounded-3" role="alert">' +
                message +
                '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>' +
            '</div>';
    }

    // ── Load existing reports on map ──
    function loadExistingReports() {
        var laporanData = @json($lapor);
        function getCategoryColor(cat) {
            var warna = {
                'Banjir':'#0d6efd','Longsor':'#6610f2','Kebakaran':'#dc3545',
                'Kesehatan':'#20c997','Fasilitas Umum':'#fd7e14','Infrastruktur':'#6f42c1',
                'Keamanan':'#198754','Laporan Cepat':'#2f6f3e'
            };
            return warna[cat] || '#6c757d';
        }
        function createCategoryIcon(cat) {
            var color = getCategoryColor(cat);
            return L.divIcon({
                html: '<div class="category-marker"><span class="marker-pin" style="background:'+color+';"></span><span class="marker-dot"></span></div>',
                className: '', iconSize: [30,42], iconAnchor: [15,42], popupAnchor: [0,-42]
            });
        }
        laporanData.forEach(function(lap) {
            if (!lap.lat || !lap.lng) return;
            var marker = L.marker([lap.lat, lap.lng], { icon: createCategoryIcon(lap.kategori||'') }).addTo(map);
            var html = '<div class="report-popup">' +
                '<div class="popup-title">'+lap.judul+'</div>' +
                '<div class="popup-meta">Pelapor: <strong>'+(lap.nama_pelapor||'-')+'</strong></div>' +
                '<div class="popup-description">'+lap.deskripsi+'</div>' +
                '<div class="popup-badge">'+(lap.kategori||'-')+'</div>';
            if (lap.foto) {
                var fotoUrl = lap.foto;
                if (!fotoUrl.match(/^https?:\/\//)) {
                    fotoUrl = '{{ Storage::disk('supabase')->url('') }}' + '/' + fotoUrl.replace(/^\/+/, '');
                }
                html += '<div class="popup-photo"><img src="'+fotoUrl+'" alt="Foto"></div>';
            }
            html += '</div>';
            marker.bindPopup(html);
        });
    }

    // ── Boot ──
    document.addEventListener('DOMContentLoaded', initMap);
</script>
@endsection
