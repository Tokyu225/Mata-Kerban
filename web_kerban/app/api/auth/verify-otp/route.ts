import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
  }

  if (!user.otp || !user.otpExpiresAt) {
    return NextResponse.json({ error: "Tidak ada OTP yang diminta" }, { status: 400 });
  }

  if (new Date() > user.otpExpiresAt) {
    return NextResponse.json({ error: "OTP telah kadaluarsa" }, { status: 400 });
  }

  if (user.otp !== otp) {
    return NextResponse.json({ error: "OTP tidak valid" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      otp: null,
      otpExpiresAt: null,
    },
  });

  return NextResponse.json({
    message: "OTP berhasil diverifikasi",
    tempPassword: "verified", // used for auto-login flow
  });
}
