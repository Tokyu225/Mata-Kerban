<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class QuizController extends Controller
{
    private function getQuestions()
    {
        return [
            [
                'id' => 1,
                'question' => 'Apa nama dusun yang menjadi lokasi Sistem Informasi & WebGIS ini?',
                'options' => ['Desa Kerban', 'Dusun Kerban', 'Desa Sukamaju', 'Dusun Makmur'],
                'answer' => 1,
            ],
            [
                'id' => 2,
                'question' => 'Apa kepanjangan dari GIS?',
                'options' => ['Geographic Information System', 'General Internet System', 'Global Integration Service', 'Geographic Internet Service'],
                'answer' => 0,
            ],
            [
                'id' => 3,
                'question' => 'Siapa yang dapat menggunakan fitur MyMap pada website ini?',
                'options' => ['Hanya Perangkat Desa', 'Masyarakat Umum', 'Hanya Admin', 'Hanya Kepala Dusun'],
                'answer' => 1,
            ],
            [
                'id' => 4,
                'question' => 'Apa fungsi utama dari WebGIS?',
                'options' => ['Membuat website', 'Menyajikan data geografis secara interaktif', 'Mengedit foto', 'Menjual produk online'],
                'answer' => 1,
            ],
            [
                'id' => 5,
                'question' => 'Apa saja produk unggulan dari Dusun Kerban?',
                'options' => ['Kopi Dusun, Keripik Singkong, Gula Aren', 'Beras, Jagung, Kedelai', 'Tahu, Tempe, Kecap', 'Batik, Tenun, Songket'],
                'answer' => 0,
            ],
            [
                'id' => 6,
                'question' => 'Apa teknologi peta interaktif yang digunakan pada website ini?',
                'options' => ['Google Maps', 'Leaflet.js', 'MapBox', 'OpenLayers'],
                'answer' => 1,
            ],
            [
                'id' => 7,
                'question' => 'Apa warna tema utama dari website Desa Kerban?',
                'options' => ['Biru', 'Merah', 'Hijau', 'Kuning'],
                'answer' => 2,
            ],
            [
                'id' => 8,
                'question' => 'Fitur apa yang bisa dilakukan pengguna pada peta interaktif?',
                'options' => ['Menggambar polygon, garis, dan marker', 'Bermain game', 'Mengirim pesan', 'Upload foto'],
                'answer' => 0,
            ],
            [
                'id' => 9,
                'question' => 'Apa tujuan utama dari pembuatan website ini?',
                'options' => ['Hiburan', 'Sistem Informasi Desa & Pemetaan Wilayah', 'Jual Beli Online', 'Media Sosial'],
                'answer' => 1,
            ],
            [
                'id' => 10,
                'question' => 'Apa nama framework PHP yang digunakan untuk membangun website ini?',
                'options' => ['CodeIgniter', 'Laravel', 'Symfony', 'Yii'],
                'answer' => 1,
            ],
        ];
    }

    public function index()
    {
        $questions = $this->getQuestions();
        return view('quiz.index', compact('questions'));
    }

    public function submit(Request $request)
    {
        $questions = $this->getQuestions();
        $answers = $request->input('answers', []);
        $score = 0;
        $total = count($questions);
        $results = [];

        foreach ($questions as $q) {
            $qId = $q['id'];
            $userAnswer = $answers[$qId] ?? null;
            $isCorrect = $userAnswer !== null && (int)$userAnswer === $q['answer'];
            if ($isCorrect) $score++;

            $results[] = [
                'question' => $q['question'],
                'options' => $q['options'],
                'correct' => $q['answer'],
                'user_answer' => $userAnswer !== null ? (int)$userAnswer : null,
                'is_correct' => $isCorrect,
            ];
        }

        return view('quiz.result', compact('score', 'total', 'results'));
    }
}
