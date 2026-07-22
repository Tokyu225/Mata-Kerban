"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Fix Leaflet default marker icons in Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BASEMAPS: Record<string, { url: string; label: string }> = {
  satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", label: "Satelit" },
  street: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", label: "Jalan" },
  topo: { url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", label: "Topografi" },
};

// Symbology: PL (Penggunaan Lahan) code → label & color
const PL_LABELS: Record<string, string> = {
  "2": "Permukiman",
  "3": "Sawah / Tegalan",
  "5": "Fasilitas Umum",
  "6": "Industri Campuran",
  "7": "Industri",
  "8": "Peribadatan",
};
const PL_COLORS: Record<string, string> = {
  "2": "#f59e0b",
  "3": "#22c55e",
  "5": "#3b82f6",
  "6": "#a855f7",
  "7": "#ef4444",
  "8": "#14b8a6",
};
const PL_GROUP_KEY = "__group__";
const PL_UNKNOWN_KEY = "__unknown__";
const PL_GROUP_COLOR = "#84cc16";
const PL_GROUP_LABEL = "Kebun / Lahan";
const PL_UNKNOWN_COLOR = "#94a3b8";
const PL_UNKNOWN_LABEL = "Tidak diketahui";

function getPLKey(pl: string | null): string {
  if (!pl) return PL_UNKNOWN_KEY;
  if (PL_LABELS[pl]) return pl;
  return PL_GROUP_KEY;
}
function getPLColor(pl: string | null): string {
  if (!pl) return PL_UNKNOWN_COLOR;
  return PL_COLORS[pl] || PL_GROUP_COLOR;
}
function getPLLabel(pl: string | null): string {
  if (!pl) return PL_UNKNOWN_LABEL;
  return PL_LABELS[pl] || PL_GROUP_LABEL;
}

// Legend entries: ordered display list
const PL_LEGEND_ENTRIES: { key: string; label: string; color: string }[] = [
  { key: "2", label: "Permukiman", color: PL_COLORS["2"] },
  { key: "3", label: "Sawah / Tegalan", color: PL_COLORS["3"] },
  { key: "5", label: "Fasilitas Umum", color: PL_COLORS["5"] },
  { key: "6", label: "Industri Campuran", color: PL_COLORS["6"] },
  { key: "7", label: "Industri", color: PL_COLORS["7"] },
  { key: "8", label: "Peribadatan", color: PL_COLORS["8"] },
  { key: PL_GROUP_KEY, label: PL_GROUP_LABEL, color: PL_GROUP_COLOR },
  { key: PL_UNKNOWN_KEY, label: PL_UNKNOWN_LABEL, color: PL_UNKNOWN_COLOR },
];
const ALL_CATEGORY_KEYS = PL_LEGEND_ENTRIES.map((e) => e.key);

