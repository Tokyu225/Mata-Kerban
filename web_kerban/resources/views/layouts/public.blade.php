<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Desa Kerban')</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    @yield('styles')
</head>
<body>

{{-- NAVBAR --}}
<nav class="navbar navbar-expand-lg navbar-dark bg-success px-4">
    <a class="navbar-brand fw-bold" href="/">Desa Kerban</a>

    <div class="ms-auto">
        <a href="/" class="btn btn-light btn-sm">Beranda</a>
        <a href="/map" class="btn btn-warning btn-sm">MyMap</a>
    </div>
</nav>

{{-- CONTENT --}}
@yield('content')

@yield('scripts')
</body>
</html>
