import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const lapors = await prisma.lapor.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(lapors);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Verify Turnstile token (canonical siteverify)
  if (body.turnstileToken) {
    const turnstileResult = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET || "",
          response: body.turnstileToken,
          remoteip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
        }),
      }
    );
    const turnstileData = await turnstileResult.json();
    if (!turnstileData.success) {
      return NextResponse.json({ error: "Verifikasi keamanan gagal." }, { status: 403 });
    }
  }

  const lapor = await prisma.lapor.create({
    data: {
      judul: body.judul,
      namaPelapor: body.namaPelapor || null,
      deskripsi: body.deskripsi,
      kategori: body.kategori || null,
      foto: body.foto || null,
      lat: body.lat,
      lng: body.lng,
    },
  });
  return NextResponse.json(lapor, { status: 201 });
}
