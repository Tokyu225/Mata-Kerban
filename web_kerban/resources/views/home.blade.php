@extends('layouts.public')

@section('styles')
<style>
    body {
        background: #f7f7f7;
    }

    .hero {
        height: 100vh;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        z-index: 1;
        overflow: hidden;
    }

    .hero-video {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        object-fit: cover;
        z-index: 0;
    }

    /* Image mode — hide video, show static background */
    .hero.image-mode .hero-video {
        display: none;
    }
    .hero.image-mode {
        background: url('https://images.unsplash.com/photo-1500382017468-9049fed747ef') center/cover fixed;
    }

    .hero-overlay {
        position: absolute;
        top:0;left:0;
        width:100%;height:100%;
        background: rgba(0,0,0,0.45);
        z-index: 1;
    }

    .hero-content {
        position: relative;
        text-align: center;
        z-index: 2;
    }

    /* Hero bg toggle button */
    .hero-bg-toggle {
        position: absolute;
        bottom: 80px;
        right: 24px;
        z-index: 3;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(6px);
        border: 1.5px solid rgba(255,255,255,0.3);
        color: white;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.3s, transform 0.3s;
    }
    .hero-bg-toggle:hover {
        background: rgba(255,255,255,0.3);
        transform: scale(1.1);
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

    /* ── Sambutan ──────────────────────────────────────────────── */
    .sambutan-section {
        background: linear-gradient(175deg, #f8fcf9 0%, #eaf5ed 40%, #f4f9f5 100%);
        padding: 100px 0;
        position: relative;
        overflow: hidden;
    }
    .sambutan-section::before {
        content: "";
        position: absolute;
        top: -80px;
        right: -80px;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(47,111,62,0.06) 0%, transparent 70%);
        border-radius: 50%;
    }
    .sambutan-section::after {
        content: "";
        position: absolute;
        bottom: -60px;
        left: -40px;
        width: 220px;
        height: 220px;
        background: radial-gradient(circle, rgba(47,111,62,0.05) 0%, transparent 70%);
        border-radius: 50%;
    }
    .sambutan-section .container {
        position: relative;
        z-index: 1;
    }

    .sambutan-badge {
        display: inline-block;
        background: linear-gradient(135deg, #2f6f3e, #4a9e5e);
        color: #fff;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 6px 18px;
        border-radius: 50px;
        margin-bottom: 28px;
    }

    .sambutan-title {
        font-weight: 800;
        font-size: 2.4rem;
        color: #1a3c1f;
        margin-bottom: 8px;
        line-height: 1.3;
    }
    .sambutan-subtitle {
        color: #6b9e78;
        font-size: 1.05rem;
        margin-bottom: 40px;
    }

    .sambutan-card {
        border: none;
        border-radius: 28px;
        overflow: visible;
        box-shadow: 0 8px 40px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04);
        background: #fff;
        padding: 0;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .sambutan-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 48px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.05);
    }

    /* Photo area */
    .sambutan-photo-wrapper {
        position: relative;
        display: inline-block;
    }
    .sambutan-photo-ring {
        position: absolute;
        inset: -10px;
        border-radius: 50%;
        border: 3px dashed rgba(47,111,62,0.25);
        animation: spinSlow 25s linear infinite;
    }
    @keyframes spinSlow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    .sambutan-photo {
        width: 170px;
        height: 170px;
        border-radius: 50%;
        object-fit: cover;
        border: 5px solid #fff;
        box-shadow: 0 8px 32px rgba(47,111,62,0.20), 0 0 0 2px rgba(47,111,62,0.15);
        position: relative;
        z-index: 1;
    }
    .sambutan-photo-placeholder {
        width: 170px;
        height: 170px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2f6f3e 0%, #4a9e5e 50%, #5cb870 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3.4rem;
        color: white;
        border: 5px solid #fff;
        box-shadow: 0 8px 32px rgba(47,111,62,0.20), 0 0 0 2px rgba(47,111,62,0.15);
        position: relative;
        z-index: 1;
    }

    /* Quote styling */
    .sambutan-quote-wrapper {
        position: relative;
        padding-left: 28px;
        border-left: 4px solid rgba(47,111,62,0.15);
    }
    .sambutan-quote-icon {
        position: absolute;
        top: -14px;
        left: -17px;
        width: 32px;
        height: 32px;
        background: #2f6f3e;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 0.85rem;
    }
    .sambutan-quote {
        font-style: italic;
        color: #4a5568;
        line-height: 1.9;
        font-size: 1.05rem;
        margin-bottom: 20px;
    }
    .sambutan-quote:last-child {
        margin-bottom: 0;
    }

    /* Name block */
    .sambutan-name-block {
        margin-top: 32px;
        display: flex;
        align-items: center;
        gap: 14px;
    }
    .sambutan-name-line {
        width: 40px;
        height: 3px;
        background: linear-gradient(90deg, #2f6f3e, #5cb870);
        border-radius: 2px;
    }
    .sambutan-name {
        color: #1a3c1f;
        font-weight: 700;
        font-size: 1.25rem;
        margin: 0;
    }
    .sambutan-role {
        color: #6b9e78;
        font-size: 0.9rem;
        font-weight: 500;
        margin-top: 2px;
    }

    /* Signature accent */
    .sambutan-signature {
        margin-top: 28px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.85rem;
        color: #8aa896;
    }
    .sambutan-signature i {
        font-size: 1.3rem;
        color: #2f6f3e;
    }

    @media (max-width: 767px) {
        .sambutan-section { padding: 60px 0; }
        .sambutan-title { font-size: 1.7rem; }
        .sambutan-card { border-radius: 20px; }
        .sambutan-photo, .sambutan-photo-placeholder {
            width: 130px;
            height: 130px;
        }
        .sambutan-photo-placeholder { font-size: 2.6rem; }
        .sambutan-quote-wrapper {
            padding-left: 20px;
            border-left: none;
            border-top: 4px solid rgba(47,111,62,0.15);
            padding-top: 24px;
            margin-top: 8px;
        }
        .sambutan-quote-icon { top: -16px; left: -16px; }
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
<div class="hero" id="heroSection">
    <video class="hero-video" autoplay muted loop playsinline>
        <source src="{{ asset('videos/drone_place.mp4') }}" type="video/mp4">
    </video>
    <div class="hero-overlay"></div>
    <div class="hero-content">
        <h1 class="display-4 fw-bold">
            <span class="wave"><i class="bi bi-hand-index-thumb-fill"></i></span> Halo{{ auth()->check() ? ', ' . Str::words(auth()->user()->name, 1, '') : '' }}!
        </h1>
        <p class="lead">Sistem Informasi & WebGIS Dusun Kerban</p>

        <a href="/map" class="btn btn-success btn-lg mt-3" style="border-radius: 50px; padding: 12px 32px;">Masuk MyMap</a>
    </div>
    <button class="hero-bg-toggle" id="heroBgToggle" title="Ganti latar belakang">
        <i class="bi bi-camera-video-fill"></i>
    </button>
</div>

{{-- MAIN CONTENT — slides over the fixed hero on scroll --}}
<div class="main-content">

{{-- SAMBUTAN KEPALA DUSUN --}}
<div class="sambutan-section">
    <div class="container">
        <div class="text-center mb-5">
            <span class="sambutan-badge">Sambutan</span>
            <h2 class="sambutan-title">Kepala Dusun Kerban</h2>
            <p class="sambutan-subtitle">Sugeng Rawuh — Selamat datang di jendela digital kami</p>
        </div>

        <div class="sambutan-card p-4 p-md-5">
            <div class="row align-items-center g-4">
                <div class="col-md-4 text-center">
                    <div class="sambutan-photo-wrapper">
                        <div class="sambutan-photo-ring"></div>
                        <div class="sambutan-photo-placeholder">
                            <i class="bi bi-person-fill"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="sambutan-quote-wrapper">
                        <div class="sambutan-quote-icon">
                            <i class="bi bi-quote"></i>
                        </div>
                        <p class="sambutan-quote">
                            Dengan penuh rasa syukur, saya mewakili seluruh warga Dusun Kerban menyambut Anda.
                            Website ini adalah cerminan semangat kami: terbuka, informatif, dan siap menyambut
                            dunia sambil tetap berpegang teguh pada akar budaya dan nilai-nilai luhur kita.
                        </p>
                        <p class="sambutan-quote">
                            Visi kami adalah menjadikan Kerban dusun percontohan yang mandiri, berbudaya,
                            dan sejahtera. Kami mengundang Anda untuk menjelajahi setiap sudut digital dusun
                            kami dan menantikan kunjungan Anda secara langsung. Matur nuwun.
                        </p>
                    </div>

                    <div class="sambutan-name-block">
                        <div class="sambutan-name-line"></div>
                        <div>
                            <h5 class="sambutan-name">Sigit Zuli Susanto</h5>
                            <p class="sambutan-role">Kepala Dusun Kerban</p>
                        </div>
                    </div>

                    <div class="sambutan-signature">
                        <i class="bi bi-geo-alt-fill"></i>
                        <span>Dusun Kerban, Desa Kerban — menyapa dunia</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
                    <div class="sejarah-icon"><i class="bi bi-house-door-fill"></i></div>
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
                    <div class="sejarah-icon"><i class="bi bi-journal-text"></i></div>
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
                    <div class="sejarah-icon"><i class="bi bi-building"></i></div>
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
                    <div class="sejarah-icon"><i class="bi bi-tree-fill"></i></div>
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
                <h5><i class="bi bi-geo-alt-fill"></i> Profil Dusun</h5>
                <p>Informasi wilayah & struktur dusun</p>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card card-menu p-4 shadow-sm">
                <h5><i class="bi bi-map-fill"></i> MyMap</h5>
                <p>Peta interaktif & data spasial</p>
            </div>
        </div>

        <div class="col-md-4">
            <div class="card card-menu p-4 shadow-sm">
                <h5><i class="bi bi-bar-chart-fill"></i> Data Penduduk</h5>
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

@section('scripts')
<script>
    // Hero background toggle: video <-> image
    (function() {
        var hero = document.getElementById('heroSection');
        var toggle = document.getElementById('heroBgToggle');
        var icon = toggle.querySelector('i');

        // Restore saved preference
        var saved = localStorage.getItem('kerban-hero-bg');
        if (saved === 'image') {
            hero.classList.add('image-mode');
            icon.className = 'bi bi-image-fill';
        }

        toggle.addEventListener('click', function() {
            var isImage = hero.classList.toggle('image-mode');
            icon.className = isImage ? 'bi bi-image-fill' : 'bi bi-camera-video-fill';
            localStorage.setItem('kerban-hero-bg', isImage ? 'image' : 'video');
        });
    })();
</script>
@endsection
