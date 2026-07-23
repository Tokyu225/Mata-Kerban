"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Stepper, { Step } from "@/components/reactbits/Stepper";

// Fix Leaflet default marker icons in Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const KATEGORI = ["Infrastruktur", "Lingkungan", "Keamanan", "Kesehatan", "Pendidikan", "Sosial", "Lainnya"];

export default function LaporContent() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
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
        if (!mapRef.current) return;
        const { latitude, longitude } = pos.coords;
        mapRef.current.setView([latitude, longitude], 16);
        setCoords({ lat: latitude, lng: longitude });
        setLat(latitude.toFixed(7));
        setLng(longitude.toFixed(7));
        if (markerRef.current) mapRef.current.removeLayer(markerRef.current);
        markerRef.current = L.marker([latitude, longitude]).bindPopup("Lokasi Anda").addTo(mapRef.current).openPopup();
      }, () => {}, { enableHighAccuracy: true });
    }

    fetch("/api/lapors/geojson").then((r) => { if (!r.ok) throw new Error("API error"); return r.json(); }).then((data) => {
      L.geoJSON(data, {
        pointToLayer: (_, latlng) => L.marker(latlng),
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          layer.bindPopup(`<div style="min-width:160px"><strong>${p.judul}</strong>${p.namaPelapor ? `<br><small>${p.namaPelapor}</small>` : ""}${p.kategori ? `<br><span style="font-size:11px;background:#e2e8f0;padding:2px 6px;border-radius:10px">${p.kategori}</span>` : ""}</div>`);
        },
      }).addTo(map);
    }).catch(() => {});

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitReport();
  };

  const submitReport = async () => {
    // Validate before sending
    if (!coords) {
      setMessage({ type: "error", text: "Silakan pilih lokasi di peta terlebih dahulu." });
      return;
    }
    setLoading(true);
    setMessage(null);
    let fotoUrl = null;
    if (foto) {
      const fd = new FormData(); fd.append("file", foto);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await uploadRes.json();
      if (uploadRes.ok) fotoUrl = json.url;
    }
    const body: any = {
      judul: mode === "simpel" ? "Laporan Warga" : (judul || "Laporan Warga"),
      namaPelapor: namaPelapor || null,
      deskripsi: deskripsi || "-",
      kategori: kategori || null,
      foto: fotoUrl,
      lat: coords.lat,
      lng: coords.lng,
    };

    // Grab Turnstile token
    const turnstileInput = document.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]');
    if (turnstileInput?.value) {
      body.turnstileToken = turnstileInput.value;
    }

    const res = await fetch("/api/lapors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      setMessage({ type: "success", text: "Laporan berhasil dikirim!" });
      setNamaPelapor(""); setJudul(""); setDeskripsi(""); setKategori(""); setFoto(null);
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const err = await res.json().catch(() => ({}));
      setMessage({ type: "error", text: err?.error || "Gagal mengirim laporan" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row animate-fade-in">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
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

          {mode === "simpel" ? (
            <Stepper
              backButtonText="Kembali"
              nextButtonText="Lanjut"
              onFinalStepCompleted={submitReport}
              stepContainerClassName="justify-center"
            >
              <Step>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                    <i className="bi bi-geo-alt-fill text-emerald-600 text-xl" />
                  </div>
                  <p className="font-semibold text-[#1a3d2a] dark:text-[#c8e8d0] mb-1">Tentukan Lokasi</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Klik pada peta untuk memilih titik lokasi laporan
                  </p>
                  {coords ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/30">
                      <i className="bi bi-check-circle-fill text-emerald-600 text-2xl block mb-1" />
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Lokasi Terpilih
                      </p>
                      <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-0.5 font-mono">
                        {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/30">
                      <i className="bi bi-hand-index-thumb text-amber-500 text-2xl block mb-1" />
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        Belum Ada Lokasi
                      </p>
                      <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">
                        Silakan klik titik di peta
                      </p>
                    </div>
                  )}
                </div>
              </Step>
              <Step>
                <div>
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                    <i className="bi bi-chat-left-text-fill text-emerald-600 text-xl" />
                  </div>
                  <p className="font-semibold text-[#1a3d2a] dark:text-[#c8e8d0] text-center mb-1">Detail Laporan</p>
                  <p className="text-xs text-muted-foreground text-center mb-4">Isi informasi laporan Anda</p>
                  <textarea
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none text-sm mb-3"
                    placeholder="Jelaskan laporan Anda..."
                  />
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  >
                    <option value="">Pilih kategori</option>
                    {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </Step>
              <Step>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                    <i className="bi bi-send-fill text-emerald-600 text-xl" />
                  </div>
                  <p className="font-semibold text-[#1a3d2a] dark:text-[#c8e8d0] mb-1">Kirim Laporan</p>
                  <input
                    value={namaPelapor}
                    onChange={(e) => setNamaPelapor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500 outline-none text-sm mb-4"
                    placeholder="Nama Anda (opsional)"
                  />
                  <p className="text-xs text-muted-foreground mb-4">
                    {coords ? "Laporan siap dikirim — klik Complete" : "Kembali untuk memilih lokasi di peta"}
                  </p>
                  <div ref={turnstileRef} className="cf-turnstile flex justify-center mb-3" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-action="turnstile-spin-v2" />
                  {loading && (
                    <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 mt-2">
                      <span className="loader-spinner w-4 h-4 border-2" />
                      Mengirim...
                    </div>
                  )}
                </div>
              </Step>
            </Stepper>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Judul *</label><input value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Judul laporan" required /></div>
              <div><label className="block text-sm font-medium mb-1">Nama Pelapor</label><input value={namaPelapor} onChange={(e) => setNamaPelapor(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Nama Anda" /></div>
              <div><label className="block text-sm font-medium mb-1">Deskripsi *</label><textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Jelaskan laporan Anda..." required /></div>
              <div><label className="block text-sm font-medium mb-1">Kategori</label><select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none"><option value="">Pilih kategori</option>{KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1">Foto</label><input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files?.[0] || null)} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-600 dark:file:text-primary-400" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1">Latitude</label><input value={lat} onChange={(e) => setLat(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Klik peta" required /></div>
                <div><label className="block text-sm font-medium mb-1">Longitude</label><input value={lng} onChange={(e) => setLng(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Klik peta" required /></div>
              </div>
              <div ref={turnstileRef} className="cf-turnstile flex justify-center my-2" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-action="turnstile-spin-v2" />
              <button type="submit" disabled={loading || !coords} className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <span className="flex items-center justify-center gap-2"><span className="loader-spinner w-4 h-4 border-2" />Mengirim...</span> : <><i className="bi bi-send mr-2" />Kirim Laporan</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
