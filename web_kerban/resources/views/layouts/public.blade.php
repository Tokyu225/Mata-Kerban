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
        }

        /* Brand text — currently Orbitron (swap to 'Kiona' after self-hosting) */
        .navbar-brand-text {
            font-family: 'Orbitron', 'Kiona', 'Inter', sans-serif;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
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

        /* Pill-shaped hollow navbar buttons — each with own colour */
        .navbar-custom .btn {
            border-radius: 50px !important;
            padding: clamp(4px, 0.6vw, 6px) clamp(12px, 1.8vw, 22px);
            font-size: clamp(0.7rem, 1vw, 0.875rem);
            background: transparent !important;
            border: 2px solid !important;
            transition: all 0.3s ease;
        }
        .navbar-custom .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* MyMap — golden */
        .navbar-custom .btn-mymap {
            color: #f5c542 !important;
            border-color: #f5c542 !important;
        }
        .navbar-custom .btn-mymap:hover {
            background: #f5c542 !important;
            color: #1a4d2e !important;
        }

        /* Quiz — sky blue */
        .navbar-custom .btn-quiz {
            color: #5ec5f9 !important;
            border-color: #5ec5f9 !important;
        }
        .navbar-custom .btn-quiz:hover {
            background: #5ec5f9 !important;
            color: #1a4d2e !important;
        }

        /* Login — soft green */
        .navbar-custom .btn-login {
            color: #7ed89b !important;
            border-color: #7ed89b !important;
        }
        .navbar-custom .btn-login:hover {
            background: #7ed89b !important;
            color: #1a4d2e !important;
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
<nav class="navbar navbar-expand-lg navbar-custom px-4" id="mainNavbar">
    <a class="navbar-brand navbar-brand-text" href="/">Kerban</a>

    <div class="ms-auto">
        <a href="/map" class="btn btn-mymap btn-sm">MyMap</a>
        <a href="/quiz" class="btn btn-quiz btn-sm">Quiz</a>
        @auth
            <a href="{{ route('dashboard') }}" class="btn btn-login btn-sm">Dashboard</a>
        @else
            <a href="{{ route('login') }}" class="btn btn-login btn-sm">Login</a>
        @endauth
    </div>
</nav>

{{-- CONTENT --}}
@yield('content')

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
</script>

@yield('scripts')
</body>
</html>
