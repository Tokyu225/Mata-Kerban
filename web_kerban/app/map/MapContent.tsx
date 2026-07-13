"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const BASEMAPS: Record<string, { url: string; label: string }> = {
  satellite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", label: "Satelit" },
  street: { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", label: "Jalan" },
  topo: { url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", label: "Topografi" },
};

export default function MapContent() {
  const { data: session } = useSession();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);

  const [basemap, setBasemap] = useState("satellite");
  const [drawName, setDrawName] = useState("");
  const [drawCategory, setDrawCategory] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingGeoJSON, setPendingGeoJSON] = useState<any>(null);
  const [message, setMessage] = useState("");

  const isAdmin = (session?.user as any)?.role === "endministrator";

  const loadLayers = useCallback(async () => {
    if (!mapRef.current) return;
    const res = await fetch("/api/map-layers/geojson");
    const data = await res.json();
    if (layerRef.current) mapRef.current.removeLayer(layerRef.current);
    layerRef.current = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        layer.bindPopup(`<div style="min-width:180px"><strong>${props.name}</strong>${props.category ? `<br><small>${props.category}</small>` : ""}</div>`);
      },
    }).addTo(mapRef.current);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const savedBasemap = localStorage.getItem("basemap") || "satellite";
    setBasemap(savedBasemap);

    const map = L.map(mapContainerRef.current, { center: [-7.5, 110.5], zoom: 15, zoomControl: false });
    tileRef.current = L.tileLayer(BASEMAPS[savedBasemap].url, { attribution: "&copy; contributors", maxZoom: 19 }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

    if (isAdmin) {
      import("leaflet-draw").then(() => {
        const L_Draw = (window as any).L.Draw;
        if (L_Draw && mapRef.current) {
          const m = mapRef.current;
          drawnItemsRef.current = new L.FeatureGroup();
          m.addLayer(drawnItemsRef.current);
          const drawControl = new L_Draw.Control({
            position: "topright",
            draw: { polygon: true, polyline: true, rectangle: true, circle: false, marker: true, circlemarker: false },
            edit: { featureGroup: drawnItemsRef.current },
          });
          m.addControl(drawControl);
          m.on(L_Draw.Event.CREATED, (e: any) => {
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

  return (
    <div className="relative w-full h-[calc(100vh-5rem)]">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 z-[1000] flex gap-1.5 sm:hidden">
        {Object.entries(BASEMAPS).map(([key, val]) => (
          <button key={key} onClick={() => window.dispatchEvent(new CustomEvent("basemap-change", { detail: key }))} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${basemap === key ? "bg-primary-600 text-white shadow-md" : "glass text-foreground/70"}`}>
            {val.label}
          </button>
        ))}
      </div>
      {showSaveDialog && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] glass-card p-4 w-80 animate-slide-up">
          <h3 className="font-semibold text-sm mb-3">Simpan Layer</h3>
          <input value={drawName} onChange={(e) => setDrawName(e.target.value)} placeholder="Nama layer..." className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm mb-2 outline-none focus:ring-2 focus:ring-primary-500" />
          <input value={drawCategory} onChange={(e) => setDrawCategory(e.target.value)} placeholder="Kategori (opsional)" className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm mb-3 outline-none focus:ring-2 focus:ring-primary-500" />
          <div className="flex gap-2">
            <button onClick={() => { setShowSaveDialog(false); drawnItemsRef.current?.clearLayers(); }} className="flex-1 px-3 py-2 rounded-xl border border-border text-sm hover:bg-muted">Batal</button>
            <button onClick={saveLayer} className="flex-1 btn-primary text-sm">Simpan</button>
          </div>
        </div>
      )}
      {message && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] glass-card px-5 py-3 text-sm font-medium text-green-600 dark:text-green-400 animate-slide-up">
          <i className="bi bi-check-circle mr-2" />{message}
        </div>
      )}
    </div>
  );
}
