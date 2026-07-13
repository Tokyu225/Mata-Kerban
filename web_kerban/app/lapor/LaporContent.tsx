"use client";

import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const KATEGORI = ["Infrastruktur", "Lingkungan", "Keamanan", "Kesehatan", "Pendidikan", "Sosial", "Lainnya"];

export default function LaporContent() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mode, setMode] = useState<"simpel" | "lengkap">("simpel");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [namaPelapor, setNamaPelapor] = useState("");
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategori, setKategori] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, { center: [-7.5, 110.5], zoom: 15, zoomControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat: latVal, lng: lngVal } = e.latlng;
      setCoords({ lat: latVal, lng: lngVal });
      setLat(latVal.toFixed(7));
      setLng(lngVal.toFixed(7));
      if (markerRef.current) map.removeLayer(markerRef.current);
      markerRef.current = L.marker([latVal, lngVal]).bindPopup("Lokasi laporan").addTo(map).openPopup();
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 16);
        setCoords({ lat: latitude, lng: longitude });
        setLat(latitude.toFixed(7));
        setLng(longitude.toFixed(7));
        if (markerRef.current) map.removeLayer(markerRef.current);
        markerRef.current = L.marker([latitude, longitude]).bindPopup("Lokasi Anda").addTo(map).openPopup();
      }, () => {}, { enableHighAccuracy: true });
    }

    fetch("/api/lapors/geojson").then((r) => r.json()).then((data) => {
      L.geoJSON(data, {
        pointToLayer: (_, latlng) => L.marker(latlng),
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          layer.bindPopup(`<div style="min-width:160px"><strong>${p.judul}</strong>${p.namaPelapor ? `<br><small>${p.namaPelapor}</small>` : ""}${p.kategori ? `<br><span style="font-size:11px;background:#e2e8f0;padding:2px 6px;border-radius:10px">${p.kategori}</span>` : ""}</div>`);
        },
      }).addTo(map);
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    let fotoUrl = null;
    if (foto) {
      const fd = new FormData(); fd.append("file", foto);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await uploadRes.json();
      if (uploadRes.ok) fotoUrl = json.url;
    }
    const body: any = { judul, namaPelapor: namaPelapor || null, deskripsi, kategori: kategori || null, foto: fotoUrl, lat: parseFloat(lat), lng: parseFloat(lng) };
    if (mode === "simpel") { body.judul = "Laporan Warga"; body.lat = coords?.lat || parseFloat(lat); body.lng = coords?.lng || parseFloat(lng); }
    const res = await fetch("/api/lapors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      setMessage({ type: "success", text: "Laporan berhasil dikirim!" });
      setNamaPelapor(""); setJudul(""); setDeskripsi(""); setKategori(""); setFoto(null);
      setTimeout(() => window.location.reload(), 1500);
    } else { setMessage({ type: "error", text: "Gagal mengirim laporan" }); }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row animate-fade-in">
      <div className="lg:w-3/5 h-[40vh] lg:h-[calc(100vh-5rem)] lg:sticky lg:top-20">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
      <div className="lg:w-2/5 p-6 overflow-y-auto">
        <div className="glass-card p-6 max-w-lg">
          <h1 className="text-2xl font-bold mb-1">Lapor Warga</h1>
          <p className="text-sm text-muted-foreground mb-6">Sampaikan laporan Anda tentang kondisi di Dusun Kerban</p>
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
            <button onClick={() => setMode("simpel")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "simpel" ? "bg-background shadow-sm" : "text-muted-foreground"}`}><i className="bi bi-lightning mr-1.5" />Simpel</button>
            <button onClick={() => setMode("lengkap")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === "lengkap" ? "bg-background shadow-sm" : "text-muted-foreground"}`}><i className="bi bi-list-ul mr-1.5" />Lengkap</button>
          </div>
          {message && <div className={`text-sm rounded-xl p-3 mb-4 ${message.type === "success" ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-600" : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600"}`}>{message.text}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "simpel" ? (
              <>
                <div><label className="block text-sm font-medium mb-1">Nama (opsional)</label><input value={namaPelapor} onChange={(e) => setNamaPelapor(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Nama Anda" /></div>
                <div><label className="block text-sm font-medium mb-1">Deskripsi Laporan *</label><textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Jelaskan laporan Anda..." required /></div>
                <p className="text-xs text-muted-foreground"><i className="bi bi-geo-alt mr-1" />Klik pada peta untuk menentukan lokasi, atau gunakan lokasi Anda saat ini.</p>
              </>
            ) : (
              <>
                <div><label className="block text-sm font-medium mb-1">Judul *</label><input value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Judul laporan" required /></div>
                <div><label className="block text-sm font-medium mb-1">Nama Pelapor</label><input value={namaPelapor} onChange={(e) => setNamaPelapor(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Nama Anda" /></div>
                <div><label className="block text-sm font-medium mb-1">Deskripsi *</label><textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Jelaskan laporan Anda..." required /></div>
                <div><label className="block text-sm font-medium mb-1">Kategori</label><select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none"><option value="">Pilih kategori</option>{KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Foto</label><input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-600 dark:file:text-primary-400" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">Latitude</label><input value={lat} onChange={(e) => setLat(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Klik peta" required /></div>
                  <div><label className="block text-sm font-medium mb-1">Longitude</label><input value={lng} onChange={(e) => setLng(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Klik peta" required /></div>
                </div>
              </>
            )}
            <button type="submit" disabled={loading || !coords} className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <span className="flex items-center justify-center gap-2"><span className="loader-spinner w-4 h-4 border-2" />Mengirim...</span> : <><i className="bi bi-send mr-2" />Kirim Laporan</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
