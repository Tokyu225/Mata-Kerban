@extends('layouts.public')

@section('styles')
<style>
    body {
        font-family: 'Segoe UI', sans-serif;
        background: #f7f7f7;
    }

    .hero {
        height: 100vh;
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

    /* Fade-in animation */
    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translateY(40px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero-content h1 {
        animation: fadeInUp 1s ease-out 0.2s both;
    }

    .hero-content p {
        animation: fadeInUp 1s ease-out 0.5s both;
    }

    .hero-content .btn {
        animation: fadeInUp 1s ease-out 0.8s both;
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
@endsection

@section('content')

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

            {{-- SEJARAH --}}
            <div class="container my-5">
                <h3 class="section-title text-center">Sejarah Dusun Kerban</h3>

                <div class="row align-items-center">

                    <div class="col-md-6">
                        <img src="{{ asset('storage/images/tembang.jpg') }}" alt="Sejarah Dusun Kerban" class="img-fluid rounded shadow-sm">
                    </div>

                    <div class="col-md-6">
                        <div class="card p-4 shadow-sm">
                            <h5>Awal Mula Dusun Kerban</h5>
                            <p>Kerban memiliki sejarah historis yang diyakini masyarakat sebagai sebuah nama dusun yang merefleksikan kebiasaan tradisi masyarakat Jawa. Orang jawa sendiri meyakini kepercayaan terdahulu yakni "Ana Dewa Ngangklang Jagat" (Ada Dewa yang sedang berkeliling Dunia), yang mana Ketika menjelang maghrib diharuskan setiap orang yang sedang beraktivitas harus berhenti dan istirahat. Hal ini terus dilakukan oleh masyarakat jawa sehingga menjadi suatu kebiasaan/keseringan atau dalam Bahasa jawa yakni "Kerepan". Kerban sendiri merupakan simplifikasi dari kata kerepan yang berarti kebiasaan tersebut yang dilakukan oleh orang jawa terdahulu sampai sekarang.</p>

                            <p>Dalam versi sejarah yang lain, istilah Dusun Kerban di Desa Sumberarum juga dikaitkan dengan makna "Korban" atau "Pengorbanan" yang berkaitan dengan cerita perjuangan Pangeran Diponegoro. Menurut penuturan lokal, pada awal Perang Jawa tahun 1825, pasukan Pangeran Diponegoro pernah membangun perkemahan dan menggali sumber air di wilayah Desa Sumberarum (salah satunya di Kerban). Banyaknya korban pada saat perlawanan terhadap kolonial Belanda, menjadikan dusun Kerban sangat identik dengan simbol pengorbanan para pejuang terdahulu.
</p>
                        </div>
                    </div>

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

@endsection
