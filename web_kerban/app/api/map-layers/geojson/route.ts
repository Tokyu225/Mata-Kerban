import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const layers = await prisma.mapLayer.findMany();

  const features = layers.map((layer) => {
    const geojson = JSON.parse(layer.geojson);
    return {
      type: "Feature",
      properties: {
        id: layer.id,
        name: layer.name,
        type: layer.type,
        category: layer.category,
      },
      geometry: geojson,
    };
  });

  return NextResponse.json({
    type: "FeatureCollection",
    features,
  });
}
