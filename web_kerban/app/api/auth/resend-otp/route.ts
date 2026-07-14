import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOtp } from "@/lib/utils";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
  }

  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpiresAt },
  });

  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@dusunkerban.my.id",
      to: email,
      subject: "Kode OTP Baru — Dusun Kerban",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Kode OTP Baru</h2>
          <p>Berikut kode OTP baru Anda:</p>
          <div style="background: #f0f4ff; padding: 20px; text-align: center; border-radius: 12px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2563eb;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">Kode berlaku selama 5 menit.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error("Failed to resend OTP:", e);
  }

  return NextResponse.json({
    message: "OTP baru telah dikirim",
    devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
  });
}
