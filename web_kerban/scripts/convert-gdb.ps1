# Convert PETA_DESA.gdb layers to GeoJSON
# Requires: QGIS installed at default path (provides ogr2ogr.exe)
# Usage: Run this script from PowerShell
#
# Layers exported:
#   PLPERSIL2        -> pl_persil.geojson      (Penggunaan Lahan, styled by PL field)
#   Persil_Kerban     -> persil_kerban.geojson  (Building footprints, styled by KETERANGAN)
#   Sarana_Prasarana  -> sarpras.geojson        (Points, styled by Kelas)

$GDB = "C:\Users\Shiroko\Downloads\PETA_DESA.gdb (7)\PETA_DESA.gdb"
$OUT = "C:\Users\Shiroko\Documents\PKL Site\Mata-Kerban\web_kerban\public\data"
$OGR = "C:\Program Files\QGIS 3.44.10\bin\ogr2ogr.exe"

# Fix PROJ conflict with PostGIS
$env:PROJ_LIB = "C:\Program Files\QGIS 3.44.10\share\proj"

Write-Host "Converting GDB layers to GeoJSON (WGS84)..." -ForegroundColor Cyan

& $OGR -f "GeoJSON" -t_srs "EPSG:4326" -overwrite "$OUT\pl_persil.geojson" $GDB "PLPERSIL2"
Write-Host "  OK: pl_persil.geojson" -ForegroundColor Green

& $OGR -f "GeoJSON" -t_srs "EPSG:4326" -overwrite "$OUT\persil_kerban.geojson" $GDB "Persil_Kerban"
Write-Host "  OK: persil_kerban.geojson" -ForegroundColor Green

& $OGR -f "GeoJSON" -t_srs "EPSG:4326" -overwrite "$OUT\sarpras.geojson" $GDB "Sarana_Prasarana"
Write-Host "  OK: sarpras.geojson" -ForegroundColor Green

Write-Host "`nDone! All layers exported to $OUT" -ForegroundColor Green
