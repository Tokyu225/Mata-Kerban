import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { generateOtp } from "@/lib/utils";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "warga",
      otp,
      otpExpiresAt,
      emailVerified: null,
    },
  });

  // Send OTP via Resend
  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@dusunkerban.my.id",
      to: email,
      subject: "Kode OTP Verifikasi — Dusun Kerban",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Verifikasi Akun Dusun Kerban</h2>
          <p>Halo ${name},</p>
          <p>Berikut kode OTP Anda untuk verifikasi akun:</p>
          <div style="background: #f0f4ff; padding: 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2563eb;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">Kode berlaku selama 5 menit.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Failed to send OTP email:", e);
  }

  return NextResponse.json({
    message: "Registrasi berhasil. Silakan verifikasi OTP.",
    devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
  });
}