export default function MapContent() {
  const { data: session } = useSession();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const categoryLayersRef = useRef<Map<string, L.GeoJSON>>(new Map());
  const persillnyanRef = useRef<L.GeoJSON | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);

  const [basemap, setBasemap] = useState("satellite");
  const [drawName, setDrawName] = useState("");
  const [drawCategory, setDrawCategory] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingGeoJSON, setPendingGeoJSON] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [coords, setCoords] = useState({ lat: 0, lng: 0, zoom: 0 });
  const [locating, setLocating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(() => new Set(ALL_CATEGORY_KEYS));
  // DB layer category toggles (from map_layers table)
  const [dbCategories, setDbCategories] = useState<{ key: string; label: string; color: string; count: number }[]>([]);
  const [visibleDbCategories, setVisibleDbCategories] = useState<Set<string>>(new Set());

  const isAdmin = (session?.user as any)?.role === "endministrator";

  // Category display config
  const CATEGORY_LABELS: Record<string, string> = {
    toponim: "Toponim",
    sarana: "Sarana Prasarana",
    perairan: "Perairan",
    transportasi: "Transportasi",
    penggunaan_lahan: "Penggunaan Lahan",
    persil: "Persil",
  };

  const loadLayers = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/api/map-layers/geojson");
      if (!res.ok) return;
      const data = await res.json();

      // Remove old category layers
      categoryLayersRef.current.forEach((layer) => mapRef.current?.removeLayer(layer));
      categoryLayersRef.current.clear();

      // Group features by category
      const grouped: Record<string, any[]> = {};
      data.features.forEach((f: any) => {
        const cat = f.properties?.category || "lainnya";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(f);
      });

      // Build category list for legend
      const catList: { key: string; label: string; color: string; count: number }[] = [];
      const defaultColor = "#3388ff";

      Object.entries(grouped).forEach(([cat, features]) => {
        // Use first feature's color for legend icon
        const firstSym = features[0]?.properties?.symbology || {};
        const color = firstSym.color || firstSym.fillColor || defaultColor;

        const geoJsonLayer = L.geoJSON(
          { type: "FeatureCollection", features } as any,
          {
            // Per-feature style — each feature carries its own symbology
            style: (feature) => {
              const s = feature?.properties?.symbology || {};
              const isPolygon = feature?.geometry?.type?.startsWith("Polygon") || feature?.geometry?.type?.startsWith("MultiPolygon");
              const isLine = feature?.geometry?.type?.startsWith("LineString") || feature?.geometry?.type?.startsWith("MultiLineString");
              return {
                color: s.color || defaultColor,
                fillColor: isPolygon ? (s.fillColor || s.color || defaultColor) : undefined,
                fillOpacity: isPolygon ? (s.fillOpacity ?? 0.3) : undefined,
                weight: s.weight ?? (isLine ? 3 : 2),
                dashArray: s.dashArray ?? undefined,
              };
            },
            pointToLayer: (feature, latlng) => {
              const s = feature?.properties?.symbology || {};
              return L.circleMarker(latlng, {
                radius: s.radius ?? 6,
                fillColor: s.fillColor || s.color || defaultColor,
                color: s.color || defaultColor,
                weight: s.weight ?? 1,
                fillOpacity: s.fillOpacity ?? 0.8,
              });
            },
            onEachFeature: (feature, layer) => {
              const p = feature.properties;
              const title = p.Toponimi || p.TOPONIM || p.Toponim || p.name || "(tanpa nama)";
              const cat = p.category;
              const plLabel = PL_LABELS[p.PL] || p.PL || "";
              const detail = p.KET_DETAIL || plLabel || p.KETERANGAN || "";
              const admin = [p.WADMPR, p.WADMKK, p.WADMKC, p.WADMKD]
                .filter(Boolean)
                .join(" → ");

              let bodyRows = "";

              if (cat === "persil" || cat === "penggunaan_lahan") {
                bodyRows += `<tr><td>Guna Lahan</td><td><strong>${detail || "-"}</strong></td></tr>`;
                if (p.DUSUN)   bodyRows += `<tr><td>Dusun</td><td>${p.DUSUN}</td></tr>`;
                if (admin)     bodyRows += `<tr><td>Wilayah</td><td>${admin}</td></tr>`;
                if (p.Id)      bodyRows += `<tr><td>ID Persil</td><td>${p.Id}</td></tr>`;
              } else if (cat === "sarana") {
                if (p.Sub_Unsur) bodyRows += `<tr><td>Sub Unsur</td><td>${p.Sub_Unsur}</td></tr>`;
                if (p.Kelas)     bodyRows += `<tr><td>Kelas</td><td>${p.Kelas}</td></tr>`;
              } else if (cat === "transportasi") {
                if (p.Sub_Unsur) bodyRows += `<tr><td>Sub Unsur</td><td>${p.Sub_Unsur}</td></tr>`;
                if (p.Kelas)     bodyRows += `<tr><td>Kelas</td><td>${p.Kelas}</td></tr>`;
              } else if (cat === "perairan") {
                if (p.Sub_Unsur) bodyRows += `<tr><td>Sub Unsur</td><td>${p.Sub_Unsur}</td></tr>`;
                if (p.Kelas)     bodyRows += `<tr><td>Kelas</td><td>${p.Kelas}</td></tr>`;
              } else if (cat === "toponim") {
                if (p.KETERANGAN) bodyRows += `<tr><td>Keterangan</td><td>${p.KETERANGAN}</td></tr>`;
              }

              // Source
              bodyRows += `<tr><td>Sumber</td><td style="color:#888;font-size:10px">${p.source_layer || "-"}</td></tr>`;

              layer.bindPopup(`
                <div style="min-width:200px;max-width:320px;font-family:system-ui,sans-serif">
                  <div style="font-size:13px;font-weight:700;margin-bottom:6px;color:#1a1a1a;line-height:1.3">${title}</div>
                  <table style="font-size:11px;width:100%;border-collapse:collapse">
                    ${bodyRows}
                  </table>
                </div>
              `);
            },
          }
        );

        geoJsonLayer.addTo(mapRef.current!);
        categoryLayersRef.current.set(cat, geoJsonLayer);

        catList.push({
          key: cat,
          label: CATEGORY_LABELS[cat] || cat,
          color: color,
          count: features.length,
        });
      });

      setDbCategories(catList);
      // All visible by default
      setVisibleDbCategories(new Set(catList.map((c) => c.key)));
    } catch {} 
  }, []);

  // Load Persillnyan boundary layer (hardbaked)
  const loadPersillnyan = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/data/persillnyan.geojson");
      if (!res.ok) { console.error("Persillnyan fetch failed:", res.status); return; }
      const data = await res.json();
      if (persillnyanRef.current) mapRef.current.removeLayer(persillnyanRef.current);
      persillnyanRef.current = L.geoJSON(data, {
        style: (feature) => {
          const pl = feature?.properties?.PL;
          const color = getPLColor(pl);
          return {
            color: color,
            weight: 3,
            opacity: 1,
            fillColor: color,
            fillOpacity: 0.2,
          };
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          const plLabel = getPLLabel(p.PL);
          const kd = p.KET_DETAIL;
          const guna = kd || plLabel;
          layer.bindPopup(`
            <div style="min-width:200px;font-family:system-ui,sans-serif">
              <strong style="font-size:14px">${p.Toponimi || p.NAMOBJ || "-"}</strong>
              <table style="margin-top:6px;font-size:12px;width:100%;border-collapse:collapse">
                <tr><td style="padding:2px 6px 2px 0;color:#666">Dusun</td><td style="padding:2px 0">${p.DUSUN || "-"}</td></tr>
                <tr><td style="padding:2px 6px 2px 0;color:#666">Desa</td><td style="padding:2px 0">${p.WADMKD || "-"}</td></tr>
                <tr><td style="padding:2px 6px 2px 0;color:#666">Kecamatan</td><td style="padding:2px 0">${p.WADMKC || "-"}</td></tr>
                <tr><td style="padding:2px 6px 2px 0;color:#666">Kabupaten</td><td style="padding:2px 0">${p.WADMKK || "-"}</td></tr>
                <tr><td style="padding:2px 6px 2px 0;color:#666">Provinsi</td><td style="padding:2px 0">${p.WADMPR || "-"}</td></tr>
                <tr><td style="padding:2px 6px 2px 0;color:#666;font-weight:600">Guna Lahan</td><td style="padding:2px 0;font-weight:600">${guna}</td></tr>
              </table>
            </div>
          `);
        },
      }).addTo(mapRef.current);
      // Auto-fit map to Persillnyan bounds
      try {
        const bounds = persillnyanRef.current.getBounds();
        if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
      } catch (e) { console.error("Persillnyan fitBounds error:", e); }
    } catch (e) { console.error("Persillnyan load error:", e); }
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const savedBasemap = localStorage.getItem("basemap") || "satellite";
    setBasemap(savedBasemap);

    const map = L.map(mapContainerRef.current, { center: [-7.5674, 110.172], zoom: 16, zoomControl: false, attributionControl: false });
    tileRef.current = L.tileLayer(BASEMAPS[savedBasemap].url, { attribution: "&copy; contributors", maxZoom: 19 }).addTo(map);
    L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

    if (isAdmin) {
      import("leaflet-draw").then(() => {
        const m = mapRef.current;
        if (!m) return;
        const DrawControl = (L.Control as any).Draw;
        const DrawEvent = (L as any).Draw.Event;
        if (DrawControl) {
          drawnItemsRef.current = new L.FeatureGroup();
          m.addLayer(drawnItemsRef.current);
          const drawControl = new DrawControl({
            position: "topright",
            draw: { polygon: true, polyline: true, rectangle: true, circle: false, marker: true, circlemarker: false },
            edit: { featureGroup: drawnItemsRef.current },
          });
          m.addControl(drawControl);
          m.on(DrawEvent.CREATED, (e: any) => {
            drawnItemsRef.current?.clearLayers();
            drawnItemsRef.current?.addLayer(e.layer);
            setPendingGeoJSON(e.layer.toGeoJSON());
            setShowSaveDialog(true);
          });
        }
      });
    }

    mapRef.current = map;
    loadLayers();
    loadPersillnyan();

    // Track coordinates
    const updateCoords = () => {
      const c = map.getCenter();
      setCoords({ lat: c.lat, lng: c.lng, zoom: map.getZoom() });
    };
    map.on("moveend", updateCoords);
    updateCoords();

    const handler = (e: CustomEvent) => {
      const key = e.detail;
      setBasemap(key);
      if (tileRef.current && mapRef.current) {
        mapRef.current.removeLayer(tileRef.current);
        tileRef.current = L.tileLayer(BASEMAPS[key].url).addTo(mapRef.current);
      }
    };
    window.addEventListener("basemap-change", handler as EventListener);

    return () => {
      window.removeEventListener("basemap-change", handler as EventListener);
      map.remove();
      mapRef.current = null;
    };
  }, [isAdmin]);

  // Toggle individual PL category visibility
  const toggleCategory = useCallback((key: string) => {
    setVisibleCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Toggle DB layer category visibility
  const toggleDbCategory = useCallback((key: string) => {
    setVisibleDbCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Apply DB category visibility
  useEffect(() => {
    if (!mapRef.current) return;
    categoryLayersRef.current.forEach((layer, cat) => {
      if (visibleDbCategories.has(cat)) {
        if (!mapRef.current?.hasLayer(layer)) layer.addTo(mapRef.current!);
      } else {
        if (mapRef.current?.hasLayer(layer)) mapRef.current?.removeLayer(layer);
      }
    });
  }, [visibleDbCategories]);

  // Apply category visibility to the persillnyan layer
  useEffect(() => {
    if (!persillnyanRef.current) return;
    persillnyanRef.current.eachLayer((layer: any) => {
      const pl = layer.feature?.properties?.PL;
      const key = getPLKey(pl);
      const visible = visibleCategories.has(key);
      if (visible) {
        layer.setStyle({ opacity: 1, fillOpacity: 0.2 });
        if (!mapRef.current?.hasLayer(layer)) layer.addTo(mapRef.current!);
      } else {
        layer.setStyle({ opacity: 0, fillOpacity: 0 });
        if (mapRef.current?.hasLayer(layer)) mapRef.current.removeLayer(layer);
      }
    });
  }, [visibleCategories]);

  const saveLayer = async () => {
    if (!pendingGeoJSON || !drawName.trim()) return;
    const res = await fetch("/api/map-layers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: drawName, type: pendingGeoJSON.geometry.type.toLowerCase(), geojson: pendingGeoJSON.geometry, category: drawCategory || null }),
    });
    if (res.ok) {
      setMessage("Layer berhasil disimpan!");
      setShowSaveDialog(false);
      setDrawName("");
      setDrawCategory("");
      setPendingGeoJSON(null);
      drawnItemsRef.current?.clearLayers();
      loadLayers();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const locateMe = () => {
    if (!mapRef.current || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 17);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const switchBasemap = (key: string) => {
    setBasemap(key);
    localStorage.setItem("basemap", key);
    if (tileRef.current && mapRef.current) {
      mapRef.current.removeLayer(tileRef.current);
      tileRef.current = L.tileLayer(BASEMAPS[key].url).addTo(mapRef.current);
    }
  };

  const mapHeight = isFullscreen ? "h-screen" : "h-[calc(100vh-3.5rem)]";

  return (
    <div className={`relative w-full ${mapHeight}`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ── Top-Left: Legend Panel ── */}
      <div className={`absolute top-4 left-12 z-[1000] bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 overflow-hidden ${showLegend ? "w-56" : "w-10"}`}>
        <div className="flex items-center">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex-1 flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-white/80 hover:text-white transition-colors"
          >
            <i className={`bi ${showLegend ? "bi-chevron-down" : "bi-chevron-up"} text-xs`} />
            {showLegend && <span>Legenda</span>}
          </button>
        </div>
        {showLegend && (
          <div className="px-3 pb-3 space-y-1.5 max-h-[60vh] overflow-y-auto">
            {/* ── DB Layer Toggles ── */}
            {dbCategories.length > 0 && (
              <>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Layer Data</p>
                {dbCategories.map(({ key, label, color }) => (
                  <div key={key} className="flex items-center gap-2 text-xs group">
                    <span className="w-4 h-3 rounded-sm shrink-0 border-2" style={{ borderColor: color, backgroundColor: color + "33" }} />
                    <span className={`flex-1 leading-tight ${visibleDbCategories.has(key) ? "text-white/70" : "text-white/25"}`}>{label}</span>
                    <button
                      onClick={() => toggleDbCategory(key)}
                      className={`text-xs transition-colors ${visibleDbCategories.has(key) ? "text-white/60 hover:text-white" : "text-white/20 hover:text-white/40"}`}
                    >
                      <i className={`bi ${visibleDbCategories.has(key) ? "bi-eye-fill" : "bi-eye-slash-fill"} text-[10px]`} />
                    </button>
                  </div>
                ))}
                <div className="pt-1 mb-1 border-t border-white/10" />
              </>
            )}
            {/* ── PL Sub-Category Toggles ── */}
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Penggunaan Lahan (PL)</p>
            {PL_LEGEND_ENTRIES.map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-2 text-xs group">
                <span className="w-4 h-3 rounded-sm shrink-0 border-2" style={{ borderColor: color, backgroundColor: color + "33" }} />
                <span className={`flex-1 leading-tight ${visibleCategories.has(key) ? "text-white/70" : "text-white/25"}`}>{label}</span>
                <button
                  onClick={() => toggleCategory(key)}
                  className={`text-xs transition-colors ${visibleCategories.has(key) ? "text-white/60 hover:text-white" : "text-white/20 hover:text-white/40"}`}
                >
                  <i className={`bi ${visibleCategories.has(key) ? "bi-eye-fill" : "bi-eye-slash-fill"} text-[10px]`} />
                </button>
              </div>
            ))}
            {/* User-drawn layers (if admin) */}
            {isAdmin && (
              <div className="pt-1.5 mt-1 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: "#3388ff" }} />
                  <span className="flex-1 leading-tight">Layer Gambar (Admin)</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Top-Right: Basemap Pills ── */}
      <div className="absolute top-4 right-16 z-[1000] bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-1 flex gap-0.5 border border-white/10 shadow-2xl">
        {Object.entries(BASEMAPS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => switchBasemap(key)}
            className={`relative px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
              basemap === key
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg scale-[1.02]"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <i className={`bi ${key === "satellite" ? "bi-satellite" : key === "street" ? "bi-map" : "bi-geo-alt"} text-sm`} />
            <span className="hidden sm:inline">{val.label}</span>
          </button>
        ))}
      </div>

      {/* ── Bottom-Left: Info Bar ── */}
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2">
        <div className="bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-xl px-3 py-1.5 text-xs text-white/80 font-mono border border-white/10 shadow-xl pointer-events-none select-none flex items-center gap-2">
          <span className="text-emerald-400">{coords.lat.toFixed(5)}°</span>
          <span className="text-white/40">/</span>
          <span className="text-emerald-400">{coords.lng.toFixed(5)}°</span>
          <span className="w-px h-4 bg-white/20 mx-0.5" />
          <span>Z{coords.zoom}</span>
        </div>
      </div>

      {/* ── Right Control Cluster: Locate + Fullscreen + Zoom ── */}
      <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-1.5">
        {/* Locate */}
        <button
          onClick={locateMe}
          disabled={locating}
          className="w-9 h-9 bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 dark:hover:bg-white/20 border border-white/10 shadow-xl transition-all disabled:opacity-40"
          title="Lokasi saya"
        >
          <i className={`bi ${locating ? "bi-arrow-repeat animate-spin" : "bi-crosshair"} text-sm`} />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="w-9 h-9 bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 dark:hover:bg-white/20 border border-white/10 shadow-xl transition-all"
          title={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
        >
          <i className={`bi ${isFullscreen ? "bi-fullscreen-exit" : "bi-arrows-fullscreen"} text-sm`} />
        </button>

        {/* Zoom in */}
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-9 h-9 bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-t-xl rounded-b-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 dark:hover:bg-white/20 border border-white/10 border-b-white/5 shadow-xl transition-all"
          title="Perbesar"
        >
          <i className="bi bi-plus-lg text-sm" />
        </button>

        {/* Zoom out */}
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-9 h-9 bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-b-xl rounded-t-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 dark:hover:bg-white/20 border border-white/10 shadow-xl transition-all"
          title="Perkecil"
        >
          <i className="bi bi-dash-lg text-sm" />
        </button>
      </div>

      {/* ── Save Dialog ── */}
      {showSaveDialog && (
        <>
          <div className="fixed inset-0 z-[1001] bg-black/20 backdrop-blur-sm" onClick={() => { setShowSaveDialog(false); drawnItemsRef.current?.clearLayers(); }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1002] bg-white dark:bg-gray-900 rounded-2xl p-6 w-80 shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-in">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <i className="bi bi-floppy text-emerald-600 text-sm" />
              </div>
              Simpan Layer
            </h3>
            <input value={drawName} onChange={(e) => setDrawName(e.target.value)} placeholder="Nama layer..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm mb-2 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
            <input value={drawCategory} onChange={(e) => setDrawCategory(e.target.value)} placeholder="Kategori (opsional)" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm mb-4 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
            <div className="flex gap-2">
              <button onClick={() => { setShowSaveDialog(false); drawnItemsRef.current?.clearLayers(); }} className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Batal</button>
              <button onClick={saveLayer} className="flex-1 px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">Simpan</button>
            </div>
          </div>
        </>
      )}

      {/* ── Success Toast ── */}
      {message && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-sm font-medium shadow-xl shadow-emerald-600/30 animate-slide-up flex items-center gap-2">
          <i className="bi bi-check-circle-fill" />
          {message}
        </div>
      )}
    </div>
  );
}
