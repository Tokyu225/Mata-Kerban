import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Symbology & label config — maps source_layer → style (same as artisan command)
const LAYER_CONFIG: Record<string, { category: string; labelField: string; symbology: Record<string, unknown> }> = {
  NAMA_DUSUN:   { category: "toponim",           labelField: "KETERANGAN", symbology: { color: "#1a73e8", fillColor: "#1a73e8", fillOpacity: 1,    weight: 1,   radius: 6 } },
  NAMA_JALAN:   { category: "toponim",           labelField: "KETERANGAN", symbology: { color: "#ea4335", fillColor: "#ea4335", fillOpacity: 1,    weight: 1,   radius: 6 } },
  Sarana_Prasarana: { category: "sarana",        labelField: "TOPONIM",    symbology: { color: "#34a853", fillColor: "#34a853", fillOpacity: 0.8,  weight: 1,   radius: 8 } },
  Perairan_Titik:   { category: "perairan",      labelField: "Toponimi",   symbology: { color: "#4285f4", fillColor: "#4285f4", fillOpacity: 0.9,  weight: 1,   radius: 6 } },
  Perairan_Garis:   { category: "perairan",      labelField: "Toponimi",   symbology: { color: "#4285f4", weight: 3 } },
  Perairan_Area:    { category: "perairan",      labelField: "Toponimi",   symbology: { color: "#4285f4", fillColor: "#a8d1ff", fillOpacity: 0.5, weight: 2 } },
  Jaringan_Infrastruktur_Transportasi: { category: "transportasi", labelField: "Toponim", symbology: { color: "#fbbc04", weight: 3 } },
  PL_MERGE:         { category: "penggunaan_lahan", labelField: "NAMOBJ",  symbology: { color: "#34a853", fillColor: "#81c784", fillOpacity: 0.4, weight: 1.5 } },
  PL_MERGE_Merge1:  { category: "penggunaan_lahan", labelField: "NAMOBJ",  symbology: { color: "#34a853", fillColor: "#81c784", fillOpacity: 0.4, weight: 1.5 } },
  PLPERSIL2:        { category: "penggunaan_lahan", labelField: "NAMOBJ",  symbology: { color: "#ff9800", fillColor: "#ffcc80", fillOpacity: 0.4, weight: 1.5 } },
  Persil_Kerban:    { category: "persil",         labelField: "NAMOBJ",    symbology: { color: "#9c27b0", fillColor: "#ce93d8", fillOpacity: 0.4, weight: 1.5 } },
};

// Map geometry type to our simple type
function mapType(geomType: string): string {
  if (geomType.startsWith("Point"))           return "point";
  if (geomType.startsWith("LineString"))      return "line";
  if (geomType.startsWith("Polygon"))         return "polygon";
  if (geomType.startsWith("MultiPoint"))      return "point";
  if (geomType.startsWith("MultiLineString")) return "line";
  if (geomType.startsWith("MultiPolygon"))    return "polygon";
  return "polygon";
}

export async function GET() {
  const geojsonDir = path.join(process.cwd(), "storage", "app", "geojson");
  const features: any[] = [];

  try {
    const files = fs.readdirSync(geojsonDir).filter((f) => f.endsWith(".geojson"));

    for (const file of files) {
      const layerName = path.basename(file, ".geojson");
      const config = LAYER_CONFIG[layerName];
      if (!config) continue;

      const raw = fs.readFileSync(path.join(geojsonDir, file), "utf-8");
      const geojson = JSON.parse(raw);

      if (!geojson.features) continue;

      for (const feature of geojson.features) {
        const props = feature.properties || {};
        const labelField = config.labelField;
        const name = props[labelField] || props["NAMOBJ"] || props["TOPONIM"] || props["KETERANGAN"] || layerName;

        features.push({
          type: "Feature",
          properties: {
            // Metadata
            name,
            category: config.category,
            type: mapType(feature.geometry?.type),
            label_field: labelField,
            symbology: config.symbology,
            source_layer: layerName,
            // Original shapefile attributes
            ...props,
          },
          geometry: feature.geometry,
        });
      }
    }

    return NextResponse.json({ type: "FeatureCollection", features });
  } catch (err) {
    console.error("GeoJSON load error:", err);
    return NextResponse.json({ type: "FeatureCollection", features: [] });
  }
}
