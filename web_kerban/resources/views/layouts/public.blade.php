<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Desa Kerban')</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        /* Navbar — translucent at top, solid on scroll */
        .navbar-custom {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1050;
            transition: background-color 0.4s ease, box-shadow 0.4s ease;
            background-color: rgba(25, 135, 84, 0.55);
            box-shadow: none;
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
        }

        .navbar-custom.scrolled {
            background-color: #198754 !important; /* bg-success */
            box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        }

        .navbar-custom .navbar-brand,
        .navbar-custom .nav-link {
            color: white !important;
        }

        body {
            padding-top: 0;
        }
    </style>

    @yield('styles')
</head>
<body>

{{-- NAVBAR — translucent → solid on scroll --}}
<nav class="navbar navbar-expand-lg navbar-custom px-4" id="mainNavbar">
    <a class="navbar-brand fw-bold" href="/">Desa Kerban</a>

    <div class="ms-auto">
        <a href="/" class="btn btn-light btn-sm">Beranda</a>
        <a href="/map" class="btn btn-warning btn-sm">MyMap</a>
        <a href="/quiz" class="btn btn-info btn-sm">Quiz</a>
    </div>
</nav>

{{-- CONTENT --}}
@yield('content')

{{-- SCROLL SCRIPT --}}
<script>
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
