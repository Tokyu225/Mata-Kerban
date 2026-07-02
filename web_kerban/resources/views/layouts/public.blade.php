<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Desa Kerban')</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Modern font: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Brand font: self-hosted Kiona (place Kiona-Regular.ttf in public/fonts/) -->
    <!-- Fallback: Orbitron (similar geometric style from Google Fonts) -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&display=swap" rel="stylesheet">

    <style>
        /*
         * To use Kiona: download Kiona-Regular.ttf from Ellen Luff's site (free for personal use)
         * and place it in public/fonts/. Then uncomment the @font-face below and
         * swap 'Orbitron' with 'Kiona' in .navbar-brand-text.
         */
        /* @font-face {
            font-family: 'Kiona';
            src: url('/fonts/Kiona-Regular.ttf') format('truetype');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
        } */

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            padding-top: 0;
            background: #f7f7f7;
            color: #222;
            transition: background-color 0.35s ease, color 0.35s ease;
        }

        /* ── Dark Mode ── */
        body.dark-mode {
            background: #0f1a14;
            color: #d4ddd6;
        }
        body.dark-mode .navbar-custom {
            background-color: rgba(15, 26, 20, 0.7) !important;
        }
        body.dark-mode .navbar-custom.scrolled {
            background-color: #0f1a14 !important;
        }
        body.dark-mode .card,
        body.dark-mode .sambutan-card,
        body.dark-mode .sejarah-card,
        body.dark-mode .card-menu,
        body.dark-mode .map-card,
        body.dark-mode .form-card,
        body.dark-mode .lapor-header,
        body.dark-mode .sambutan-section {
            background: #16281b !important;
            color: #d4ddd6 !important;
        }
        body.dark-mode .sambutan-section {
            background: linear-gradient(135deg, #0f1a14 0%, #142018 100%) !important;
        }
        body.dark-mode .sejarah-card {
            background: #16281b !important;
            border-left-color: #2f6f3e !important;
        }
        body.dark-mode .sejarah-card p,
        body.dark-mode .sambutan-quote,
        body.dark-mode .text-muted {
            color: #a0b5a5 !important;
        }
        body.dark-mode .sejarah-card h5,
        body.dark-mode .sambutan-name,
        body.dark-mode .section-title {
            color: #5aaf6e !important;
        }
        body.dark-mode .guide-box {
            background: #16281b !important;
        }
        body.dark-mode .form-control,
        body.dark-mode .form-select {
            background: #1a3020 !important;
            border-color: #2a4030 !important;
            color: #d4ddd6 !important;
        }
        body.dark-mode .form-control:focus,
        body.dark-mode .form-select:focus {
            border-color: #2f6f3e !important;
        }
        body.dark-mode .footer {
            background: #0a1110 !important;
        }
        body.dark-mode .main-content {
            background: #0f1a14 !important;
        }
        body.dark-mode .hero-overlay {
            background: rgba(0,0,0,0.6);
        }
        body.dark-mode #page-loader {
            background: #0f1a14;
        }

        /* Theme toggle — subtle pill */
        .navbar-custom .btn-theme {
            color: rgba(255,255,255,0.65) !important;
            border-color: rgba(255,255,255,0.35) !important;
            font-size: clamp(0.7rem, 1vw, 0.875rem);
        }
        .navbar-custom .btn-theme:hover {
            background: rgba(255,255,255,0.12) !important;
            color: white !important;
            border-color: rgba(255,255,255,0.6) !important;
        }

        /* Brand text — currently Orbitron (swap to 'Kiona' after self-hosting) */
        .navbar-brand-text {
            font-family: 'Orbitron', 'Kiona', 'Inter', sans-serif;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            flex-shrink: 0;
            white-space: nowrap;
        }

        /* Navbar — pill-shaped floating, responsive via clamp() for fluid scaling */
        .navbar-custom {
            position: fixed;
            top: clamp(10px, 2vw, 20px);
            left: 50%;
            transform: translateX(-50%);
            width: clamp(320px, 88vw, 1100px);
            z-index: 1050;
            transition: background-color 0.4s ease, box-shadow 0.4s ease;
            background-color: rgba(25, 135, 84, 0.55);
            box-shadow: 0 2px 20px rgba(0,0,0,0.12);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 50px;
            padding: clamp(6px, 1.4vw, 14px) clamp(14px, 3.5vw, 40px);
            gap: clamp(8px, 2vw, 24px);
        }

        .navbar-custom.scrolled {
            background-color: #198754 !important;
            box-shadow: 0 4px 24px rgba(0,0,0,0.2);
        }

        .navbar-custom .navbar-brand,
        .navbar-custom .nav-link {
            color: white !important;
            font-size: clamp(0.9rem, 1.6vw, 1.25rem);
            font-weight: 600;
        }

        /* Base pill button (for login, theme, etc.) */
        .navbar-custom .btn {
            border-radius: 50px !important;
            padding: clamp(4px, 0.6vw, 6px) clamp(12px, 1.8vw, 22px);
            font-size: clamp(0.7rem, 1vw, 0.875rem);
            font-weight: 600;
            background: transparent !important;
            border: 2px solid !important;
            transition: all 0.3s ease;
        }
        .navbar-custom .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* Nav action buttons — icon always, text slides in on hover */
        .nav-action-wrap {
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
            max-width: 28px;
            overflow: hidden;
            transition: max-width 0.35s ease;
        }
        .nav-action-wrap:hover {
            max-width: 180px;
        }
        .navbar-custom .nav-action {
            display: inline-flex !important;
            align-items: center;
            gap: 5px;
            white-space: nowrap;
            border-radius: 50px !important;
            padding: clamp(4px, 0.6vw, 6px) clamp(8px, 1.2vw, 16px) !important;
            font-size: clamp(0.7rem, 1vw, 0.875rem) !important;
            font-weight: 600;
            background: transparent !important;
            border: 2px solid !important;
            transition: background 0.25s, color 0.25s, box-shadow 0.25s;
            flex-shrink: 0;
        }
        .navbar-custom .nav-action:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .navbar-custom .nav-action .nav-icon { font-size: 0.82rem; flex-shrink: 0; }

        .nav-action.btn-mymap { color: #f5c542 !important; border-color: #f5c542 !important; }
        .nav-action.btn-mymap:hover { background: #f5c542 !important; color: #1a4d2e !important; }
        .nav-action.btn-quiz { color: #5ec5f9 !important; border-color: #5ec5f9 !important; }
        .nav-action.btn-quiz:hover { background: #5ec5f9 !important; color: #1a4d2e !important; }
        .nav-action.btn-lapor { color: #ff6b6b !important; border-color: #ff6b6b !important; }
        .nav-action.btn-lapor:hover { background: #ff6b6b !important; color: #fff !important; }

        /* Action button colors */
        .nav-action.btn-mymap { color: #f5c542 !important; border-color: #f5c542 !important; }
        .nav-action.btn-mymap:hover { background: #f5c542 !important; color: #1a4d2e !important; }
        .nav-action.btn-quiz { color: #5ec5f9 !important; border-color: #5ec5f9 !important; }
        .nav-action.btn-quiz:hover { background: #5ec5f9 !important; color: #1a4d2e !important; }
        .nav-action.btn-lapor { color: #ff6b6b !important; border-color: #ff6b6b !important; }
        .nav-action.btn-lapor:hover { background: #ff6b6b !important; color: #fff !important; }
        .navbar-custom .btn-login:hover {
            background: #7ed89b !important;
            color: #1a4d2e !important;
        }

        /* Lapor — red */
        .navbar-custom .btn-lapor {
            color: #ff6b6b !important;
            border-color: #ff6b6b !important;
        }
        .navbar-custom .btn-lapor:hover {
            background: #ff6b6b !important;
            color: #fff !important;
        }

        /* Navbar divider line */
        .navbar-divider {
            width: 1px;
            height: 24px;
            background: rgba(255,255,255,0.25);
            border-radius: 1px;
            margin: 0 4px;
        }

        /* Navbar toggler (hamburger) */
        .navbar-custom .navbar-toggler {
            border: 2px solid rgba(255,255,255,0.5) !important;
            border-radius: 50px;
            padding: 6px 12px;
            color: white !important;
        }
        .navbar-custom .navbar-toggler:focus {
            box-shadow: 0 0 0 3px rgba(255,255,255,0.2);
        }
        .navbar-custom .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255,255,255,0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        /* ── Mobile responsive ── */
        @media (max-width: 767px) {
            .navbar-custom {
                width: 94vw;
                border-radius: 30px;
                padding: 8px 16px;
                flex-wrap: wrap;
            }
            .navbar-custom .navbar-collapse {
                width: 100%;
                padding-top: 10px;
                flex-direction: column;
                gap: 6px;
            }
            .navbar-custom .navbar-collapse .btn {
                width: 100%;
                text-align: center;
                padding: 8px 16px !important;
            }
            .navbar-custom .navbar-collapse .d-flex {
                flex-wrap: wrap;
                justify-content: center;
                gap: 6px !important;
            }
            .navbar-divider {
                display: none;
            }
            .hero h1 {
                font-size: 2rem !important;
            }
            .hero .lead {
                font-size: 1rem !important;
            }
            .hero .btn {
                font-size: 0.9rem !important;
                padding: 10px 24px !important;
            }
            .sambutan-photo-placeholder {
                width: 100px;
                height: 100px;
                font-size: 2rem;
            }
            .sambutan-section {
                padding: 40px 0;
            }
            .sejarah-section {
                padding: 40px 0;
            }
            .lapor-header {
                border-radius: 0 0 20px 20px;
                padding: 80px 0 30px;
            }
            .lapor-header h2 {
                font-size: 1.6rem;
            }
            .form-card .card-body {
                padding: 1.2rem;
            }
            .map-settings-card {
                min-width: auto;
                width: 90vw;
                margin-right: 0;
            }
        }

        @media (max-width: 575px) {
            .navbar-custom {
                width: 96vw;
                border-radius: 24px;
                padding: 6px 12px;
            }
            .hero h1 {
                font-size: 1.6rem !important;
            }
            .hero .lead {
                font-size: 0.85rem !important;
            }
            .section-title {
                font-size: 1.3rem;
            }
        }

        /* ── Version tag ── */
        .version-tag {
            position: fixed;
            bottom: 12px;
            right: 16px;
            z-index: 1000;
            background: rgba(47, 111, 62, 0.12);
            color: #2f6f3e;
            padding: 4px 12px;
            border-radius: 50px;
            font-size: 0.7rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            font-family: 'Inter', monospace;
            pointer-events: none;
            border: 1px solid rgba(47, 111, 62, 0.2);
        }
        body.dark-mode .version-tag {
            background: rgba(90, 175, 110, 0.12);
            color: #5aaf6e;
            border-color: rgba(90, 175, 110, 0.2);
        }

        /* ── Page Loader / Transition Overlay ── */
        #page-loader {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: #f7f7f7;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.35s ease, visibility 0.35s ease;
        }
        #page-loader.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        .loader-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #d4e8d8;
            border-top-color: #2f6f3e;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

    </style>

    @yield('styles')
</head>
<body>

{{-- PAGE LOADER / TRANSITION OVERLAY --}}
<div id="page-loader"><div class="loader-spinner"></div></div>

{{-- NAVBAR — translucent → solid on scroll --}}
<nav class="navbar navbar-expand-md navbar-custom" id="mainNavbar">
    <div class="d-flex align-items-center justify-content-between w-100 px-2">
        <div class="d-flex align-items-center gap-2 flex-shrink-0">
            <a class="navbar-brand navbar-brand-text me-1 mb-0" href="/">Kerban</a>
            @unless(request()->is('map*') || request()->is('lapor*'))
                <span class="d-none d-md-flex align-items-center gap-2">
                    <span class="nav-action-wrap"><a href="/map" class="btn btn-mymap btn-sm nav-action"><span class="nav-icon">🗺️</span> <span class="nav-label">MyMap</span></a></span>
                    <span class="nav-action-wrap"><a href="/lapor" class="btn btn-lapor btn-sm nav-action"><span class="nav-icon">📢</span> <span class="nav-label">Lapor min!</span></a></span>
                    <span class="nav-action-wrap"><a href="/quiz" class="btn btn-quiz btn-sm nav-action"><span class="nav-icon">🧠</span> <span class="nav-label">Quiz</span></a></span>
                </span>
            @endunless
        </div>

        {{-- Hamburger toggler (mobile) --}}
        <button class="navbar-toggler d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>

        {{-- Right side utilities (always visible) --}}
        <div class="d-none d-md-flex align-items-center gap-2">
            @if(request()->is('map*') || request()->is('lapor*'))
                <button class="btn btn-mymap btn-sm" id="mapSettingsBtn" title="Pengaturan Peta">⚙️</button>
            @endif
            <span class="navbar-divider"></span>
            <button class="btn btn-theme btn-sm" id="themeToggle" title="Toggle Dark Mode">🌙</button>
            @auth
                <a href="{{ route('dashboard') }}" class="btn btn-login btn-sm">👋 {{ Str::words(auth()->user()->name, 1, '') }}</a>
            @else
                <a href="{{ route('login') }}" class="btn btn-login btn-sm">Login</a>
            @endauth
        </div>
    </div>

    {{-- Collapsed menu (mobile) --}}
    <div class="collapse navbar-collapse" id="navbarCollapse">
        <div class="d-flex flex-column gap-2 pt-2 d-md-none">
            @unless(request()->is('map*') || request()->is('lapor*'))
                <a href="/map" class="btn btn-mymap btn-sm w-100">MyMap</a>
                <a href="/lapor" class="btn btn-lapor btn-sm w-100">Lapor min!</a>
                <a href="/quiz" class="btn btn-quiz btn-sm w-100">Quiz</a>
            @endunless
            @if(request()->is('map*') || request()->is('lapor*'))
                <button class="btn btn-mymap btn-sm w-100" id="mapSettingsBtnMobile" title="Pengaturan Peta">⚙️ Pengaturan Peta</button>
            @endif
            <hr style="border-color: rgba(255,255,255,0.15); margin: 4px 0;">
            <div class="d-flex gap-2">
                <button class="btn btn-theme btn-sm flex-shrink-0" id="themeToggleMobile" title="Dark Mode">🌙</button>
                @auth
                    <a href="{{ route('dashboard') }}" class="btn btn-login btn-sm flex-grow-1">👋 {{ Str::words(auth()->user()->name, 1, '') }}</a>
                @else
                    <a href="{{ route('login') }}" class="btn btn-login btn-sm flex-grow-1">Login</a>
                @endauth
            </div>
        </div>
    </div>
</nav>

{{-- BS JS for collapse --}}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

{{-- MAP SETTINGS POPUP --}}
@if(request()->is('map*') || request()->is('lapor*'))
<div class="map-settings-popup" id="mapSettingsPopup" style="display:none;">
    <div class="map-settings-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="fw-bold mb-0">⚙️ Pengaturan Peta</h6>
            <button class="btn-close" id="closeSettingsBtn"></button>
        </div>
        <label class="form-label fw-semibold small">Basemap</label>
        <div class="basemap-settings">
            <button class="basemap-opt active" data-bm="satellite">🛰️ Satelit</button>
            <button class="basemap-opt" data-bm="street">🗺️ Jalan</button>
            <button class="basemap-opt" data-bm="topo">🏔️ Medan</button>
        </div>
        <hr>
        <div class="d-flex justify-content-between align-items-center">
            <span class="small">🌙 Dark Mode</span>
            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" id="settingsDarkToggle">Toggle</button>
        </div>
    </div>
</div>

<style>
    .map-settings-popup {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 9999;
        background: rgba(0,0,0,0.35);
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding: 90px 20px 0 0;
    }
    .map-settings-card {
        background: #fff;
        border-radius: 20px;
        padding: 20px 24px;
        min-width: 260px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    }
    .basemap-settings {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .basemap-opt {
        padding: 8px 14px;
        border-radius: 12px;
        border: 2px solid #e0e0e0;
        background: #f9f9f9;
        text-align: left;
        font-weight: 600;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all .2s;
    }
    .basemap-opt.active {
        border-color: #2f6f3e;
        background: #e8f5e9;
        color: #2f6f3e;
    }
    .basemap-opt:hover {
        border-color: #2f6f3e;
    }
    body.dark-mode .map-settings-card {
        background: #16281b;
        color: #d4ddd6;
    }
    body.dark-mode .basemap-opt {
        background: #1a3020;
        border-color: #2a4030;
        color: #d4ddd6;
    }
    body.dark-mode .basemap-opt.active {
        border-color: #2f6f3e;
        background: #1a3020;
        color: #5aaf6e;
    }
</style>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        var popup = document.getElementById('mapSettingsPopup');
        var openBtn = document.getElementById('mapSettingsBtn');
        var closeBtn = document.getElementById('closeSettingsBtn');
        var darkBtn = document.getElementById('settingsDarkToggle');

        if (openBtn && popup) {
            openBtn.addEventListener('click', function() { popup.style.display = 'flex'; });
            closeBtn.addEventListener('click', function() { popup.style.display = 'none'; });
            popup.addEventListener('click', function(e) { if (e.target === popup) popup.style.display = 'none'; });
        }
        if (darkBtn) {
            darkBtn.addEventListener('click', function() {
                document.getElementById('themeToggle').click();
            });
        }

        // Sync basemap buttons in popup with map's switchBasemap
        document.querySelectorAll('.basemap-opt').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.basemap-opt').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                if (typeof switchBasemap === 'function') {
                    switchBasemap(btn.dataset.bm);
                }
            });
        });
    });
</script>
@endif

{{-- CONTENT --}}
@yield('content')

{{-- VERSION TAG --}}
<div class="version-tag">v1.1 · HNDH</div>

{{-- SCROLL + PAGE TRANSITION SCRIPTS --}}
<script>
    const loader = document.getElementById('page-loader');

    // ── Hide loader on page ready ──
    window.addEventListener('pageshow', function () {
        // Small delay so the loader is briefly visible, smoothing the transition
        setTimeout(function () {
            loader.classList.add('hidden');
        }, 300);
    });

    // ── Show loader when navigating away (internal links only) ──
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href');
        // Only for internal navigation (same-origin, not hash-only, not new tab)
        if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) return;
        if (link.target === '_blank') return;
        if (link.hasAttribute('download')) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        loader.classList.remove('hidden');
    });

    // ── Navbar scroll effect ──
    window.addEventListener('scroll', function () {
        var navbar = document.getElementById('mainNavbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ── Theme toggle (Dark / Light mode) ──
    function toggleTheme() {
        var isDark = document.body.classList.toggle('dark-mode');
        var icon = isDark ? '☀️' : '🌙';
        document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(function(b) {
            b.textContent = icon;
        });
        localStorage.setItem('kerban-theme', isDark ? 'dark' : 'light');
    }
    var savedTheme = localStorage.getItem('kerban-theme');
    if (savedTheme === 'dark') { document.body.classList.add('dark-mode'); }
    var themeIcon = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(function(b) { b.textContent = themeIcon; });
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    var mobileToggle = document.getElementById('themeToggleMobile');
    if (mobileToggle) mobileToggle.addEventListener('click', toggleTheme);

    // ── Sync mobile settings button ──
    var mobileSettingsBtn = document.getElementById('mapSettingsBtnMobile');
    if (mobileSettingsBtn) {
        mobileSettingsBtn.addEventListener('click', function() {
            document.getElementById('mapSettingsPopup').style.display = 'flex';
        });
    }
</script>

@yield('scripts')
</body>
</html>
