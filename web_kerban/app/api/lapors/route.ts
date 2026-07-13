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
