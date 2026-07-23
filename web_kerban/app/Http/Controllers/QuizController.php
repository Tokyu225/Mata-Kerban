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
                'question' => 'Dari mana asal nama "Kerban" menurut versi "Kerepan"?',
                'options' => ['Nama seorang tokoh', 'Kebiasaan luhur masyarakat Jawa (kerepan)', 'Nama tumbuhan langka', 'Singkatan dari Kerajaan Banjar'],
                'answer' => 1,
            ],
            [
                'id' => 2,
                'question' => 'Apa arti kata "Kerepan" dalam Bahasa Jawa?',
                'options' => ['Perang', 'Kebiasaan', 'Pengorbanan', 'Persatuan'],
                'answer' => 1,
            ],
            [
                'id' => 3,
                'question' => 'Siapa tokoh sejarah yang terkait dengan asal-usul nama "Kerban" versi "Korban"?',
                'options' => ['Gajah Mada', 'Pangeran Diponegoro', 'Sultan Agung', 'Raden Ajeng Kartini'],
                'answer' => 1,
            ],
            [
                'id' => 4,
                'question' => 'Pada tahun berapa Perang Jawa yang melibatkan Pangeran Diponegoro dimulai?',
                'options' => ['1815', '1825', '1835', '1845'],
                'answer' => 1,
            ],
            [
                'id' => 5,
                'question' => 'Apa makna kepercayaan "Ana Dewa Ngangklang Jagat" yang diyakini masyarakat Jawa?',
                'options' => ['Ada Dewa yang menciptakan dunia', 'Ada Dewa yang sedang berkeliling dunia saat maghrib', 'Ada Dewa yang memberi hujan', 'Ada Dewa pelindung desa'],
                'answer' => 1,
            ],
            [
                'id' => 6,
                'question' => 'Di desa manakah Dusun Kerban berada?',
                'options' => ['Desa Sukamaju', 'Desa Makmur', 'Desa Sumberarum', 'Desa Sidomulyo'],
                'answer' => 2,
            ],
            [
                'id' => 7,
                'question' => 'Apa yang dilakukan pasukan Pangeran Diponegoro di wilayah Desa Sumberarum?',
                'options' => ['Mendirikan keraton', 'Membangun perkemahan dan menggali sumber air', 'Membuka pasar tradisional', 'Membangun masjid'],
                'answer' => 1,
            ],
            [
                'id' => 8,
                'question' => 'Kapan Era Kemerdekaan Indonesia yang menjadi tonggak semangat pengorbanan Dusun Kerban?',
                'options' => ['1928', '1945', '1950', '1965'],
                'answer' => 1,
            ],
            [
                'id' => 9,
                'question' => 'Apa simbol utama yang melekat pada Dusun Kerban berdasarkan sejarahnya?',
                'options' => ['Kekayaan alam', 'Kebiasaan luhur & semangat pengorbanan', 'Perdagangan', 'Pertanian modern'],
                'answer' => 1,
            ],
            [
                'id' => 10,
                'question' => 'Kebiasaan berhenti beraktivitas saat maghrib pada masyarakat Jawa mencerminkan nilai apa?',
                'options' => ['Kemalasan', 'Keseimbangan hidup antara manusia, alam, dan Sang Pencipta', 'Ketakutan akan gelap', 'Larangan kerja malam'],
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
