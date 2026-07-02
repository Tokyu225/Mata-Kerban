@extends('layouts.public')

@section('title', 'Dashboard')

@section('content')
<div class="container py-5" style="margin-top: 80px;">
    <h2 class="section-title text-center mb-4">🏡 Dashboard Dusun Kerban</h2>

    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow-sm border-0 rounded-4 p-4">
                <h5>Selamat datang, {{ auth()->user()->name }}!</h5>
                <p class="text-muted mb-2">
                    Role: <span class="badge rounded-pill px-3 py-2
                        {{ auth()->user()->isEndministrator() ? 'bg-success' : 'bg-secondary' }}">
                        {{ ucfirst(auth()->user()->role) }}
                    </span>
                </p>

                @if(auth()->user()->isEndministrator())
                    <div class="alert alert-success rounded-3 mt-3">
                        ✅ Anda memiliki akses penuh — dapat menggambar dan mengelola peta.
                    </div>
                @else
                    <div class="alert alert-light border rounded-3 mt-3">
                        ℹ️ Anda login sebagai <strong>Warga</strong>. Fitur menggambar peta hanya tersedia untuk Endministrator.
                    </div>
                @endif

                <div class="mt-4 d-flex flex-wrap gap-2">
                    <a href="/map" class="btn btn-success rounded-pill px-4">
                        🗺️ Buka MyMap
                    </a>
                    <form method="POST" action="{{ route('logout') }}" class="d-inline">
                        @csrf
                        <button type="submit" class="btn btn-outline-danger rounded-pill px-4">
                            🚪 Logout
                        </button>
                    </form>
                </div>

                <hr class="my-4">

                <div class="text-muted small">
                    <p class="mb-2 fw-semibold text-danger">⚠️ Zona Berbahaya</p>
                    <p class="mb-3">Menghapus akun akan menghapus semua data Anda secara permanen dan tidak dapat dikembalikan.</p>
                    <form method="POST" action="{{ route('profile.destroy') }}"
                          onsubmit="return confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini TIDAK DAPAT dibatalkan.')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-outline-danger rounded-pill px-4 btn-sm">
                            🗑️ Hapus Akun Saya
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
