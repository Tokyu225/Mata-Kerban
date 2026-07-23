import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email, password, role, turnstileToken } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  // Verify Turnstile token (canonical siteverify)
  const turnstileResult = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET || "",
        response: turnstileToken,
        remoteip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
      }),
    }
  );
  const turnstileData = await turnstileResult.json();

  if (!turnstileData.success) {
    return NextResponse.json(
      { error: "Verifikasi bot gagal. Silakan coba lagi." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "warga",
      emailVerified: new Date(), // auto-verified — Turnstile replaces OTP
    },
  });

  return NextResponse.json({
    message: "Registrasi berhasil. Silakan masuk.",
  });
}
