const shapefile = require("shapefile");
const proj4 = require("proj4");
const fs = require("fs");
const path = require("path");

const SHP_PATH = "C:\\Users\\Shiroko\\Downloads\\ini gw\\Persillnyan.shp";
const OUT_PATH = path.join(__dirname, "..", "public", "data", "persillnyan.geojson");

// UTM Zone 49S (EPSG:32749) -> WGS84 (EPSG:4326)
const UTM_49S = '+proj=utm +zone=49 +south +datum=WGS84 +units=m +no_defs';
const WGS84 = '+proj=longlat +datum=WGS84 +no_defs';

function reprojectCoords(coords) {
  if (typeof coords[0] === 'number') {
    // It's a [easting, northing] pair
    return proj4(UTM_49S, WGS84, coords);
  }
  // It's an array of rings/coordinates - recurse
  return coords.map(reprojectCoords);
}

async function convert() {
  const outDir = path.dirname(OUT_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const geojson = await shapefile.read(SHP_PATH);
  
  // Reproject all coordinates from UTM 49S to WGS84
  for (const feature of geojson.features) {
    feature.geometry.coordinates = reprojectCoords(feature.geometry.coordinates);
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(geojson));
  console.log(`✅ Converted & reprojected! Features: ${geojson.features.length}`);
  console.log(`   Output: ${OUT_PATH}`);
  
  // Verify first coord is now in lat/lon range
  const c = geojson.features[0].geometry.coordinates[0][0][0];
  console.log(`   Sample WGS84 coord: [${c[0].toFixed(6)}, ${c[1].toFixed(6)}]`);
}

convert().catch((err) => {
  console.error("Conversion failed:", err.message);
  process.exit(1);
});
