@extends('layouts.public')

@section('title', 'Lapor Kejadian - Desa Kerban')

@section('styles')
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"/>

    <style>
        .page-header {
            min-height: 220px;
            background: linear-gradient(135deg, #1f7d3f, #28935b);
            color: white;
            position: relative;
        }
        .page-header::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at top left, rgba(255,255,255,.16), transparent 45%);
            pointer-events: none;
        }
        .page-header h2,
        .page-header p {
            position: relative;
            z-index: 1;
        }
        #map {
            height: 460px;
            width: 100%;
            border-radius: 1rem;
        }
        .leaflet-container {
            border-radius: 1rem;
        }
        .form-card {
            border: 0;
            border-radius: 1rem;
        }
        .form-card .card-body {
            padding: 2rem;
        }
        .form-control:focus {
            border-color: #198754;
            box-shadow: 0 0 0 .2rem rgba(25, 135, 84, .18);
        }
        .badge-soft {
            background-color: rgba(25, 135, 84, .12);
            color: #1f7d3f;
        }
        .summary-box {
            background: #eff7ee;
            border-left: 4px solid #198754;
        }
        .report-popup {
            min-width: 240px;
            max-width: 300px;
            font-size: 0.95rem;
            line-height: 1.4;
        }
        .report-popup .popup-title {
            font-weight: 700;
            color: #1f7d3f;
            margin-bottom: 0.35rem;
        }
        .report-popup .popup-meta {
            font-size: 0.85rem;
            color: #495057;
            margin-bottom: 0.8rem;
        }
        .report-popup .popup-description {
            color: #343a40;
            margin-bottom: 0.75rem;
        }
        .report-popup .popup-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.55rem;
            font-size: 0.78rem;
            border-radius: 999px;
            background: rgba(25, 135, 84, 0.12);
            color: #1f7d3f;
            margin-bottom: 0.75rem;
        }
        .report-popup .popup-photo {
            margin-top: 0.8rem;
            border-radius: 0.9rem;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }
        .report-popup .popup-photo img {
            display: block;
            width: 100%;
            height: 180px;
            object-fit: cover;
        }
        .report-popup .popup-footer {
            margin-top: 0.85rem;
            font-size: 0.82rem;
            color: #6c757d;
        }
        .category-marker {
            display: block;
            width: 30px;
            height: 42px;
            position: relative;
        }
        .category-marker .marker-pin {
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            position: absolute;
            left: 0;
            top: 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            border: 2px solid white;
        }
        .category-marker .marker-dot {
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            position: absolute;
            left: 10px;
            top: 10px;
            box-shadow: inset 0 0 0 2px rgba(255,255,255,0.5);
        }
    </style>
@endsection

@section('content')
<section class="page-header d-flex align-items-center">
    <div class="container py-5">
        <div class="row align-items-center">
            <div class="col-lg-8">
                <h2 class="fw-bold">Lapor Kejadian Dusun Kerban</h2>
                <p class="lead text-white-75">Tandai lokasi kejadian di peta, isi detail laporan, dan kirim dengan cepat untuk membantu tim desa menindaklanjuti.</p>
                <div class="d-flex gap-2 flex-wrap">
                    <span class="badge badge-soft p-2">Interaktif</span>
                    <span class="badge badge-soft p-2">Mudah</span>
                    <span class="badge badge-soft p-2">Profesional</span>
                </div>
            </div>
        </div>
    </div>
</section>

