"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_DURATION = 4637.6; // 1:17:17 (77 min)

const MEDIA_ERROR_MESSAGES: Record<number, string> = {
  1: "File audio tidak ditemukan atau tidak dapat diakses.",
  2: "Koneksi terputus saat memuat audio.",
  3: "Pemutaran audio dibatalkan atau gagal didekode.",
  4: "Format audio tidak didukung browser Anda (M4A/AAC). Coba gunakan browser lain seperti Chrome, Edge, atau Safari.",
};

function getMediaError(code: number | undefined): string {
  if (code === undefined || code === 0) return "Gagal memuat audio.";
  return MEDIA_ERROR_MESSAGES[code] ?? `Gagal memuat audio (kode: ${code}).`;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SejarahAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(AUDIO_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Check if M4A is supported; if the browser fires error early, we surface it
    const m4aSupported = audio.canPlayType("audio/mp4") !== "" || audio.canPlayType("audio/x-m4a") !== "";

    const onLoaded = () => {
      if (audio.duration && isFinite(audio.duration) && audio.duration > 1) {
        setDuration(audio.duration);
      }
      setReady(true);
      setError(null);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      const code = audio.error?.code;
      const msg = getMediaError(code);
      console.error(`[SejarahAudio] ${msg} (MediaError code: ${code})`);
      setError(msg);
      setReady(true); // unblock UI so the user sees the error
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    // Force ready after timeout in case metadata never loads
    const t = setTimeout(() => {
      if (!audio.duration || !isFinite(audio.duration) || audio.duration <= 1) {
        setReady(true);
      }
    }, 8000);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      clearTimeout(t);
    };
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const retry = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(null);
    setReady(false);
    audio.load();
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <button
        onClick={togglePlay}
        disabled={!ready || !!error}
        className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-40"
        title={error ? "Audio tidak tersedia" : isPlaying ? "Jeda" : "Putar"}
      >
        <i className={`bi ${isPlaying ? "bi-pause-fill" : "bi-play-fill"} text-amber-600 dark:text-amber-400 text-lg`} />
      </button>

      <div className="flex-1 min-w-0">
        {error ? (
          /* Error fallback */
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="bi bi-exclamation-triangle-fill text-red-500 text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                  Gagal Memutar Audio
                </p>
                <p className="text-xs text-red-600/80 dark:text-red-300/70 leading-relaxed mb-3">
                  {error}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={retry}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <i className="bi bi-arrow-clockwise" /> Coba Lagi
                  </button>
                  <a
                    href="/audio/sejarah-kerban.m4a"
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <i className="bi bi-download" /> Unduh Audio
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">
                Rekaman Sejarah — Suara 133
              </span>
              <span className="text-xs text-muted-foreground tabular-nums ml-2 flex-shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 rounded-full appearance-none bg-amber-200 dark:bg-amber-800/40 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
              style={{
                background: `linear-gradient(to right, #d97706 ${(currentTime / (duration || 1)) * 100}%, #fde68a ${(currentTime / (duration || 1)) * 100}%)`,
              }}
            />
          </>
        )}

        {/* Audio element: hidden off-screen, NOT display:none */}
        <audio
          ref={audioRef}
          preload="auto"
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
        >
          <source src="/audio/sejarah-kerban.m4a" type="audio/mp4" />
          <source src="/audio/sejarah-kerban.m4a" type="audio/x-m4a" />
        </audio>
      </div>
    </div>
  );
}
