@extends('layouts.public')

@section('styles')
<style>
    body {
        background: #f7f7f7;
    }

    .hero {
        height: 100vh;
        background: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef') center/cover fixed;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        z-index: 1;
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

    /* Content wrapper — slides over the fixed hero on scroll */
    .main-content {
        position: relative;
        z-index: 2;
        background: #f7f7f7;
        margin-top: -60px;
        border-radius: 30px 30px 0 0;
        box-shadow: 0 -8px 32px rgba(0,0,0,0.12);
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

    .hero-content h1 .wave {
        display: inline-block;
        animation: wave 1.5s ease-in-out infinite;
        transform-origin: 70% 70%;
    }
    @keyframes wave {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(20deg); }
        50% { transform: rotate(-10deg); }
        75% { transform: rotate(15deg); }
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

    /* Sambutan */
    .sambutan-section {
        background: linear-gradient(135deg, #f9fbf9 0%, #f0f7f1 100%);
        padding: 80px 0;
    }
    .sambutan-card {
        border: none;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        background: #fff;
    }
    .sambutan-photo {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #2f6f3e;
        box-shadow: 0 4px 16px rgba(47,111,62,0.2);
    }
    .sambutan-photo-placeholder {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2f6f3e, #4a9e5e);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        color: white;
        font-weight: 700;
        border: 4px solid #2f6f3e;
        box-shadow: 0 4px 16px rgba(47,111,62,0.2);
    }
    .sambutan-quote {
        font-style: italic;
        color: #555;
        line-height: 1.8;
        font-size: 1.05rem;
    }
    .sambutan-name {
        color: #2f6f3e;
        font-weight: 700;
    }

    /* Sejarah */
    .sejarah-section {
        padding: 80px 0;
    }
    .sejarah-card {
        border: none;
        border-radius: 20px;
        background: #fff;
        box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        padding: 28px;
        height: 100%;
        transition: transform 0.3s, box-shadow 0.3s;
        border-left: 4px solid #2f6f3e;
    }
    .sejarah-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 28px rgba(0,0,0,0.1);
    }
    .sejarah-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(47,111,62,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        margin-bottom: 16px;
    }
    .sejarah-card h5 {
        color: #2f6f3e;
        font-weight: 700;
        margin-bottom: 10px;
    }
    .sejarah-card p {
        color: #666;
        font-size: 0.95rem;
        line-height: 1.7;
        margin: 0;
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
        <h1 class="display-4 fw-bold">
            <span class="wave">👋</span> Halo{{ auth()->check() ? ', ' . Str::words(auth()->user()->name, 1, '') : '' }}!
        </h1>
        <p class="lead">Sistem Informasi & WebGIS Dusun Kerban</p>

        <a href="/map" class="btn btn-success btn-lg mt-3" style="border-radius: 50px; padding: 12px 32px;">Masuk MyMap</a>
    </div>
</div>

{{-- MAIN CONTENT — slides over the fixed hero on scroll --}}
<div class="main-content">

{{-- SAMBUTAN KEPALA DUSUN --}}
<div class="sambutan-section">
    <div class="container">
        <h3 class="section-title text-center mb-5">Sugeng Rawuh, Selamat Datang di Jendela Digital Kami</h3>

        <div class="sambutan-card p-4 p-md-5">
            <div class="row align-items-center">
                <div class="col-md-4 text-center mb-4 mb-md-0">
                    <div class="sambutan-photo-placeholder">
                        <span>👤</span>
                    </div>
                </div>
                <div class="col-md-8">
                    <p class="sambutan-quote mb-4">
                        Dengan penuh rasa syukur, saya mewakili seluruh warga Dusun Kerban menyambut Anda.
                        Website ini adalah cerminan semangat kami: terbuka, informatif, dan siap menyambut
                        dunia sambil tetap berpegang teguh pada akar budaya dan nilai-nilai luhur kita.
                    </p>
                    <p class="sambutan-quote mb-4">
                        Visi kami adalah menjadikan Kerban dusun percontohan yang mandiri, berbudaya,
                        dan sejahtera. Kami mengundang Anda untuk menjelajahi setiap sudut digital dusun
                        kami dan menantikan kunjungan Anda secara langsung. Matur nuwun.
                    </p>
                    <div class="mt-4">
                        <h5 class="sambutan-name mb-1">Sigit Zuli Susanto</h5>
                        <small class="text-muted">Kepala Dusun Kerban</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- SEJARAH --}}
<div class="sejarah-section">
    <div class="container">
        <h3 class="section-title text-center mb-2">Jejak Langkah Dusun Kerban</h3>
        <p class="text-center text-muted mb-5">
            Setiap nama menyimpan cerita, setiap jengkal tanah memiliki jejak. Mari telusuri kembali perjalanan waktu yang membentuk Dusun Kerban.
        </p>

        <div class="row g-4">
            <div class="col-md-6">
                <div class="sejarah-card">
                    <div class="sejarah-icon">🏡</div>
                    <h5>Masa Awal dan Para Pendiri</h5>
                    <p>
                        Sejarah dusun ini dimulai dengan kedatangan para pendatang. Di antara tokoh-tokoh
                        awal yang sangat dihormati dan menjadi cikal bakal dusun ini adalah Kyai Abdul Karim
                        dan Mbah Batin Ahmad.
                    </p>
                </div>
            </div>

            <div class="col-md-6">
                <div class="sejarah-card">
                    <div class="sejarah-icon">📜</div>
                    <h5>Asal-Usul Nama</h5>
                    <p>
                        Nama Kerban diyakini berasal dari sebuah peristiwa pengorbanan di masa lalu. Ada
                        penyebutan tentang kerban buatan dan adanya 'tumbal' atau seseorang yang meninggal
                        di lokasi tersebut. Hal ini menunjukkan bahwa nama dusun lekat dengan sebuah
                        peristiwa pengorbanan yang penting.
                    </p>
                </div>
            </div>

            <div class="col-md-6">
                <div class="sejarah-card">
                    <div class="sejarah-icon">🕌</div>
                    <h5>Pembangunan Fasilitas Keagamaan</h5>
                    <p>
                        Salah satu perkembangan penting di dusun ini adalah pembangunan sebuah Rumah
                        Alquran yang dimiliki oleh almarhum Kyai Abdul Karim yang diwariskan kepada
                        muridnya bernama Kyai Sulthon.
                    </p>
                </div>
            </div>

            <div class="col-md-6">
                <div class="sejarah-card">
                    <div class="sejarah-icon">🌱</div>
                    <h5>Perkembangan Dusun</h5>
                    <p>
                        Wilayah dusun yang semula sangat luas, secara bertahap mulai berkembang dengan
                        berdirinya pabrik dan pengembangan di beberapa area, menandai babak baru dalam
                        perjalanan Dusun Kerban menuju kemajuan.
                    </p>
                </div>
            </div>
        </div>
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

</div>{{-- end .main-content --}}

{{-- FOOTER --}}
<div class="footer text-center">
    <h5>Desa Kerban</h5>
    <p>Sistem Informasi Desa & WebGIS</p>
</div>

@endsection
