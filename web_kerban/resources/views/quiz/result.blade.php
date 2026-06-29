@extends('layouts.public')

@section('title', 'Hasil Quiz - Desa Kerban')

@section('styles')
<style>
    .result-hero {
        min-height: 100vh;
        background: linear-gradient(135deg, #1a5c2e 0%, #2f6f3e 50%, #198754 100%);
        padding-top: 100px;
        padding-bottom: 60px;
    }

    .result-container {
        max-width: 800px;
        margin: 0 auto;
    }

    @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
        0% { opacity: 0; transform: scale(0.5); }
        100% { opacity: 1; transform: scale(1); }
    }

    .score-card {
        background: white;
        border-radius: 24px;
        padding: 40px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        animation: fadeInUp 0.8s ease-out both;
        margin-bottom: 40px;
    }

    .score-circle {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 800;
        color: white;
        animation: scaleIn 0.6s ease-out 0.3s both;
    }

    .score-perfect { background: linear-gradient(135deg, #ffc107, #ff9800); }
    .score-great { background: linear-gradient(135deg, #198754, #20c997); }
    .score-good { background: linear-gradient(135deg, #0d6efd, #0dcaf0); }
    .score-try { background: linear-gradient(135deg, #dc3545, #fd7e14); }

    .score-label {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 5px;
    }

    .score-sub {
        color: #718096;
        font-size: 1rem;
    }

    .score-message {
        margin-top: 20px;
        padding: 15px;
        border-radius: 12px;
        font-size: 1.05rem;
        font-weight: 600;
    }

    .result-card {
        background: white;
        border-radius: 16px;
        padding: 25px;
        margin-bottom: 15px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        animation: fadeInUp 0.5s ease-out both;
        border-left: 5px solid #e2e8f0;
    }

    .result-card.correct {
        border-left-color: #198754;
    }

    .result-card.incorrect {
        border-left-color: #dc3545;
    }

    .result-card:nth-child(1) { animation-delay: 0.1s; }
    .result-card:nth-child(2) { animation-delay: 0.2s; }
    .result-card:nth-child(3) { animation-delay: 0.3s; }
    .result-card:nth-child(4) { animation-delay: 0.4s; }
    .result-card:nth-child(5) { animation-delay: 0.5s; }
    .result-card:nth-child(6) { animation-delay: 0.6s; }
    .result-card:nth-child(7) { animation-delay: 0.7s; }
    .result-card:nth-child(8) { animation-delay: 0.8s; }
    .result-card:nth-child(9) { animation-delay: 0.9s; }
    .result-card:nth-child(10) { animation-delay: 1.0s; }

    .result-q {
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 10px;
    }

    .result-option {
        padding: 6px 12px;
        margin-bottom: 4px;
        border-radius: 8px;
        font-size: 0.9rem;
    }

    .result-option.correct-answer {
        background: #e6f7ee;
        color: #198754;
        font-weight: 600;
    }

    .result-option.wrong-answer {
        background: #fde8e8;
        color: #dc3545;
        font-weight: 600;
    }

    .result-option.neutral {
        color: #718096;
    }

    .btn-actions {
        text-align: center;
        margin-top: 30px;
        margin-bottom: 40px;
        animation: fadeInUp 0.8s ease-out 1.2s both;
    }

    .btn-actions .btn {
        padding: 12px 30px;
        border-radius: 50px;
        font-weight: 600;
        margin: 5px;
    }
</style>
@endsection

@section('content')
<div class="result-hero">
    <div class="result-container container">
        {{-- Score Card --}}
        @php
            $percentage = ($score / $total) * 100;
            if ($percentage == 100) {
                $scoreClass = 'score-perfect';
                $message = 'Sempurna! Kamu benar-benar mengenal Dusun Kerban!';
            } elseif ($percentage >= 70) {
                $scoreClass = 'score-great';
                $message = 'Hebat! Pengetahuanmu tentang Dusun Kerban sangat baik!';
            } elseif ($percentage >= 50) {
                $scoreClass = 'score-good';
                $message = 'Lumayan! Masih ada ruang untuk belajar lebih banyak!';
            } else {
                $scoreClass = 'score-try';
                $message = 'Ayo coba lagi! Pelajari lebih lanjut tentang Dusun Kerban!';
            }
        @endphp

        <div class="score-card">
            <div class="score-circle {{ $scoreClass }}">
                {{ $score }}/{{ $total }}
            </div>
            <div class="score-label">{{ $score }} dari {{ $total }}</div>
            <div class="score-sub">Nilai: {{ number_format($percentage, 0) }}%</div>
            <div class="score-message" style="background: #f8fafc;">
                {{ $message }}
            </div>
        </div>

        {{-- Detail Jawaban --}}
        <h4 style="color: white; text-align: center; margin-bottom: 25px; animation: fadeInUp 0.5s ease-out both;">
            Detail Jawaban
        </h4>

        @foreach($results as $index => $r)
        <div class="result-card {{ $r['is_correct'] ? 'correct' : 'incorrect' }}">
            <div class="result-q">
                {{ $index + 1 }}. {{ $r['question'] }}
            </div>

            @foreach($r['options'] as $optIndex => $option)
                @php
                    $optionClass = 'neutral';
                    if ($optIndex === $r['correct']) {
                        $optionClass = 'correct-answer';
                    } elseif ($r['user_answer'] !== null && $optIndex === $r['user_answer'] && !$r['is_correct']) {
                        $optionClass = 'wrong-answer';
                    }
                @endphp
                <div class="result-option {{ $optionClass }}">
                    {{ $option }}
                </div>
            @endforeach
        </div>
        @endforeach

        {{-- Tombol Aksi --}}
        <div class="btn-actions">
            <a href="{{ url('/quiz') }}" class="btn btn-warning btn-lg">Coba Lagi</a>
            <a href="{{ url('/') }}" class="btn btn-light btn-lg">Kembali ke Beranda</a>
        </div>
    </div>
</div>
@endsection
