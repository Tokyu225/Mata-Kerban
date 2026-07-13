"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password diperlukan"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const emailParam = searchParams.get("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    verified === "1" ? "Email berhasil diverifikasi! Silakan masuk." : ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: emailParam || "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const checkRes = await fetch("/api/auth/check-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    if (checkRes.ok) {
      const checkData = await checkRes.json();
      if (!checkData.verified) {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email atau password salah");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="glass-card p-8 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <i className="bi bi-shield-lock-fill text-4xl text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-2xl font-bold mt-3">Masuk</h1>
          <p className="text-sm text-muted-foreground mt-1">Silakan masuk ke akun Anda</p>
        </div>

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl p-3 mb-6">
            <i className="bi bi-check-circle mr-1.5" />{success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input {...register("email")} type="email" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" placeholder="Masukkan email" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input {...register("password")} type="password" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" placeholder="Masukkan password" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className={cn("w-full btn-primary py-3 text-base", loading && "opacity-60 cursor-not-allowed")}>
            {loading ? <span className="flex items-center justify-center gap-2"><span className="loader-spinner w-4 h-4 border-2" />Masuk...</span> : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><span className="loader-spinner" /></div>}>
      <LoginFormInner />
    </Suspense>
  );
}
