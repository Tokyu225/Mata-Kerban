"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "Dari mana asal nama 'Kerban' menurut versi 'Kerepan'?",
    o: ["Nama seorang tokoh", "Kebiasaan luhur masyarakat Jawa (kerepan)", "Nama tumbuhan langka", "Singkatan dari Kerajaan Banjar"],
    a: 1,
  },
  {
    q: "Apa arti kata 'Kerepan' dalam Bahasa Jawa?",
    o: ["Perang", "Kebiasaan", "Pengorbanan", "Persatuan"],
    a: 1,
  },
  {
    q: "Siapa tokoh sejarah yang terkait dengan asal-usul nama 'Kerban' versi 'Korban'?",
    o: ["Gajah Mada", "Pangeran Diponegoro", "Sultan Agung", "Raden Ajeng Kartini"],
    a: 1,
  },
  {
    q: "Pada tahun berapa Perang Jawa yang melibatkan Pangeran Diponegoro dimulai?",
    o: ["1815", "1825", "1835", "1845"],
    a: 1,
  },
  {
    q: "Apa makna kepercayaan 'Ana Dewa Ngangklang Jagat' yang diyakini masyarakat Jawa?",
    o: ["Ada Dewa yang menciptakan dunia", "Ada Dewa yang sedang berkeliling dunia saat maghrib", "Ada Dewa yang memberi hujan", "Ada Dewa pelindung desa"],
    a: 1,
  },
  {
    q: "Di desa manakah Dusun Kerban berada?",
    o: ["Desa Sukamaju", "Desa Makmur", "Desa Sumberarum", "Desa Sidomulyo"],
    a: 2,
  },
  {
    q: "Apa yang dilakukan pasukan Pangeran Diponegoro di wilayah Desa Sumberarum?",
    o: ["Mendirikan keraton", "Membangun perkemahan dan menggali sumber air", "Membuka pasar tradisional", "Membangun masjid"],
    a: 1,
  },
  {
    q: "Apa simbol utama yang melekat pada Dusun Kerban berdasarkan sejarahnya?",
    o: ["Kekayaan alam", "Kebiasaan luhur & semangat pengorbanan", "Perdagangan", "Pertanian modern"],
    a: 1,
  },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  const next = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[current + 1] ?? null);
    } else {
      setShowResult(true);
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(answers[current - 1] ?? null);
    }
  };

  const score = answers.reduce((acc, ans, i) => (ans === QUESTIONS[i].a ? acc + 1 : acc), 0);
  const percentage = Math.round((score / QUESTIONS.length) * 100);

  if (showResult) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl animate-fade-in">
        <div className="glass-card p-8 md:p-12 text-center">
          {/* Score Circle */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted" />
              <circle
                cx="80" cy="80" r="70" fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                stroke="currentColor"
                className={percentage >= 70 ? "text-green-500" : percentage >= 40 ? "text-yellow-500" : "text-red-500"}
                strokeDasharray={`${(percentage / 100) * 440} 440`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <span className="text-4xl font-display font-bold">{percentage}</span>
                <span className="text-xl">%</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {percentage >= 80 ? "🎉 Luar Biasa!" : percentage >= 60 ? "👍 Bagus!" : percentage >= 40 ? "📚 Terus Belajar!" : "💪 Jangan Menyerah!"}
          </h1>
          <p className="text-muted-foreground mb-6">
            Skor Anda: {score} dari {QUESTIONS.length} — pengetahuan sejarah Dusun Kerban
          </p>

          {/* Detailed Review */}
          <div className="text-left space-y-4 mt-8">
            {QUESTIONS.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.a;
              return (
                <div key={i} className={cn("p-4 rounded-xl border", isCorrect ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20" : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20")}>
                  <p className="font-medium text-sm mb-2">
                    {i + 1}. {q.q}
                  </p>
                  <p className="text-xs">
                    <span className="text-muted-foreground">Jawaban Anda: </span>
                    <span className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {q.o[userAns] || "Tidak dijawab"}
                    </span>
                    {!isCorrect && (
                      <>
                        <br />
                        <span className="text-muted-foreground">Jawaban benar: </span>
                        <span className="text-green-600 font-medium">{q.o[q.a]}</span>
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          <button onClick={() => { setShowResult(false); setCurrent(0); setAnswers([]); setSelected(null); }} className="btn-primary mt-8">
            <i className="bi bi-arrow-repeat mr-2" /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[current];

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl animate-fade-in">
      <div className="glass-card p-8">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {current + 1}/{QUESTIONS.length}
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-6">{q.q}</h2>

        <div className="space-y-3">
          {q.o.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                selected === i
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                  : "border-border hover:border-primary-300 hover:bg-muted/50"
              )}
            >
              <span className={cn(
                "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mr-3",
                selected === i
                  ? "bg-primary-600 text-white"
                  : "bg-muted text-muted-foreground"
              )}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <i className="bi bi-arrow-left mr-1.5" /> Sebelumnya
          </button>
          <button
            onClick={next}
            disabled={selected === null}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {current === QUESTIONS.length - 1 ? (
              <>Lihat Hasil <i className="bi bi-check-lg ml-1.5" /></>
            ) : (
              <>Selanjutnya <i className="bi bi-arrow-right ml-1.5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
