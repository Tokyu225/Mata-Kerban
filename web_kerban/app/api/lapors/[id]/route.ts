import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const lapor = await prisma.lapor.update({
    where: { id },
    data: {
      judul: body.judul,
      namaPelapor: body.namaPelapor,
      deskripsi: body.deskripsi,
      kategori: body.kategori,
      foto: body.foto,
      lat: body.lat,
      lng: body.lng,
    },
  });
  return NextResponse.json(lapor);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.lapor.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
