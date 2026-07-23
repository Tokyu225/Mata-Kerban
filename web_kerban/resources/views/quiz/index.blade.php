@extends('layouts.public')

@section('title', 'Quiz - Desa Kerban')

@section('styles')
<style>
    .quiz-hero {
        min-height: 100vh;
        background: linear-gradient(135deg, #1a5c2e 0%, #2f6f3e 50%, #198754 100%);
        padding-top: 100px;
        padding-bottom: 60px;
    }

    .quiz-container {
        max-width: 800px;
        margin: 0 auto;
    }

    .quiz-header {
        text-align: center;
        color: white;
        margin-bottom: 40px;
    }

    .quiz-header h1 {
        font-size: 2.5rem;
        font-weight: 800;
        animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .quiz-header p {
        font-size: 1.1rem;
        opacity: 0.9;
        animation: fadeInUp 0.8s ease-out 0.4s both;
    }

    .quiz-header .badge-question {
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(4px);
        padding: 8px 20px;
        border-radius: 50px;
        font-size: 0.9rem;
        color: white;
        display: inline-block;
        animation: fadeInUp 0.8s ease-out 0.3s both;
    }

    @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
        0% { opacity: 0; transform: translateX(-20px); }
        100% { opacity: 1; transform: translateX(0); }
    }

    .question-card {
        background: white;
        border-radius: 16px;
        padding: 30px;
        margin-bottom: 20px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        animation: slideIn 0.5s ease-out both;
        transition: transform 0.2s;
    }

    .question-card:hover {
        transform: translateY(-2px);
    }

    .question-card:nth-child(1) { animation-delay: 0.1s; }
    .question-card:nth-child(2) { animation-delay: 0.2s; }
    .question-card:nth-child(3) { animation-delay: 0.3s; }
    .question-card:nth-child(4) { animation-delay: 0.4s; }
    .question-card:nth-child(5) { animation-delay: 0.5s; }
    .question-card:nth-child(6) { animation-delay: 0.6s; }
    .question-card:nth-child(7) { animation-delay: 0.7s; }
    .question-card:nth-child(8) { animation-delay: 0.8s; }
    .question-card:nth-child(9) { animation-delay: 0.9s; }
    .question-card:nth-child(10) { animation-delay: 1.0s; }

    .question-number {
        display: inline-block;
        background: #198754;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        text-align: center;
        line-height: 32px;
        font-weight: bold;
        font-size: 0.9rem;
        margin-right: 12px;
    }

    .question-text {
        font-weight: 600;
        font-size: 1.1rem;
        color: #2d3748;
        margin-bottom: 18px;
        display: flex;
        align-items: center;
    }

    .quiz-option {
        display: block;
        position: relative;
        padding: 12px 18px 12px 48px;
        margin-bottom: 8px;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.25s ease;
        font-size: 0.95rem;
        color: #4a5568;
    }

    .quiz-option:hover {
        background: #e6f7ee;
        border-color: #198754;
    }

    .quiz-option input[type="radio"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
    }

    .quiz-option .radio-custom {
        position: absolute;
        left: 14px;
        top: 14px;
        width: 22px;
        height: 22px;
        border: 2px solid #cbd5e0;
        border-radius: 50%;
        transition: all 0.25s ease;
    }

    .quiz-option input[type="radio"]:checked ~ .radio-custom {
        border-color: #198754;
        background: #198754;
    }

    .quiz-option input[type="radio"]:checked ~ .radio-custom::after {
        content: '';
        position: absolute;
        top: 4px;
        left: 4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
    }

    .quiz-option input[type="radio"]:checked ~ .option-text {
        color: #198754;
        font-weight: 600;
    }

    .quiz-option:has(input[type="radio"]:checked) {
        background: #e6f7ee;
        border-color: #198754;
    }

    .submit-area {
        text-align: center;
        margin-top: 30px;
        margin-bottom: 60px;
        animation: fadeInUp 0.8s ease-out 1.2s both;
    }

    .btn-submit {
        padding: 14px 50px;
        font-size: 1.15rem;
        font-weight: 700;
        border-radius: 50px;
        background: linear-gradient(135deg, #ffc107, #ff9800);
        border: none;
        color: #333;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
    }

    .btn-submit:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(255, 193, 7, 0.5);
        background: linear-gradient(135deg, #ffca2c, #ff9800);
    }

    .progress-container {
        background: rgba(255,255,255,0.15);
        border-radius: 50px;
        height: 8px;
        margin-bottom: 30px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: #ffc107;
        border-radius: 50px;
        transition: width 0.5s ease;
        width: 0%;
    }
</style>
@endsection

@section('content')
<div class="quiz-hero">
    <div class="quiz-container container">
        <div class="quiz-header">
            <div class="badge-question mb-3">Quiz Sejarah</div>
            <h1>Seberapa Kenal Kamu dengan <br>Sejarah Dusun Kerban?</h1>
            <p>Jawab 10 pertanyaan tentang sejarah dusun dan buktikan pengetahuanmu!</p>
            <div class="progress-container">
                <div class="progress-fill" id="progressFill"></div>
            </div>
        </div>

        <form method="POST" action="{{ url('/quiz/submit') }}" id="quizForm">
            @csrf

            @foreach($questions as $index => $q)
            <div class="question-card">
                <div class="question-text">
                    <span class="question-number">{{ $index + 1 }}</span>
                    {{ $q['question'] }}
                </div>

                @foreach($q['options'] as $optIndex => $option)
                <label class="quiz-option">
                    <input type="radio" name="answers[{{ $q['id'] }}]" value="{{ $optIndex }}" required
                           onchange="updateProgress()">
                    <span class="radio-custom"></span>
                    <span class="option-text">{{ $option }}</span>
                </label>
                @endforeach
            </div>
            @endforeach

            <div class="submit-area">
                <button type="submit" class="btn btn-submit">
                    Kumpulkan Jawaban
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

@section('scripts')
<script>
    function updateProgress() {
        const total = {{ count($questions) }};
        const answered = document.querySelectorAll('input[type="radio"]:checked').length;
        const percent = (answered / total) * 100;
        document.getElementById('progressFill').style.width = percent + '%';
    }

    // Smooth scroll on submit
    document.getElementById('quizForm').addEventListener('submit', function(e) {
        const answered = document.querySelectorAll('input[type="radio"]:checked').length;
        const total = {{ count($questions) }};
        if (answered < total) {
            e.preventDefault();
            alert('Harap jawab semua pertanyaan (' + answered + '/' + total + ' terjawab)!');
        }
    });
</script>
@endsection