<div class="container py-5">
    <div class="row g-4">
        <div class="col-xl-7">
            <div class="card shadow-sm">
                <div class="card-body p-0">
                    <div class="d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
                        <div>
                            <h5 class="mb-1">Peta Laporan</h5>
                            <p class="mb-0 text-muted small">Klik pada peta untuk menandai lokasi laporan.</p>
                        </div>
                        <span class="badge bg-success">Live</span>
                    </div>
                    <div id="map"></div>
                </div>
            </div>
            <div class="card shadow-sm summary-box mt-4 p-4">
                <h6 class="fw-semibold">Petunjuk Cepat</h6>
                <ul class="mb-0 ps-3">
                    <li>Isi judul dan deskripsi singkat.</li>
                    <li>Tandai lokasi dengan marker di peta.</li>
                    <li>Pastikan koordinat tampil sebelum mengirim.</li>
                </ul>
            </div>
        </div>

        <div class="col-xl-5">
            <div class="card shadow-sm form-card">
                <div class="card-body">
                    <div class="mb-4">
                        <h5 class="card-title mb-1">Form Laporan</h5>
                        <p class="text-muted mb-0">Lengkapi detail kejadian agar laporan dapat ditangani lebih cepat.</p>
                    </div>

                    <div id="alertPlaceholder"></div>

                    <form id="laporForm" class="needs-validation" novalidate enctype="multipart/form-data">
                        <div class="mb-3">
                            <label for="nama_pelapor" class="form-label">Nama Pelapor</label>
                            <input type="text" id="nama_pelapor" name="nama_pelapor" class="form-control" placeholder="Nama lengkap Anda" required>
                            <div class="invalid-feedback">Nama pelapor wajib diisi.</div>
                        </div>
                        <div class="mb-3">
                            <label for="judul" class="form-label">Judul Laporan</label>
                            <input type="text" id="judul" name="judul" class="form-control" placeholder="Contoh: Jalan rusak parah" required>
                            <div class="invalid-feedback">Judul laporan wajib diisi.</div>
                        </div>
                        <div class="mb-3">
                            <label for="deskripsi" class="form-label">Deskripsi</label>
                            <textarea id="deskripsi" name="deskripsi" class="form-control" rows="5" placeholder="Jelaskan kondisi atau kejadian..." required></textarea>
                            <div class="invalid-feedback">Deskripsi laporan wajib diisi.</div>
                        </div>
                        <div class="mb-3">
                            <label for="kategori" class="form-label">Kategori</label>
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
                            <div class="form-text">Pilih kategori yang paling relevan.</div>
                        </div>
                        <div class="mb-3 d-none" id="kategoriLainnyaGroup">
                            <label for="kategori_lainnya" class="form-label">Kategori Lainnya</label>
                            <input type="text" id="kategori_lainnya" name="kategori_lainnya" class="form-control" placeholder="Tuliskan kategori lain jika tidak tersedia">
                            <div class="invalid-feedback">Silakan tuliskan kategori lain atau pilih kategori yang tersedia.</div>
                        </div>
                        <div class="mb-3">
                            <label for="foto" class="form-label">Foto Bukti</label>
                            <input type="file" id="foto" name="foto" class="form-control" accept="image/jpeg,image/png">
                            <div class="form-text">Maksimal 2 MB. Format JPG/PNG.</div>
                        </div>

                        <div class="row gy-3 mb-4">
                            <div class="col-sm-6">
                                <label class="form-label">Latitude</label>
                                <input type="text" name="lat" class="form-control" readonly placeholder="Klik peta untuk memilih">
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label">Longitude</label>
                                <input type="text" name="lng" class="form-control" readonly placeholder="Klik peta untuk memilih">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-success btn-submit">Kirim Laporan</button>
                    </form>
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
    var map = L.map('map').setView([-7.8, 110.3], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
        draw: { polygon:false, polyline:false, rectangle:false, circle:false, marker:true },
        edit: { featureGroup: drawnItems, edit: false }
    });
    map.addControl(drawControl);

    function showAlert(message, type) {
        document.getElementById('alertPlaceholder').innerHTML =
            '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
                message +
                '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
            '</div>';
    }

    map.on(L.Draw.Event.CREATED, function (e) {
        drawnItems.clearLayers();
        var layer = e.layer;
        drawnItems.addLayer(layer);
        var coords = layer.getLatLng();
        document.querySelector('input[name=lat]').value = coords.lat.toFixed(6);
        document.querySelector('input[name=lng]').value = coords.lng.toFixed(6);
    });

    var laporanData = @json($lapor);
    function getCategoryColor(category) {
        var warna = {
            'Banjir': '#0d6efd',
            'Longsor': '#6610f2',
            'Kebakaran': '#dc3545',
            'Kesehatan': '#20c997',
            'Fasilitas Umum': '#fd7e14',
            'Infrastruktur': '#6f42c1',
            'Keamanan': '#198754',
        };
        return warna[category] || '#6c757d';
    }

    function createCategoryIcon(category) {
        var color = getCategoryColor(category);
        var html =
            '<div class="category-marker">' +
            '<span class="marker-pin" style="background:' + color + ';"></span>' +
            '<span class="marker-dot"></span>' +
            '</div>';
        return L.divIcon({
            html: html,
            className: '',
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -42]
        });
    }

    laporanData.forEach(function(lap) {
        if (lap.lat && lap.lng) {
            var icon = createCategoryIcon(lap.kategori || '');
            var marker = L.marker([lap.lat, lap.lng], { icon: icon }).addTo(map);
            var popupHtml = '<div class="report-popup">' +
                '<div class="popup-title">' + lap.judul + '</div>' +
                '<div class="popup-meta">Pelapor: <strong>' + (lap.nama_pelapor || '-') + '</strong></div>' +
                '<div class="popup-description">' + lap.deskripsi + '</div>' +
                '<div class="popup-badge">Kategori: ' + (lap.kategori || '-') + '</div>';

            if (lap.foto) {
                var fotoUrl = lap.foto;
                if (!fotoUrl.match(/^https?:\/\//) && fotoUrl.indexOf('/storage/') !== 0) {
                    fotoUrl = '{{ asset('storage') }}' + '/' + fotoUrl.replace(/^\/+/, '');
                }
                popupHtml += '<div class="popup-photo"><img src="' + fotoUrl + '" alt="Foto bukti"></div>';
            }

            popupHtml += '<div class="d-flex justify-content-between align-items-center mt-3">' +
                '<button class="btn btn-sm btn-outline-primary me-2" onclick="editReport(' + lap.id + ')">Edit</button>' +
                '<button class="btn btn-sm btn-outline-danger" onclick="deleteReport(' + lap.id + ')">Hapus</button>' +
                '</div>' +
                '<div class="popup-footer">Klik marker untuk informasi lebih lanjut jika tersedia.</div>';
            popupHtml += '</div>';
            marker.bindPopup(popupHtml);
        }
    });

    var kategoriSelect = document.getElementById('kategori');
    var kategoriLainnyaGroup = document.getElementById('kategoriLainnyaGroup');
    var kategoriLainnyaInput = document.getElementById('kategori_lainnya');

    kategoriSelect.addEventListener('change', function () {
        if (this.value === 'lainnya') {
            kategoriLainnyaGroup.classList.remove('d-none');
            kategoriLainnyaInput.setAttribute('required', 'required');
        } else {
            kategoriLainnyaGroup.classList.add('d-none');
            kategoriLainnyaInput.removeAttribute('required');
            kategoriLainnyaInput.classList.remove('is-invalid');
        }
    });

    function resetForm() {
        form.reset();
        form.classList.remove('was-validated');
        kategoriLainnyaGroup.classList.add('d-none');
        kategoriLainnyaInput.removeAttribute('required');
    }

    window.editReport = function (id) {
        var laporan = laporanData.find(function(item) { return item.id === id; });
        if (!laporan) {
            showAlert('Data laporan tidak ditemukan.', 'danger');
            return;
        }

        document.getElementById('nama_pelapor').value = laporan.nama_pelapor || '';
        document.getElementById('judul').value = laporan.judul || '';
        document.getElementById('deskripsi').value = laporan.deskripsi || '';
        document.getElementById('kategori').value = laporan.kategori || '';
        if (laporan.kategori === 'lainnya' || ['Banjir','Longsor','Kebakaran','Kesehatan','Fasilitas Umum','Infrastruktur','Keamanan'].indexOf(laporan.kategori) === -1) {
            kategoriLainnyaGroup.classList.remove('d-none');
            kategoriLainnyaInput.setAttribute('required', 'required');
            if (['Banjir','Longsor','Kebakaran','Kesehatan','Fasilitas Umum','Infrastruktur','Keamanan'].indexOf(laporan.kategori) === -1) {
                document.getElementById('kategori').value = 'lainnya';
                kategoriLainnyaInput.value = laporan.kategori || '';
            } else {
                kategoriLainnyaInput.value = '';
            }
        } else {
            kategoriLainnyaGroup.classList.add('d-none');
            kategoriLainnyaInput.removeAttribute('required');
            kategoriLainnyaInput.value = '';
        }

        document.querySelector('input[name=lat]').value = laporan.lat || '';
        document.querySelector('input[name=lng]').value = laporan.lng || '';
        document.getElementById('foto').value = '';

        form.dataset.editId = id;
        document.querySelector('.btn-submit').textContent = 'Simpan Perubahan';
        showAlert('Mode edit aktif. Klik Simpan Perubahan untuk mengupdate laporan.', 'info');
    };

    window.deleteReport = function (id) {
        if (!confirm('Hapus laporan ini?')) {
            return;
        }

        fetch('{{ url('/lapor') }}/' + id, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Accept': 'application/json'
            }
        })
        .then(function(res) { return res.json(); })
        .then(function(res) {
            if (res.status === 'success') {
                showAlert('Laporan berhasil dihapus.', 'success');
                setTimeout(function() { location.reload(); }, 900);
                return;
            }
            showAlert('Gagal menghapus laporan.', 'danger');
        })
        .catch(function() {
            showAlert('Terjadi kesalahan saat menghapus laporan.', 'danger');
        });
    };

    var form = document.getElementById('laporForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        form.classList.add('was-validated');

        if (!form.checkValidity()) {
            return;
        }

        var lat = form.lat.value.trim();
        var lng = form.lng.value.trim();
        if (!lat || !lng) {
            showAlert('Silakan pilih lokasi laporan pada peta terlebih dahulu.', 'warning');
            return;
        }

        var selectedCategory = form.kategori.value;
        var categoryValue = selectedCategory;
        if (selectedCategory === 'lainnya') {
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
        if (form.dataset.editId) {
            url = '{{ url('/lapor') }}/' + form.dataset.editId;
            formData.append('_method', 'PUT');
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: formData
        })
        .then(function (res) { return res.json(); })
        .then(function (res) {
            if (res.status === 'success') {
                var message = form.dataset.editId ? 'Laporan berhasil diperbarui.' : 'Laporan berhasil dikirim.';
                showAlert(message + ' Halaman akan dimuat ulang.', 'success');
                resetForm();
                delete form.dataset.editId;
                document.querySelector('.btn-submit').textContent = 'Kirim Laporan';
                setTimeout(function () { location.reload(); }, 1200);
                return;
            }
            showAlert(res.message || 'Terjadi kesalahan saat mengirim laporan.', 'danger');
        })
        .catch(function () {
            showAlert('Tidak dapat mengirim laporan. Periksa koneksi Anda.', 'danger');
        });
    });
</script>
@endsection
