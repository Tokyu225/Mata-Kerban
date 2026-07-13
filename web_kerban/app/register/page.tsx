"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["warga", "endministrator"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "warga" },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Gagal mendaftar");
      setLoading(false);
      return;
    }

    router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="glass-card p-8 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <i className="bi bi-person-plus-fill text-4xl text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold mt-3">Daftar Akun</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Buat akun baru untuk mengakses semua fitur
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Nama Lengkap</label>
            <input
              {...register("name")}
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Masukkan nama"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Masukkan email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Minimal 8 karakter"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Peran</label>
            <select
              {...register("role")}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            >
              <option value="warga">Warga</option>
              <option value="endministrator">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full btn-primary py-3 text-base",
              loading && "opacity-60 cursor-not-allowed"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loader-spinner w-4 h-4 border-2" /> Mendaftar...
              </span>
            ) : (
              "Daftar"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
