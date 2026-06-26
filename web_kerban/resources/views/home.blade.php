<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Desa Kerban</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #f7f7f7;
        }

        .hero {
            height: 85vh;
            background: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef') center/cover;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .hero-overlay {
            position: absolute;
            top:0;left:0;
            width:100%;height:100%;
            background: rgba(0,0,0,0.45);
        }

        .hero-content {
            position: relative;
            text-align: center;
        }

        .card-menu {
            transition: 0.3s;
            border: none;
        }

        .card-menu:hover {
            transform: translateY(-5px);
        }

        .section-title {
            font-weight: bold;
            color: #2f6f3e;
            margin-bottom: 30px;
        }

        .footer {
            background: #2f6f3e;
            color: white;
            padding: 40px 0;
        }
    </style>
</head>
<body>

{{-- NAVBAR --}}
<nav class="navbar navbar-expand-lg navbar-dark bg-success px-4">
    <a class="navbar-brand fw-bold" href="#">Desa Kerban</a>

    <div class="ms-auto">
        <a href="/" class="btn btn-light btn-sm">Beranda</a>
        <a href="/map" class="btn btn-warning btn-sm">MyMap</a>
    </div>
</nav>

{{-- HERO --}}
<div class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
        <h1 class="display-4 fw-bold">SELAMAT DATANG</h1>
        <p class="lead">Sistem Informasi & WebGIS Dusun Kerban</p>

        <a href="/map" class="btn btn-success btn-lg mt-3">Masuk MyMap</a>
    </div>
</div>

{{-- MENU UTAMA --}}
<div class="container my-5">
    <h3 class="section-title text-center">Menu Utama</h3>

    <div class="row text-center">

        <div class="col-md-4">
            <div class="card card-menu p-4 shadow-sm">
                <h5>📍 Profil Dusun</h5>
                <p>Informasi wilayah & struktur dusun</p>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card card-menu p-4 shadow-sm">
                <h5>🗺️ MyMap</h5>
                <p>Peta interaktif & data spasial</p>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card card-menu p-4 shadow-sm">
                <h5>📊 Data Penduduk</h5>
                <p>Statistik & informasi warga</p>
            </div>
        </div>

    </div>
</div>

{{-- BERITA --}}
<div class="container my-5">
    <h3 class="section-title text-center">Berita Terkini</h3>

    <div class="row">

        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5>Pelatihan Digitalisasi Desa</h5>
                <p>Program peningkatan kapasitas perangkat desa...</p>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5>Pengembangan UMKM Dusun</h5>
                <p>Pemberdayaan ekonomi masyarakat berbasis digital...</p>
            </div>
        </div>

    </div>
</div>

{{-- PRODUK --}}
<div class="container my-5">
    <h3 class="section-title text-center">Produk Unggulan</h3>

    <div class="row text-center">

        <div class="col-md-4">
            <div class="card p-3 shadow-sm">
                <h6>Kopi Dusun</h6>
                <p>Rp 25.000</p>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card p-3 shadow-sm">
                <h6>Keripik Singkong</h6>
                <p>Rp 10.000</p>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card p-3 shadow-sm">
                <h6>Gula Aren</h6>
                <p>Rp 15.000</p>
            </div>
        </div>

    </div>
</div>

{{-- FOOTER --}}
<div class="footer text-center">
    <h5>Desa Kerban</h5>
    <p>Sistem Informasi Desa & WebGIS</p>
</div>

</body>
</html>
