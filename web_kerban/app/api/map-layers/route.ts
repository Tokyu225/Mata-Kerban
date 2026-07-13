import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const layers = await prisma.mapLayer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(layers);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const layer = await prisma.mapLayer.create({
    data: {
      name: body.name,
      type: body.type,
      geojson: JSON.stringify(body.geojson),
      category: body.category || null,
    },
  });
  return NextResponse.json(layer, { status: 201 });
}
