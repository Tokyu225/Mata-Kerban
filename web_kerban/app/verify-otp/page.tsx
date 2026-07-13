"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    const code = newOtp.join("");
    if (code.length === 6) verifyOtp(code);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    if (pasted.length === 6) verifyOtp(pasted);
  };

  const verifyOtp = async (code: string) => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: code }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "OTP tidak valid");
      setLoading(false);
      return;
    }
    router.push(`/login?verified=1&email=${encodeURIComponent(email)}`);
  };

  const resendOtp = async () => {
    setResending(true);
    setResendMsg("");
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (res.ok && json.devOtp) setDevOtp(json.devOtp);
    setResendMsg(res.ok ? "OTP baru telah dikirim!" : "Gagal mengirim ulang OTP");
    setResending(false);
  };

  useEffect(() => { document.getElementById("otp-0")?.focus(); }, []);

  if (!email) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">Email tidak ditemukan. Silakan daftar terlebih dahulu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="glass-card p-8 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <i className="bi bi-shield-check text-4xl text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold mt-3">Verifikasi OTP</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Masukkan kode 6 digit yang dikirim ke{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl p-3 mb-6">{error}</div>
        )}

        {resendMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl p-3 mb-6">{resendMsg}</div>
        )}

        {devOtp && (
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-xs rounded-xl p-3 mb-6 text-center">
            [DEV] OTP: <strong>{devOtp}</strong>
          </div>
        )}

        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={cn("w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-background", "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all", loading && "opacity-50")}
              disabled={loading}
            />
          ))}
        </div>

        {loading && <div className="flex justify-center mb-4"><span className="loader-spinner w-5 h-5 border-2" /></div>}

        <button onClick={resendOtp} disabled={resending} className="w-full text-sm text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2">
          {resending ? "Mengirim..." : "Kirim ulang OTP"}
        </button>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><span className="loader-spinner" /></div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
