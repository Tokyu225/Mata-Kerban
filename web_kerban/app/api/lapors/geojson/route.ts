import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const lapors = await prisma.lapor.findMany();

  const features = lapors.map((l) => ({
    type: "Feature",
    properties: {
      id: l.id,
      judul: l.judul,
      namaPelapor: l.namaPelapor,
      deskripsi: l.deskripsi,
      kategori: l.kategori,
      foto: l.foto,
    },
    geometry: {
      type: "Point",
      coordinates: [l.lng, l.lat],
    },
  }));

  return NextResponse.json({
    type: "FeatureCollection",
    features,
  });
}
