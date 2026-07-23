const shapefile = require("shapefile");
const proj4 = require("proj4");
const fs = require("fs");
const path = require("path");

const SRC_DIR = "C:\\Users\\Shiroko\\Downloads\\shp tematik";
const OUT_DIR = path.join(__dirname, "..", "public", "data", "tematik");

// UTM Zone 49S (EPSG:32749) -> WGS84 (EPSG:4326)
const UTM_49S = '+proj=utm +zone=49 +south +datum=WGS84 +units=m +no_defs';
const WGS84 = '+proj=longlat +datum=WGS84 +no_defs';

function reprojectCoords(coords) {
  if (typeof coords[0] === 'number') {
    return proj4(UTM_49S, WGS84, coords);
  }
  return coords.map(reprojectCoords);
}

const SHAPEFILES = [
  { name: "batasrt_perubahan_pddk",      shp: "batasrt&perubahan pddk.shp" },
  { name: "kpdt_hunian_kelayakan",       shp: "kpdt hunian&kelayakan hunian.shp" },
  { name: "persebaran_batu_bata",        shp: "persebaran batu bata.shp" },
  { name: "persil_rumahrt",              shp: "persil+rumahrt.shp" },
];

async function convertOne({ name, shp }) {
  const shpPath = path.join(SRC_DIR, shp);
  const outPath = path.join(OUT_DIR, name + ".geojson");
  
  const geojson = await shapefile.read(shpPath);
  
  for (const feature of geojson.features) {
    feature.geometry.coordinates = reprojectCoords(feature.geometry.coordinates);
  }
  
  fs.writeFileSync(outPath, JSON.stringify(geojson));
  const geomTypes = [...new Set(geojson.features.map(f => f.geometry.type))];
  console.log(`✅ ${name}: ${geojson.features.length} features (${geomTypes.join(', ')}) -> ${outPath}`);
  return geojson;
}

async function convert() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  
  for (const entry of SHAPEFILES) {
    try {
      await convertOne(entry);
    } catch (err) {
      console.error(`❌ ${entry.name}: ${err.message}`);
    }
  }
  
  console.log("\n🎉 All done!");
}

convert().catch((err) => {
  console.error("Conversion failed:", err.message);
  process.exit(1);
});
