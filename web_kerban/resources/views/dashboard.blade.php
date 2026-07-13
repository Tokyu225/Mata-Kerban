@extends('layouts.public')

@section('title', 'Dashboard')

@section('styles')
<style>
    :root {
        --green: #2f6f3e;
        --green-dark: #1a4d2e;
        --green-light: #e8f5e9;
        --radius: 20px;
        --radius-sm: 14px;
        --shadow-sm: 0 1px 4px rgba(0,0,0,.05);
        --shadow: 0 2px 16px rgba(0,0,0,.06);
        --shadow-lg: 0 8px 32px rgba(0,0,0,.08);
    }

    .dashboard-wrapper {
        margin-top: 90px;
        padding-bottom: 60px;
    }

    /* ── Page header ── */
    .dash-header {
        margin-bottom: 32px;
    }
    .dash-header h2 {
        font-weight: 800;
        font-size: clamp(1.4rem, 3vw, 1.9rem);
        color: #1a1a2e;
    }
    .dash-header .dash-subtitle {
        color: #6c757d;
        font-size: 0.95rem;
    }

    /* ── Stats cards ── */
    .stat-card {
        background: #fff;
        border: none;
        border-radius: var(--radius);
        padding: 22px 24px;
        box-shadow: var(--shadow);
        display: flex;
        align-items: center;
        gap: 16px;
        transition: transform .2s, box-shadow .2s;
    }
    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
    }
    .stat-icon {
        width: 52px; height: 52px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        flex-shrink: 0;
    }
    .stat-icon.green { background: var(--green-light); color: var(--green); }
    .stat-icon.blue { background: #e3f0fd; color: #1a73e8; }
    .stat-icon.orange { background: #fff3e0; color: #e65100; }
    .stat-icon.purple { background: #f3e8ff; color: #7c3aed; }
    .stat-info .stat-value {
        font-size: 1.6rem;
        font-weight: 800;
        line-height: 1.2;
        color: #1a1a2e;
    }
    .stat-info .stat-label {
        font-size: 0.82rem;
        color: #6c757d;
        font-weight: 500;
    }

    /* ── Profile card ── */
    .profile-card {
        background: #fff;
        border: none;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        overflow: hidden;
    }
    .profile-card .profile-cover {
        height: 80px;
        background: linear-gradient(135deg, var(--green-dark), var(--green));
    }
    .profile-card .profile-body {
        padding: 0 24px 24px;
        position: relative;
    }
    .profile-avatar {
        width: 72px; height: 72px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--green), #4caf78);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        font-weight: 700;
        border: 4px solid #fff;
        margin-top: -36px;
        box-shadow: 0 4px 12px rgba(47,111,62,.2);
    }
    .profile-name {
        font-weight: 700;
        font-size: 1.15rem;
        color: #1a1a2e;
        margin-top: 12px;
    }
    .profile-email {
        font-size: 0.85rem;
        color: #6c757d;
    }
    .role-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 14px;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .role-badge.admin {
        background: var(--green-light);
        color: var(--green);
    }
    .role-badge.warga {
        background: #eef2f6;
        color: #495057;
    }

    /* ── Quick actions ── */
    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 0.9rem;
        border: 2px solid;
        transition: all .25s;
        text-decoration: none;
        white-space: nowrap;
    }
    .action-btn.primary {
        background: var(--green);
        border-color: var(--green);
        color: white;
    }
    .action-btn.primary:hover {
        background: var(--green-dark);
        border-color: var(--green-dark);
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(47,111,62,.3);
    }
    .action-btn.outline {
        background: transparent;
        border-color: #dee2e6;
        color: #495057;
    }
    .action-btn.outline:hover {
        border-color: #adb5bd;
        background: #f8f9fa;
    }
    .action-btn.danger {
        background: transparent;
        border-color: #f1aeb5;
        color: #dc3545;
        font-size: 0.8rem;
        padding: 6px 14px;
    }
    .action-btn.danger:hover {
        background: #dc3545;
        color: white;
        border-color: #dc3545;
    }

    /* ── Table card ── */
    .table-card {
        background: #fff;
        border: none;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        overflow: hidden;
    }
    .table-card .table-header {
        padding: 20px 24px 16px;
        border-bottom: 1px solid #eef2ef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
    }
    .table-header h5 {
        font-weight: 700;
        color: #1a1a2e;
        margin: 0;
    }
    .table-header .table-count {
        font-size: 0.82rem;
        font-weight: 600;
        padding: 5px 14px;
        border-radius: 50px;
        background: var(--green-light);
        color: var(--green);
    }

    .table-custom {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }
    .table-custom thead th {
        background: #f9faf9;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #6c757d;
        padding: 12px 16px;
        border-bottom: 1px solid #eef2ef;
    }
    .table-custom tbody td {
        padding: 14px 16px;
        font-size: 0.9rem;
        border-bottom: 1px solid #f3f5f3;
        vertical-align: middle;
    }
    .table-custom tbody tr {
        transition: background .15s;
    }
    .table-custom tbody tr:hover {
        background: #f9fbf9;
    }
    .table-custom tbody tr:last-child td {
        border-bottom: none;
    }

    .cat-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 50px;
        font-size: 0.78rem;
        font-weight: 600;
    }
    .cat-badge.green { background: var(--green-light); color: var(--green); }
    .cat-badge.blue { background: #e3f0fd; color: #1a73e8; }
    .cat-badge.red { background: #fde8e8; color: #c62828; }
    .cat-badge.orange { background: #fff3e0; color: #e65100; }
    .cat-badge.purple { background: #f3e8ff; color: #7c3aed; }
    .cat-badge.teal { background: #e0f7fa; color: #00695c; }

    .cell-coords {
        font-family: 'SF Mono', 'Cascadia Code', monospace;
        font-size: 0.8rem;
        color: #6c757d;
        white-space: nowrap;
    }
    .cell-date {
        font-size: 0.82rem;
        color: #6c757d;
        white-space: nowrap;
    }
    .cell-photo img {
        border-radius: 10px;
        object-fit: cover;
        box-shadow: 0 2px 6px rgba(0,0,0,.08);
    }

    .btn-action {
        width: 34px; height: 34px;
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e0e4e0;
        background: #fff;
        color: #495057;
        cursor: pointer;
        transition: all .2s;
        font-size: 0.85rem;
    }
    .btn-action:hover { background: #f0f2f0; border-color: #c0c4c0; }
    .btn-action.edit:hover { background: #fff8e1; border-color: #ffc107; color: #e65100; }
    .btn-action.delete:hover { background: #fde8e8; border-color: #ef9a9a; color: #c62828; }

    /* ── Empty state ── */
    .empty-state {
        padding: 60px 20px;
        text-align: center;
    }
    .empty-icon {
        width: 80px; height: 80px;
        border-radius: 50%;
        background: var(--green-light);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: var(--green);
        margin-bottom: 16px;
    }

    /* ── Modal ── */
    .modal-content {
        border: none;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
    }
    .modal-header {
        padding: 20px 24px 8px;
        border-bottom: none;
    }
    .modal-body { padding: 16px 24px; }
    .modal-footer { padding: 8px 24px 20px; border-top: none; }

    /* ── Dark mode ── */
    body.dark-mode .dash-header h2 { color: #e0e8e0; }
    body.dark-mode .dash-header .dash-subtitle { color: #9aaa9e; }
    body.dark-mode .stat-card,
    body.dark-mode .profile-card,
    body.dark-mode .table-card { background: #16281b !important; }
    body.dark-mode .stat-info .stat-value { color: #d4ddd6; }
    body.dark-mode .stat-info .stat-label { color: #8a9a8e; }
    body.dark-mode .profile-name { color: #d4ddd6; }
    body.dark-mode .profile-email { color: #8a9a8e; }
    body.dark-mode .role-badge.warga { background: #1a3020; color: #9aaa9e; }
    body.dark-mode .action-btn.outline { border-color: #2a4030; color: #9aaa9e; }
    body.dark-mode .action-btn.outline:hover { background: #1a3020; border-color: #3a5040; }
    body.dark-mode .action-btn.danger { border-color: #5a3a3a; }
    body.dark-mode .table-header { border-color: #2a4030; }
    body.dark-mode .table-custom thead th { background: #0f1a14; color: #8a9a8e; }
    body.dark-mode .table-custom tbody td { border-color: #1a3020; color: #c0ccc2; }
    body.dark-mode .table-custom tbody tr:hover { background: #1a3020; }
    body.dark-mode .btn-action { background: #1a3020; border-color: #2a4030; color: #9aaa9e; }
    body.dark-mode .btn-action:hover { background: #1f3624; }
    body.dark-mode .modal-content { background: #16281b; color: #d4ddd6; }
    body.dark-mode .stat-icon.green { background: #1a3020; }
    body.dark-mode .stat-icon.blue { background: #1a2430; }
    body.dark-mode .stat-icon.orange { background: #2a2010; }
    body.dark-mode .stat-icon.purple { background: #241a30; }

    /* ── Mobile ── */
    @media (max-width: 767px) {
        .dashboard-wrapper { margin-top: 75px; }
        .stat-card { padding: 16px; }
        .stat-icon { width: 42px; height: 42px; border-radius: 12px; font-size: 1.1rem; }
        .stat-info .stat-value { font-size: 1.3rem; }
        .table-custom thead { display: none; }
        .table-custom tbody td {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 16px; text-align: right;
        }
        .table-custom tbody td::before {
            content: attr(data-label);
            font-weight: 700; font-size: 0.78rem;
            color: #6c757d; text-transform: uppercase;
            margin-right: 12px; flex-shrink: 0;
        }
        .cell-coords { font-size: 0.75rem; }
        .action-btn { font-size: 0.82rem; padding: 8px 16px; }
    }
</style>
@endsection

@section('content')
<div class="dashboard-wrapper">
<div class="container">
    {{-- HEADER --}}
    <div class="dash-header">
        <h2><i class="bi bi-grid-fill me-2" style="color:var(--green);"></i>Dashboard</h2>
        <p class="dash-subtitle">Selamat datang kembali, <strong>{{ auth()->user()->name }}</strong>.</p>
    </div>

    {{-- Status message --}}
    @if(session('status'))
        <div class="alert alert-success alert-dismissible fade show rounded-3 border-0 shadow-sm mb-4" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>{{ session('status') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    {{-- ═══ TOP ROW: Profile + Stats ═══ --}}
    <div class="row g-4 mb-4">
        {{-- Profile Card --}}
        <div class="col-lg-4">
            <div class="profile-card">
                <div class="profile-cover"></div>
                <div class="profile-body">
                    <div class="profile-avatar">
                        {{ strtoupper(substr(auth()->user()->name, 0, 2)) }}
                    </div>
                    <div class="profile-name">{{ auth()->user()->name }}</div>
                    <div class="profile-email">{{ auth()->user()->email }}</div>
                    <div class="mt-3 d-flex flex-wrap align-items-center gap-2">
                        <span class="role-badge {{ auth()->user()->isEndministrator() ? 'admin' : 'warga' }}">
                            <i class="bi {{ auth()->user()->isEndministrator() ? 'bi-shield-fill-check' : 'bi-person-fill' }}"></i>
                            {{ ucfirst(auth()->user()->role) }}
                        </span>
                        @if(auth()->user()->isEndministrator())
                            <span class="text-muted small">
                                <i class="bi bi-check-circle-fill" style="color:var(--green);"></i> Akses penuh
                            </span>
                        @endif
                    </div>
                    <div class="d-flex flex-wrap gap-2 mt-4">
                        <a href="/map" class="action-btn primary">
                            <i class="bi bi-map-fill"></i> Buka Peta
                        </a>
                        <form method="POST" action="{{ route('logout') }}" class="d-inline">
                            @csrf
                            <button type="submit" class="action-btn outline">
                                <i class="bi bi-box-arrow-right"></i> Keluar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        {{-- Stats (Endministrator) / Info (Warga) --}}
        <div class="col-lg-8">
            @if(auth()->user()->isEndministrator())
                <div class="row g-3">
                    <div class="col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon green"><i class="bi bi-megaphone-fill"></i></div>
                            <div class="stat-info">
                                <div class="stat-value">{{ $lapors->count() }}</div>
                                <div class="stat-label">Total Laporan</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon blue"><i class="bi bi-calendar-check-fill"></i></div>
                            <div class="stat-info">
                                <div class="stat-value">{{ $lapors->where('created_at', '>=', now()->subDays(7))->count() }}</div>
                                <div class="stat-label">Laporan 7 Hari Terakhir</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon orange"><i class="bi bi-clock-history"></i></div>
                            <div class="stat-info">
                                <div class="stat-value">{{ $lapors->where('created_at', '>=', now()->subDays(30))->count() }}</div>
                                <div class="stat-label">Laporan 30 Hari Terakhir</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon purple"><i class="bi bi-tag-fill"></i></div>
                            <div class="stat-info">
                                <div class="stat-value">{{ $lapors->pluck('kategori')->unique()->count() }}</div>
                                <div class="stat-label">Kategori Unik</div>
                            </div>
                        </div>
                    </div>
                </div>
            @else
                <div class="stat-card h-100 d-flex align-items-center">
                    <div class="stat-icon blue"><i class="bi bi-info-circle-fill"></i></div>
                    <div class="stat-info">
                        <div class="stat-label mb-1">Anda login sebagai <strong>Warga</strong></div>
                        <p class="text-muted small mb-0">
                            Gunakan menu <strong>Lapor</strong> untuk melaporkan kejadian di sekitar Dusun Kerban.
                            Fitur pengelolaan laporan tersedia untuk Endministrator.
                        </p>
                    </div>
                </div>
            @endif
        </div>
    </div>

    {{-- ═══════════════════════════════════════════ --}}
    {{-- ENDMINISTRATOR: CRUD Table --}}
    {{-- ═══════════════════════════════════════════ --}}
    @if(auth()->user()->isEndministrator())
    <div class="table-card">
        <div class="table-header">
            <h5><i class="bi bi-clipboard-data me-2" style="color:var(--green);"></i>Kelola Laporan Warga</h5>
            <span class="table-count">{{ $lapors->count() }} laporan</span>
        </div>

        @if($lapors->isEmpty())
            <div class="empty-state">
                <div class="empty-icon"><i class="bi bi-inbox"></i></div>
                <h6 class="fw-bold text-muted">Belum ada laporan</h6>
                <p class="text-muted small">Laporan dari warga akan muncul di sini.</p>
            </div>
        @else
        <div class="table-responsive">
            <table class="table-custom">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Judul</th>
                        <th>Pelapor</th>
                        <th>Kategori</th>
                        <th>Lokasi</th>
                        <th>Foto</th>
                        <th>Tanggal</th>
                        <th style="text-align:right;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($lapors as $index => $lapor)
                    <tr>
                        <td data-label="#">{{ $index + 1 }}</td>
                        <td data-label="Judul" class="fw-semibold" style="max-width:200px;">
                            <span title="{{ $lapor->judul }}">{{ Str::limit($lapor->judul, 40) }}</span>
                        </td>
                        <td data-label="Pelapor">{{ $lapor->nama_pelapor ?: '—' }}</td>
                        <td data-label="Kategori">
                            @php
                                $catColors = [
                                    'Banjir' => 'blue', 'Longsor' => 'orange', 'Kebakaran' => 'red',
                                    'Kesehatan' => 'teal', 'Fasilitas Umum' => 'purple',
                                    'Infrastruktur' => 'green', 'Keamanan' => 'green',
                                    'Laporan Cepat' => 'green',
                                ];
                                $catColor = $lapor->kategori ? ($catColors[$lapor->kategori] ?? 'green') : 'green';
                            @endphp
                            @if($lapor->kategori)
                                <span class="cat-badge {{ $catColor }}">{{ $lapor->kategori }}</span>
                            @else
                                <span class="text-muted">—</span>
                            @endif
                        </td>
                        <td data-label="Lokasi" class="cell-coords">
                            {{ number_format($lapor->lat, 6) }}, {{ number_format($lapor->lng, 6) }}
                        </td>
                        <td data-label="Foto">
                            @if($lapor->foto)
                                <a href="{{ Storage::disk('supabase')->url($lapor->foto) }}" target="_blank" class="cell-photo">
                                    <img src="{{ Storage::disk('supabase')->url($lapor->foto) }}" width="42" height="42" alt="foto">
                                </a>
                            @else
                                <span class="text-muted">—</span>
                            @endif
                        </td>
                        <td data-label="Tanggal" class="cell-date">
                            {{ $lapor->created_at->translatedFormat('d M Y, H:i') }}
                        </td>
                        <td data-label="Aksi">
                            <div class="d-flex justify-content-end gap-1">
                                <button class="btn-action edit"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editLaporModal{{ $lapor->id }}"
                                        title="Edit laporan">
                                    <i class="bi bi-pencil-fill"></i>
                                </button>
                                <form method="POST"
                                      action="{{ route('dashboard.lapor.destroy', $lapor->id) }}"
                                      onsubmit="return confirm('Hapus laporan ini?')">
                                    @csrf @method('DELETE')
                                    <button class="btn-action delete" title="Hapus laporan">
                                        <i class="bi bi-trash-fill"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif
    </div>

    {{-- ═══ EDIT MODALS ═══ --}}
    @foreach($lapors as $lapor)
    <div class="modal fade" id="editLaporModal{{ $lapor->id }}" tabindex="-1"
         aria-labelledby="editLabel{{ $lapor->id }}" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <form method="POST" action="{{ route('dashboard.lapor.update', $lapor->id) }}" enctype="multipart/form-data">
                    @csrf @method('PUT')
                    <div class="modal-header">
                        <h5 class="fw-bold" id="editLabel{{ $lapor->id }}">
                            <i class="bi bi-pencil-square me-2" style="color:var(--green);"></i>
                            Edit Laporan #{{ $lapor->id }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold small">Judul</label>
                                <input type="text" name="judul" class="form-control rounded-3"
                                       value="{{ $lapor->judul }}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold small">Nama Pelapor</label>
                                <input type="text" name="nama_pelapor" class="form-control rounded-3"
                                       value="{{ $lapor->nama_pelapor }}" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-semibold small">Deskripsi</label>
                                <textarea name="deskripsi" class="form-control rounded-3" rows="3" required>{{ $lapor->deskripsi }}</textarea>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-semibold small">Kategori</label>
                                <input type="text" name="kategori" class="form-control rounded-3"
                                       value="{{ $lapor->kategori }}" placeholder="Contoh: Jalan Rusak">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label fw-semibold small">Latitude</label>
                                <input type="number" step="any" name="lat" class="form-control rounded-3"
                                       value="{{ $lapor->lat }}" required>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label fw-semibold small">Longitude</label>
                                <input type="number" step="any" name="lng" class="form-control rounded-3"
                                       value="{{ $lapor->lng }}" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-semibold small">Ganti Foto (opsional)</label>
                                <input type="file" name="foto" class="form-control rounded-3" accept="image/*">
                                @if($lapor->foto)
                                    <div class="mt-2 d-flex align-items-center gap-2">
                                        <img src="{{ Storage::disk('supabase')->url($lapor->foto) }}"
                                             class="rounded-3" style="height:60px;object-fit:cover;" alt="foto">
                                        <small class="text-muted">Foto saat ini</small>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary rounded-pill px-4" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-success rounded-pill px-4">
                            <i class="bi bi-check-lg me-1"></i>Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    @endforeach
    @endif
    {{-- END: Endministrator CRUD --}}

    {{-- ═══ DELETE ACCOUNT (all users) ═══ --}}
    <div class="text-center mt-5">
        <p class="text-muted small mb-2">Ingin menghapus akun Anda secara permanen?</p>
        <form method="POST" action="{{ route('profile.destroy') }}" class="d-inline"
              onsubmit="return confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini TIDAK DAPAT dibatalkan.')">
            @csrf @method('DELETE')
            <button type="submit" class="action-btn danger">
                <i class="bi bi-trash-fill me-1"></i>Hapus Akun Saya
            </button>
        </form>
    </div>

</div>
</div>
@endsection

