"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import L from "leaflet";
import { renderPopupNode } from "@/components/MapPopup";
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

// ═══════════════════════════════════════════════════════════
// Symbology: PL (Penggunaan Lahan) — polygon fill
// ═══════════════════════════════════════════════════════════
const PL_LABELS: Record<string, string> = {
  "1":  "Bangunan Gedung",
  "2":  "Tempat Tinggal",
  "3":  "Pekarangan",
  "4":  "Perkantoran",
  "5":  "Pendidikan",
  "6":  "Perdagangan dan Jasa",
  "7":  "Industri dan Pergudangan",
  "8":  "Peribadatan",
  "9":  "Kesehatan",
  "10": "Olahraga",
  "11": "Sosial Budaya",
  "12": "Tempat menarik/Pariwisata",
  "13": "Telekomunikasi",
  "14": "Energi",
  "15": "Pertahanan dan Keamanan",
  "16": "Pemakaman",
  "17": "Transportasi",
  "18": "Perikanan air tawar",
  "19": "Peternakan",
  "20": "Hutan",
  "21": "Hutan Rimba",
  "22": "Hutan Rakyat",
  "23": "Perkebunan",
  "24": "Sawah",
  "25": "Sawah Tadah Hujan",
  "26": "Tegalan/Ladang",
  "27": "Kebun Campur",
  "28": "Rumput",
  "29": "Semak Belukar",
  "30": "Hutan Rawa/Bakau",
  "31": "Tambak",
  "32": "Vegetasi Non Budidaya Lainnya",
  "33": "Pasir Pasut",
  "34": "Lahan Terbuka (Tanah Kosong)",
};
const PL_COLORS: Record<string, string> = {
  "1":  "#49b87d",
  "2":  "#6d49b8",
  "3":  "#b87049",
  "4":  "#4952b8",
  "5":  "#b8497f",
  "6":  "#8ab849",
  "7":  "#b86f49",
  "8":  "#49b8ac",
  "9":  "#9449b8",
  "10": "#b849ac",
  "11": "#b85d49",
  "12": "#4977b8",
  "13": "#b3b849",
  "14": "#49b851",
  "15": "#b8499a",
  "16": "#4b49b8",
  "17": "#b89b49",
  "18": "#49a4b8",
  "19": "#b84978",
  "20": "#75b849",
  "21": "#b149b8",
  "22": "#b89149",
  "23": "#49b88a",
  "24": "#b8495a",
  "25": "#7e49b8",
  "26": "#acb849",
  "27": "#58b849",
  "28": "#49b8ae",
  "29": "#4981b8",
  "30": "#b84959",
  "31": "#494fb8",
  "32": "#49b858",
  "33": "#b84993",
  "34": "#8b49b8",
};
const PL_UNKNOWN_KEY = "__pl_unknown__";
const PL_UNKNOWN_COLOR = "#828282";
const PL_UNKNOWN_LABEL = "Tidak diketahui";

function getPLColor(pl: string | null): string {
  if (!pl) return PL_UNKNOWN_COLOR;
  return PL_COLORS[pl] || PL_UNKNOWN_COLOR;
}
function getPLLabel(pl: string | null): string {
  if (!pl) return PL_UNKNOWN_LABEL;
  return PL_LABELS[pl] || PL_UNKNOWN_LABEL;
}

const PL_LEGEND_ENTRIES: { key: string; label: string; color: string }[] = [
  { key: "1",  label: "Bangunan Gedung",               color: PL_COLORS["1"]  },
  { key: "2",  label: "Tempat Tinggal",                 color: PL_COLORS["2"]  },
  { key: "3",  label: "Pekarangan",                     color: PL_COLORS["3"]  },
  { key: "4",  label: "Perkantoran",                    color: PL_COLORS["4"]  },
  { key: "5",  label: "Pendidikan",                     color: PL_COLORS["5"]  },
  { key: "6",  label: "Perdagangan dan Jasa",           color: PL_COLORS["6"]  },
  { key: "7",  label: "Industri dan Pergudangan",       color: PL_COLORS["7"]  },
  { key: "8",  label: "Peribadatan",                    color: PL_COLORS["8"]  },
  { key: "9",  label: "Kesehatan",                      color: PL_COLORS["9"]  },
  { key: "10", label: "Olahraga",                       color: PL_COLORS["10"] },
  { key: "11", label: "Sosial Budaya",                  color: PL_COLORS["11"] },
  { key: "12", label: "Tempat menarik/Pariwisata",      color: PL_COLORS["12"] },
  { key: "13", label: "Telekomunikasi",                 color: PL_COLORS["13"] },
  { key: "14", label: "Energi",                         color: PL_COLORS["14"] },
  { key: "15", label: "Pertahanan dan Keamanan",        color: PL_COLORS["15"] },
  { key: "16", label: "Pemakaman",                      color: PL_COLORS["16"] },
  { key: "17", label: "Transportasi",                   color: PL_COLORS["17"] },
  { key: "18", label: "Perikanan air tawar",            color: PL_COLORS["18"] },
  { key: "19", label: "Peternakan",                     color: PL_COLORS["19"] },
  { key: "20", label: "Hutan",                          color: PL_COLORS["20"] },
  { key: "21", label: "Hutan Rimba",                    color: PL_COLORS["21"] },
  { key: "22", label: "Hutan Rakyat",                   color: PL_COLORS["22"] },
  { key: "23", label: "Perkebunan",                     color: PL_COLORS["23"] },
  { key: "24", label: "Sawah",                          color: PL_COLORS["24"] },
  { key: "25", label: "Sawah Tadah Hujan",              color: PL_COLORS["25"] },
  { key: "26", label: "Tegalan/Ladang",                 color: PL_COLORS["26"] },
  { key: "27", label: "Kebun Campur",                   color: PL_COLORS["27"] },
  { key: "28", label: "Rumput",                         color: PL_COLORS["28"] },
  { key: "29", label: "Semak Belukar",                  color: PL_COLORS["29"] },
  { key: "30", label: "Hutan Rawa/Bakau",               color: PL_COLORS["30"] },
  { key: "31", label: "Tambak",                         color: PL_COLORS["31"] },
  { key: "32", label: "Vegetasi Non Budidaya Lainnya",  color: PL_COLORS["32"] },
  { key: "33", label: "Pasir Pasut",                    color: PL_COLORS["33"] },
  { key: "34", label: "Lahan Terbuka (Tanah Kosong)",  color: PL_COLORS["34"] },
  { key: PL_UNKNOWN_KEY, label: PL_UNKNOWN_LABEL, color: PL_UNKNOWN_COLOR },
];

// ═══════════════════════════════════════════════════════════
// Symbology: Tematik layers (shared constants)
// ═══════════════════════════════════════════════════════════
const TEMATIK_LAYERS = [
  { key: "batas_rt",       label: "Batas RT & Perubahan Penduduk",  color: "#3b82f6" },
  { key: "kpdt_hunian",    label: "Kepadatan & Kelayakan Hunian",   color: "#10b981" },
  { key: "batu_bata",      label: "Persebaran Batu Bata",           color: "#f97316" },
  { key: "persil_rt",      label: "Persil & Rumah RT",             color: "#14b8a6" },
];
const BATAS_RT_COLORS: Record<string, string> = { "1": "#3b82f6", "2": "#f59e0b", "3": "#ef4444" };
const KELAYAKAN_COLORS: Record<string, string> = { "Layak": "#10b981", "Tidak Layak": "#ef4444" };
const KELAYAKAN_LABELS: Record<string, string> = { "Layak": "Layak", "Tidak Layak": "Tidak Layak" };
const TEMATIK_PERSIL_COLORS: Record<string, string> = { "1": "#14b8a6", "2": "#f97316" };
const TEMATIK_PERSIL_LABELS: Record<string, string> = { "1": "Gedung", "2": "Tempat Tinggal" };

// ═══════════════════════════════════════════════════════════
// Symbology: Persil (KETERANGAN) — building footprint fill
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
const PERSIL_LABELS: Record<string, string> = {
  "1": "Gedung",
  "2": "Tempat Tinggal",
};
const PERSIL_COLORS: Record<string, string> = {
  "1": "#14b8a6",
  "2": "#f97316",
};
const PERSIL_UNKNOWN_KEY = "__persil_unknown__";
const PERSIL_UNKNOWN_COLOR = "#94a3b8";
const PERSIL_UNKNOWN_LABEL = "Tidak diketahui";

function getPersilColor(ket: string | null): string {
  if (!ket || ket.trim() === "") return PERSIL_UNKNOWN_COLOR;
  return PERSIL_COLORS[ket] || PERSIL_UNKNOWN_COLOR;
}
function getPersilLabel(ket: string | null): string {
  if (!ket || ket.trim() === "") return PERSIL_UNKNOWN_LABEL;
  return PERSIL_LABELS[ket] || PERSIL_UNKNOWN_LABEL;
}

const PERSIL_LEGEND_ENTRIES: { key: string; label: string; color: string }[] = [
  { key: "1", label: "Gedung",  color: PERSIL_COLORS["1"] },
  { key: "2", label: "Tempat Tinggal",  color: PERSIL_COLORS["2"] },
  { key: PERSIL_UNKNOWN_KEY, label: PERSIL_UNKNOWN_LABEL, color: PERSIL_UNKNOWN_COLOR },
];

// ═══════════════════════════════════════════════════════════
// Symbology: Sarana Prasarana (Kelas) — point markers
// ═══════════════════════════════════════════════════════════
const SARPRAS_LABELS: Record<string, string> = {
  "1":  "Industri / Pabrik",
  "3":  "Perdagangan / Jasa",
  "22": "SD / Sekolah Dasar",
  "23": "SMP / Sederajat",
  "24": "TK / PAUD",
  "25": "TPA / Pendidikan Agama",
  "27": "Perpustakaan",
  "33": "Makam / Pemakaman",
  "39": "Masjid / Tempat Ibadah",
};
const SARPRAS_COLORS: Record<string, string> = {
  "1":  "#ef4444",
  "3":  "#f59e0b",
  "22": "#3b82f6",
  "23": "#2563eb",
  "24": "#60a5fa",
  "25": "#14b8a6",
  "27": "#8b5cf6",
  "33": "#6b7280",
  "39": "#10b981",
};
const SARPRAS_ICONS: Record<string, string> = {
  "1":  "bi-building",
  "3":  "bi-shop",
  "22": "bi-book",
  "23": "bi-book",
  "24": "bi-puzzle",
  "25": "bi-book",
  "27": "bi-book",
  "33": "bi-flag",
  "39": "bi-building",
};
const SARPRAS_UNKNOWN_KEY = "__sarpras_unknown__";
const SARPRAS_UNKNOWN_COLOR = "#94a3b8";
const SARPRAS_UNKNOWN_LABEL = "Lainnya";

function getSarprasColor(kelas: string | null): string {
  if (!kelas) return SARPRAS_UNKNOWN_COLOR;
  return SARPRAS_COLORS[kelas] || SARPRAS_UNKNOWN_COLOR;
}
function getSarprasLabel(kelas: string | null): string {
  if (!kelas) return SARPRAS_UNKNOWN_LABEL;
  return SARPRAS_LABELS[kelas] || SARPRAS_UNKNOWN_LABEL;
}
function getSarprasIcon(kelas: string | null): string {
  if (!kelas) return "bi-geo-alt";
  return SARPRAS_ICONS[kelas] || "bi-geo-alt";
}

const SARPRAS_LEGEND_ENTRIES: { key: string; label: string; color: string }[] = [
  { key: "1",  label: "Industri / Pabrik",         color: SARPRAS_COLORS["1"]  },
  { key: "3",  label: "Perdagangan / Jasa",         color: SARPRAS_COLORS["3"]  },
  { key: "22", label: "SD / Sekolah Dasar",         color: SARPRAS_COLORS["22"] },
  { key: "23", label: "SMP / Sederajat",            color: SARPRAS_COLORS["23"] },
  { key: "24", label: "TK / PAUD",                  color: SARPRAS_COLORS["24"] },
  { key: "25", label: "TPA / Pend. Agama",          color: SARPRAS_COLORS["25"] },
  { key: "27", label: "Perpustakaan",               color: SARPRAS_COLORS["27"] },
  { key: "33", label: "Makam / Pemakaman",           color: SARPRAS_COLORS["33"] },
  { key: "39", label: "Masjid / Tempat Ibadah",     color: SARPRAS_COLORS["39"] },
  { key: SARPRAS_UNKNOWN_KEY, label: SARPRAS_UNKNOWN_LABEL, color: SARPRAS_UNKNOWN_COLOR },
];

// ── HTML helpers ──
function esc(s: string | null | undefined): string {
  if (!s) return "-";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function row(label: string, value: string | null | undefined): string {
  return `<tr><td style="padding:2px 6px 2px 0;color:#666">${label}</td><td style="padding:2px 0">${esc(value)}</td></tr>`;
}
function buildAdminStr(p: any): string {
  return [p.WADMPR, p.WADMKK, p.WADMKC, p.WADMKD].filter(Boolean).join(" → ") || "-";
}

/** Bind a tooltip that only appears after hovering for `delay` ms (default 5s) */
function bindDelayedTooltip(layer: L.Layer, html: string, delay = 1500) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  layer.on("mouseover", () => {
    timer = setTimeout(() => {
      layer.bindTooltip(html, {
        direction: "top",
        offset: [0, -8],
        opacity: 0.92,
        className: "map-tooltip",
      });
      layer.openTooltip();
    }, delay);
  });
  layer.on("mouseout", () => {
    if (timer) { clearTimeout(timer); timer = null; }
    layer.unbindTooltip();
  });
}

export default function MapContent() {
  const { data: session } = useSession();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // refs for static GeoJSON layers
  const plLayerRef = useRef<L.GeoJSON | null>(null);
  const persilLayerRef = useRef<L.GeoJSON | null>(null);
  const sarprasGroupRef = useRef<L.FeatureGroup | null>(null);

  // refs for thematic layers
  const tematikBatasRtRef = useRef<L.GeoJSON | null>(null);
  const tematikKpdtRef = useRef<L.GeoJSON | null>(null);
  const tematikBataRef = useRef<L.GeoJSON | null>(null);
  const tematikPersilRtRef = useRef<L.GeoJSON | null>(null);

  // refs for DB layers
  const categoryLayersRef = useRef<Map<string, L.GeoJSON>>(new Map());
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["db", "pl", "persil", "sarpras", "tematik"]));

  // visibility state per symbology group
  const [visPL, setVisPL] = useState<Set<string>>(() => new Set(PL_LEGEND_ENTRIES.map(e => e.key)));
  const [visPersil, setVisPersil] = useState<Set<string>>(() => new Set(PERSIL_LEGEND_ENTRIES.map(e => e.key)));
  const [visSarpras, setVisSarpras] = useState<Set<string>>(() => new Set(SARPRAS_LEGEND_ENTRIES.map(e => e.key)));
  const [visTematik, setVisTematik] = useState<Set<string>>(new Set());
  const [visDb, setVisDb] = useState<Set<string>>(new Set());
  const [dbCategories, setDbCategories] = useState<{ key: string; label: string; color: string; count: number }[]>([]);

  // section master toggles — true = section is ON (tematik defaults OFF)
  const [sectionOn, setSectionOn] = useState<Record<string, boolean>>({ db: true, pl: true, persil: true, sarpras: true, tematik: false });

  const allPlKeys = PL_LEGEND_ENTRIES.map(e => e.key);
  const allPersilKeys = PERSIL_LEGEND_ENTRIES.map(e => e.key);
  const allSarprasKeys = SARPRAS_LEGEND_ENTRIES.map(e => e.key);

  const isAdmin = (session?.user as any)?.role === "endministrator";

  const CATEGORY_LABELS: Record<string, string> = {
    toponim: "Toponim",
    sarana: "Sarana Prasarana",
    perairan: "Perairan",
    transportasi: "Transportasi",
    penggunaan_lahan: "Penggunaan Lahan",
    persil: "Persil",
  };

  // ═══════════════════════════════════════════════
  // Load DB layers
  // ═══════════════════════════════════════════════
  const loadDbLayers = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/api/map-layers/geojson");
      if (!res.ok) return;
      const data = await res.json();

      categoryLayersRef.current.forEach(l => mapRef.current?.removeLayer(l));
      categoryLayersRef.current.clear();

      const grouped: Record<string, any[]> = {};
      data.features.forEach((f: any) => {
        const cat = f.properties?.category || "lainnya";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(f);
      });

      const catList: { key: string; label: string; color: string; count: number }[] = [];
      const defaultColor = "#3388ff";

      // Categories that have their own dedicated sections — skip from Layer Data
      const skipCategories = new Set(["persil", "penggunaan_lahan", "sarana"]);

      Object.entries(grouped).forEach(([cat, features]) => {
        if (skipCategories.has(cat)) return;
        const firstSym = features[0]?.properties?.symbology || {};
        const color = firstSym.color || firstSym.fillColor || defaultColor;

        const geoJsonLayer = L.geoJSON(
          { type: "FeatureCollection", features } as any,
          {
            style: (feature) => {
              const s = feature?.properties?.symbology || {};
              const isPoly = feature?.geometry?.type?.startsWith("Polygon") || feature?.geometry?.type?.startsWith("MultiPolygon");
              const isLine = feature?.geometry?.type?.startsWith("LineString") || feature?.geometry?.type?.startsWith("MultiLineString");
              return {
                color: s.color || defaultColor,
                fillColor: isPoly ? (s.fillColor || s.color || defaultColor) : undefined,
                fillOpacity: isPoly ? (s.fillOpacity ?? 0.3) : undefined,
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
              const cat2 = p.category;
              const admin = buildAdminStr(p);
              const bodyRows: { label: string; value: string; highlight?: boolean }[] = [];
              if (cat2 === "persil" || cat2 === "penggunaan_lahan") {
                bodyRows.push({ label: "Guna Lahan", value: p.KET_DETAIL || p.KETERANGAN || "-", highlight: true });
                if (p.DUSUN) bodyRows.push({ label: "Dusun", value: p.DUSUN });
                bodyRows.push({ label: "Wilayah", value: admin });
                if (p.Id)    bodyRows.push({ label: "ID Persil", value: p.Id });
              } else if (cat2 === "sarana") {
                if (p.Sub_Unsur) bodyRows.push({ label: "Sub Unsur", value: p.Sub_Unsur });
                if (p.Kelas)     bodyRows.push({ label: "Kelas", value: p.Kelas });
              } else if (cat2 === "transportasi" || cat2 === "perairan") {
                if (p.Sub_Unsur) bodyRows.push({ label: "Sub Unsur", value: p.Sub_Unsur });
                if (p.Kelas)     bodyRows.push({ label: "Kelas", value: p.Kelas });
              } else if (cat2 === "toponim") {
                if (p.KETERANGAN) bodyRows.push({ label: "Keterangan", value: p.KETERANGAN });
              }
              bodyRows.push({ label: "Sumber", value: p.source_layer || "-" });
              const popupEl = renderPopupNode({
                title,
                subtitle: CATEGORY_LABELS[cat2] || cat2,
                rows: bodyRows,
              });
              layer.bindPopup(popupEl);
              // Delayed hover tooltip (5s)
              const tooltipLines = bodyRows.slice(0, 2).map(r => `<span style="color:#9ab89e">${r.label}:</span> <span style="color:#c8e8d0;font-weight:500">${r.value}</span>`).join("<br>");
              bindDelayedTooltip(layer, `<div style="font-size:12px;line-height:1.5;text-align:left"><strong style="color:#c8e8d0;font-size:13px">${title}</strong>${tooltipLines ? `<br>${tooltipLines}` : ""}</div>`);
            },
          }
        );
        geoJsonLayer.addTo(mapRef.current!);
        categoryLayersRef.current.set(cat, geoJsonLayer);
        catList.push({ key: cat, label: CATEGORY_LABELS[cat] || cat, color, count: features.length });
      });

      setDbCategories(catList);
      setVisDb(new Set(catList.map(c => c.key)));
    } catch { /* ignore */ }
  }, []);

  // ═══════════════════════════════════════════════
  // Load PL (Penggunaan Lahan)
  // ═══════════════════════════════════════════════
  const loadPL = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/data/pl_persil.geojson");
      if (!res.ok) return;
      const data = await res.json();
      if (plLayerRef.current) mapRef.current.removeLayer(plLayerRef.current);
      plLayerRef.current = L.geoJSON(data, {
        style: (feature) => {
          const color = getPLColor(feature?.properties?.PL);
          return { color, weight: 2, opacity: 1, fillColor: color, fillOpacity: 0.4 };
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          const plLabel = getPLLabel(p.PL);
          const guna = p.KET_DETAIL?.trim() || p.KETERANGAN?.trim() || plLabel;
          const plColor = getPLColor(p.PL);
          const popupEl = renderPopupNode({
            title: p.Toponimi || p.NAMOBJ || "(tanpa nama)",
            subtitle: "Penggunaan Lahan",
            color: plColor,
            rows: [
              { label: "Guna Lahan", value: guna, highlight: true },
              { label: "Kode PL", value: p.PL },
              { label: "Dusun", value: p.DUSUN },
              { label: "Desa", value: p.WADMKD },
              { label: "Kecamatan", value: p.WADMKC },
              { label: "Kabupaten", value: p.WADMKK },
              { label: "Provinsi", value: p.WADMPR },
            ].filter(r => r.value != null),
          });
          layer.bindPopup(popupEl);
          bindDelayedTooltip(layer, `<div style="font-size:12px;line-height:1.5"><strong style="color:#c8e8d0">${p.Toponimi || p.NAMOBJ || "(tanpa nama)"}</strong><br><span style="color:#9ab89e">Guna Lahan:</span> <span style="color:#c8e8d0;font-weight:500">${guna}</span></div>`);
        },
      }).addTo(mapRef.current);
      try {
        const b = plLayerRef.current.getBounds();
        if (b.isValid()) mapRef.current.fitBounds(b, { padding: [40, 40], maxZoom: 17 });
      } catch { /* ignore */ }
    } catch { /* ignore */ }
  }, []);

  // ═══════════════════════════════════════════════
  // Load Persil (building footprints)
  // ═══════════════════════════════════════════════
  const loadPersil = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/data/persil_kerban.geojson");
      if (!res.ok) return;
      const data = await res.json();
      if (persilLayerRef.current) mapRef.current.removeLayer(persilLayerRef.current);
      persilLayerRef.current = L.geoJSON(data, {
        style: (feature) => {
          const color = getPersilColor(feature?.properties?.KETERANGAN);
          return { color, weight: 1.5, opacity: 0.9, fillColor: color, fillOpacity: 0.5 };
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          const ketLabel = getPersilLabel(p.KETERANGAN);
          const detail = p.KET_DETAIL?.trim() || ketLabel;
          const persilColor = getPersilColor(p.KETERANGAN);
          const popupEl = renderPopupNode({
            title: p.Toponimi || p.NAMOBJ || "(tanpa nama)",
            subtitle: "Persil",
            color: persilColor,
            rows: [
              { label: "Jenis", value: detail, highlight: true },
              { label: "ID", value: p.Id },
              { label: "RT", value: p.rumah_rt },
              { label: "Dusun", value: p.DUSUN },
              { label: "Desa", value: p.WADMKD },
            ].filter(r => r.value != null),
          });
          layer.bindPopup(popupEl);
          bindDelayedTooltip(layer, `<div style="font-size:12px;line-height:1.5"><strong style="color:#c8e8d0">${p.Toponimi || p.NAMOBJ || "(tanpa nama)"}</strong><br><span style="color:#9ab89e">Jenis:</span> <span style="color:#c8e8d0;font-weight:500">${detail}</span></div>`);
        },
      }).addTo(mapRef.current);
    } catch { /* ignore */ }
  }, []);

  // ═══════════════════════════════════════════════
  // Load Sarana Prasarana (point markers)
  // ═══════════════════════════════════════════════
  const loadSarpras = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/data/sarpras.geojson");
      if (!res.ok) return;
      const data = await res.json();
      if (sarprasGroupRef.current) mapRef.current.removeLayer(sarprasGroupRef.current);

      const group = L.featureGroup();
      data.features.forEach((f: any) => {
        const p = f.properties;
        const color = getSarprasColor(p.Kelas);
        const iconHtml = `<div style="background:${color};width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"><i class="bi ${getSarprasIcon(p.Kelas)}"></i></div>`;
        const icon = L.divIcon({ html: iconHtml, className: "", iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -14] });
        const marker = L.marker([f.geometry.coordinates[1], f.geometry.coordinates[0]], { icon });
        (marker as any)._sarprasKelas = p.Kelas; // stash for visibility toggling
        const kelasLabel = getSarprasLabel(p.Kelas);
        const popupEl = renderPopupNode({
          title: p.TOPONIM || "(tanpa nama)",
          subtitle: "Sarana Prasarana",
          color,
          rows: [
            { label: "Kelas", value: kelasLabel, highlight: true },
            { label: "Kode Kelas", value: p.Kelas },
            { label: "Sub Unsur", value: p.Sub_Unsur },
          ].filter(r => r.value != null),
        });
        marker.bindPopup(popupEl);
        bindDelayedTooltip(marker, `<div style="font-size:12px;line-height:1.5"><strong style="color:#c8e8d0">${p.TOPONIM || "(tanpa nama)"}</strong><br><span style="color:#9ab89e">Kelas:</span> <span style="color:#c8e8d0;font-weight:500">${kelasLabel}</span></div>`);
        group.addLayer(marker);
      });

      group.addTo(mapRef.current);
      sarprasGroupRef.current = group;
    } catch { /* ignore */ }
  }, []);

  // ═══════════════════════════════════════════════
  // Load Tematik layers
  // ═══════════════════════════════════════════════
  const loadTematikBatasRt = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/data/tematik/batasrt_perubahan_pddk.geojson");
      if (!res.ok) return;
      const data = await res.json();
      if (tematikBatasRtRef.current) mapRef.current.removeLayer(tematikBatasRtRef.current);
      tematikBatasRtRef.current = L.geoJSON(data, {
        style: (feature) => {
          const rt = String(feature?.properties?.rt || "");
          const color = BATAS_RT_COLORS[rt] || "#94a3b8";
          return { color, weight: 3, opacity: 0.9, fillColor: color, fillOpacity: 0.15, dashArray: "8 4" };
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          const rtColor = BATAS_RT_COLORS[String(p.rt || "")] || "#94a3b8";
          const popupEl = renderPopupNode({
            title: `RT ${p.rt || "-"}`,
            subtitle: "Batas RT",
            color: rtColor,
            rows: [
              { label: "Penduduk 2025", value: p.F2025 },
              { label: "Penduduk 2026", value: p.F2026 },
              { label: "Perubahan", value: p.perubahan, highlight: true },
              { label: "Dusun", value: p.DUSUN },
              { label: "Desa", value: p.WADMKD },
              { label: "Kecamatan", value: p.WADMKC },
            ].filter(r => r.value != null),
          });
          layer.bindPopup(popupEl);
          bindDelayedTooltip(layer, `<div style="font-size:12px;line-height:1.5"><strong style="color:#c8e8d0">RT ${p.rt || "-"}</strong><br><span style="color:#9ab89e">Penduduk:</span> <span style="color:#c8e8d0;font-weight:500">${p.F2026 || "-"}</span></div>`);
        },
      });
    } catch { /* ignore */ }
  }, []);

  const loadTematikKpdt = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/data/tematik/kpdt_hunian_kelayakan.geojson");
      if (!res.ok) return;
      const data = await res.json();
      if (tematikKpdtRef.current) mapRef.current.removeLayer(tematikKpdtRef.current);
      tematikKpdtRef.current = L.geoJSON(data, {
        style: (feature) => {
          const k = feature?.properties?.KELAYAKAN || "";
          const color = KELAYAKAN_COLORS[k] || "#94a3b8";
          return { color, weight: 1.5, opacity: 0.9, fillColor: color, fillOpacity: 0.5 };
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          const klk = KELAYAKAN_LABELS[p.KELAYAKAN] || "-";
          const klkColor = KELAYAKAN_COLORS[p.KELAYAKAN] || "#94a3b8";
          const popupEl = renderPopupNode({
            title: `Bangunan ${p.Id || "-"}`,
            subtitle: "Kepadatan & Kelayakan",
            color: klkColor,
            rows: [
              { label: "Kelayakan", value: klk, highlight: true },
              { label: "Fungsi", value: p.FUNGSI },
              { label: "Jenis", value: p.JENIS },
              { label: "Material", value: p.MATERIAL },
              { label: "Atap", value: p.ATAP },
              { label: "Lantai", value: p.JENIS_LANT },
              { label: "Jml KK", value: p.JUMLAH_KK },
              { label: "Jml Anggota", value: p.JUMLAH_ANG },
              { label: "Luas (m²)", value: p.luas },
              { label: "Kepadatan", value: p.kpdt },
              { label: "RT/RW", value: [p.RT, p.RW].filter(Boolean).join("/") || "-" },
              { label: "Rumah RT", value: p.rumah_rt },
            ].filter(r => r.value != null),
          });
          layer.bindPopup(popupEl);
          bindDelayedTooltip(layer, `<div style="font-size:12px;line-height:1.5"><strong style="color:#c8e8d0">Bangunan ${p.Id || "-"}</strong><br><span style="color:#9ab89e">Kelayakan:</span> <span style="color:#c8e8d0;font-weight:500">${klk}</span></div>`);
        },
      });
    } catch { /* ignore */ }
  }, []);

  const loadTematikBata = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/data/tematik/persebaran_batu_bata.geojson");
      if (!res.ok) return;
      const data = await res.json();
      if (tematikBataRef.current) mapRef.current.removeLayer(tematikBataRef.current);
      tematikBataRef.current = L.geoJSON(data, {
        style: { color: "#f97316", weight: 2, opacity: 0.9, fillColor: "#f97316", fillOpacity: 0.4 },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          const popupEl = renderPopupNode({
            title: p.KET_DETAIL || p.KETERANGAN || "(tanpa nama)",
            subtitle: "Sentra Batu Bata",
            color: "#f97316",
            rows: [
              { label: "Dusun", value: p.DUSUN },
              { label: "Desa", value: p.WADMKD },
              { label: "Kecamatan", value: p.WADMKC },
            ].filter(r => r.value != null),
          });
          layer.bindPopup(popupEl);
          bindDelayedTooltip(layer, `<div style="font-size:12px;line-height:1.5"><strong style="color:#c8e8d0">${p.KET_DETAIL || p.KETERANGAN || "(tanpa nama)"}</strong><br><span style="color:#9ab89e">Dusun:</span> <span style="color:#c8e8d0;font-weight:500">${p.DUSUN || "-"}</span></div>`);
        },
      });
    } catch { /* ignore */ }
  }, []);

  const loadTematikPersilRt = useCallback(async () => {
    if (!mapRef.current) return;
    try {
      const res = await fetch("/data/tematik/persil_rumahrt.geojson");
      if (!res.ok) return;
      const data = await res.json();
      if (tematikPersilRtRef.current) mapRef.current.removeLayer(tematikPersilRtRef.current);
      tematikPersilRtRef.current = L.geoJSON(data, {
        style: (feature) => {
          const k = feature?.properties?.KETERANGAN || "";
          const color = TEMATIK_PERSIL_COLORS[k] || "#94a3b8";
          return { color, weight: 1.5, opacity: 0.9, fillColor: color, fillOpacity: 0.45 };
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties;
          const label = TEMATIK_PERSIL_LABELS[p.KETERANGAN] || p.KETERANGAN || "-";
          const tematikColor = TEMATIK_PERSIL_COLORS[p.KETERANGAN] || "#94a3b8";
          const popupEl = renderPopupNode({
            title: p.Toponimi || p.NAMOBJ || "(tanpa nama)",
            subtitle: "Persil Rumah RT",
            color: tematikColor,
            rows: [
              { label: "Jenis", value: label, highlight: true },
              { label: "ID", value: p.Id },
              { label: "Rumah RT", value: p.rumah_rt },
              { label: "Dusun", value: p.DUSUN },
              { label: "Desa", value: p.WADMKD },
            ].filter(r => r.value != null),
          });
          layer.bindPopup(popupEl);
          bindDelayedTooltip(layer, `<div style="font-size:12px;line-height:1.5"><strong style="color:#c8e8d0">${p.Toponimi || p.NAMOBJ || "(tanpa nama)"}</strong><br><span style="color:#9ab89e">Jenis:</span> <span style="color:#c8e8d0;font-weight:500">${label}</span></div>`);
        },
      });
    } catch { /* ignore */ }
  }, []);

  const loadAllTematik = useCallback(async () => {
    await Promise.all([
      loadTematikBatasRt(),
      loadTematikKpdt(),
      loadTematikBata(),
      loadTematikPersilRt(),
    ]);
  }, [loadTematikBatasRt, loadTematikKpdt, loadTematikBata, loadTematikPersilRt]);

  // ═══════════════════════════════════════════════
  // Init map & load all
  // ═══════════════════════════════════════════════
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const savedBasemap = localStorage.getItem("basemap") || "satellite";
    setBasemap(savedBasemap);

    const map = L.map(mapContainerRef.current, {
      center: [-7.5674, 110.172],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });
    tileRef.current = L.tileLayer(BASEMAPS[savedBasemap].url, {
      attribution: "&copy; contributors",
      maxZoom: 19,
    }).addTo(map);
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
    loadDbLayers();
    loadPL();
    loadPersil();
    loadSarpras();
    loadAllTematik();

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

  // ═══════════════════════════════════════════════
  // Apply PL visibility
  // ═══════════════════════════════════════════════
  useEffect(() => {
    if (!plLayerRef.current) return;
    plLayerRef.current.eachLayer((layer: any) => {
      const pl = layer.feature?.properties?.PL;
      const key = PL_LABELS[pl] ? pl : PL_UNKNOWN_KEY;
      const visible = visPL.has(key);
      if (visible) {
        layer.setStyle({ opacity: 1, fillOpacity: 0.25 });
        if (!mapRef.current?.hasLayer(layer)) layer.addTo(mapRef.current!);
      } else {
        layer.setStyle({ opacity: 0, fillOpacity: 0 });
        if (mapRef.current?.hasLayer(layer)) mapRef.current.removeLayer(layer);
      }
    });
  }, [visPL]);

  // ── Apply Persil visibility ──
  useEffect(() => {
    if (!persilLayerRef.current) return;
    persilLayerRef.current.eachLayer((layer: any) => {
      const k = layer.feature?.properties?.KETERANGAN;
      const key = (k && PERSIL_LABELS[k]) ? k : PERSIL_UNKNOWN_KEY;
      const visible = visPersil.has(key);
      if (visible) {
        layer.setStyle({ opacity: 0.9, fillOpacity: 0.5 });
        if (!mapRef.current?.hasLayer(layer)) layer.addTo(mapRef.current!);
      } else {
        layer.setStyle({ opacity: 0, fillOpacity: 0 });
        if (mapRef.current?.hasLayer(layer)) mapRef.current.removeLayer(layer);
      }
    });
  }, [visPersil]);

  // ── Apply Sarpras visibility ──
  useEffect(() => {
    if (!sarprasGroupRef.current || !mapRef.current) return;
    sarprasGroupRef.current.eachLayer((marker: any) => {
      const kelas = marker._sarprasKelas;
      const key = (kelas && SARPRAS_LABELS[kelas]) ? kelas : SARPRAS_UNKNOWN_KEY;
      const visible = visSarpras.has(key);
      if (visible) {
        if (!mapRef.current?.hasLayer(marker)) marker.addTo(mapRef.current!);
      } else {
        if (mapRef.current?.hasLayer(marker)) mapRef.current.removeLayer(marker);
      }
    });
  }, [visSarpras]);

  // ── Apply DB visibility ──
  useEffect(() => {
    if (!mapRef.current) return;
    categoryLayersRef.current.forEach((layer, cat) => {
      if (visDb.has(cat)) {
        if (!mapRef.current?.hasLayer(layer)) layer.addTo(mapRef.current!);
      } else {
        if (mapRef.current?.hasLayer(layer)) mapRef.current?.removeLayer(layer);
      }
    });
  }, [visDb]);

  // ── Apply Tematik visibility ──
  useEffect(() => {
    if (!mapRef.current) return;
    const layers: [React.RefObject<L.GeoJSON | null>, string][] = [
      [tematikBatasRtRef, "batas_rt"],
      [tematikKpdtRef, "kpdt_hunian"],
      [tematikBataRef, "batu_bata"],
      [tematikPersilRtRef, "persil_rt"],
    ];
    layers.forEach(([ref, key]) => {
      const layer = ref.current;
      if (!layer) return;
      if (visTematik.has(key)) {
        if (!mapRef.current?.hasLayer(layer)) layer.addTo(mapRef.current!);
      } else {
        if (mapRef.current?.hasLayer(layer)) mapRef.current?.removeLayer(layer);
      }
    });
  }, [visTematik]);

  // ═══════════════════════════════════════════════
  // Toggle helpers
  // ═══════════════════════════════════════════════
  const toggleSet = useCallback((setter: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) => {
    setter(prev => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  }, []);

  // Master toggle: turn whole section ON or OFF, auto-expand when turning ON
  const toggleSection = useCallback((section: string) => {
    setSectionOn(prev => {
      const next = !prev[section];
      if (next) {
        // Auto-expand section when turning ON
        setExpandedSections(prev2 => new Set(prev2).add(section));
      }
      if (section === "pl") {
        setVisPL(next ? new Set(allPlKeys) : new Set());
      } else if (section === "persil") {
        setVisPersil(next ? new Set(allPersilKeys) : new Set());
      } else if (section === "sarpras") {
        setVisSarpras(next ? new Set(allSarprasKeys) : new Set());
      } else if (section === "db") {
        setVisDb(next ? new Set(dbCategories.map(c => c.key)) : new Set());
      } else if (section === "tematik") {
        setVisTematik(next ? new Set(TEMATIK_LAYERS.map(l => l.key)) : new Set());
      }
      return { ...prev, [section]: next };
    });
  }, [allPlKeys, allPersilKeys, allSarprasKeys, dbCategories]);

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
      loadDbLayers();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const locateMe = () => {
    if (!mapRef.current || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 17); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(() => {}); setIsFullscreen(true); }
    else { document.exitFullscreen().catch(() => {}); setIsFullscreen(false); }
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

  const LegendRow = ({ color, label, visible, onToggle }: { color: string; label: string; visible: boolean; onToggle: () => void }) => (
    <div className="flex items-center gap-2 text-xs group">
      <span className="w-4 h-3 rounded-sm shrink-0 border-2" style={{ borderColor: color, backgroundColor: color + "33" }} />
      <span className={`flex-1 leading-tight truncate ${visible ? "text-white/70" : "text-white/25"}`}>{label}</span>
      <button onClick={onToggle} className={`text-xs transition-colors ${visible ? "text-white/60 hover:text-white" : "text-white/20 hover:text-white/40"}`}>
        <i className={`bi ${visible ? "bi-eye-fill" : "bi-eye-slash-fill"} text-[10px]`} />
      </button>
    </div>
  );

  const toggleExpanded = useCallback((section: string) => {
    setExpandedSections(prev => { const n = new Set(prev); if (n.has(section)) n.delete(section); else n.add(section); return n; });
  }, []);

  const SectionHeader = ({ label, section, color }: { label: string; section: string; color: string }) => {
    const on = sectionOn[section];
    const expanded = expandedSections.has(section);
    return (
      <div className="flex items-center gap-2 text-xs mb-1 group">
        <span
          className="w-4 h-3 rounded-sm shrink-0 border-2 cursor-pointer"
          style={{ borderColor: color, backgroundColor: on ? color + "33" : "transparent" }}
          onClick={(e) => { e.stopPropagation(); toggleSection(section); }}
          title={on ? "Matikan layer" : "Nyalakan layer"}
        />
        <span
          className={`flex-1 leading-tight font-semibold truncate cursor-pointer ${on ? "text-white/80" : "text-white/30"}`}
          onClick={() => toggleExpanded(section)}
        >
          {label}
        </span>
        <span
          className={`text-[10px] transition-transform cursor-pointer ${expanded ? "text-white/50 rotate-0" : "text-white/25 -rotate-90"}`}
          onClick={() => toggleExpanded(section)}
        >
          <i className="bi bi-chevron-down" />
        </span>
      </div>
    );
  };


  return (
    <div className={`relative w-full ${mapHeight}`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ═══════ Layer Control (Top-Left) ═══════ */}
      <div className={`absolute top-4 left-12 z-[1000] bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 overflow-hidden ${showLegend ? "w-56" : "w-10"}`}>
        <div className="flex items-center">
          <button onClick={() => setShowLegend(!showLegend)} className="flex-1 flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-white/80 hover:text-white transition-colors">
            <i className={`bi ${showLegend ? "bi-chevron-down" : "bi-chevron-up"} text-xs`} />
            {showLegend && <span>Layer Control</span>}
          </button>
        </div>
        {showLegend && (
          <div className="px-3 pb-3 space-y-1 max-h-[55vh] overflow-y-auto">

            {/* ── DB Layers ── */}
            {dbCategories.length > 0 && (
              <>
                <SectionHeader label="Layer Data" section="db" color={dbCategories[0]?.color || "#3388ff"} />
                {sectionOn.db && expandedSections.has("db") && dbCategories.map(({ key, label, color }) => (
                  <LegendRow key={key} color={color} label={label} visible={visDb.has(key)} onToggle={() => toggleSet(setVisDb, key)} />
                ))}
                <div className="pt-1 mb-1 border-t border-white/10" />
              </>
            )}

            {/* ── Tematik ── */}
            <SectionHeader label="Tematik" section="tematik" color="#8b5cf6" />
            {sectionOn.tematik && expandedSections.has("tematik") && TEMATIK_LAYERS.map(({ key, label, color }) => (
              <LegendRow key={key} color={color} label={label} visible={visTematik.has(key)} onToggle={() => toggleSet(setVisTematik, key)} />
            ))}
            <div className="pt-1 mb-1 border-t border-white/10" />

            {/* ── Penggunaan Lahan ── */}
            <SectionHeader label="Penggunaan Lahan" section="pl" color={PL_COLORS["2"]} />
            {sectionOn.pl && expandedSections.has("pl") && PL_LEGEND_ENTRIES.map(({ key, label, color }) => (
              <LegendRow key={key} color={color} label={label} visible={visPL.has(key)} onToggle={() => toggleSet(setVisPL, key)} />
            ))}

            <div className="pt-1 mb-1 border-t border-white/10" />

            {/* ── Persil ── */}
            <SectionHeader label="Persil" section="persil" color={PERSIL_COLORS["2"]} />
            {sectionOn.persil && expandedSections.has("persil") && PERSIL_LEGEND_ENTRIES.map(({ key, label, color }) => (
              <LegendRow key={key} color={color} label={label} visible={visPersil.has(key)} onToggle={() => toggleSet(setVisPersil, key)} />
            ))}

            <div className="pt-1 mb-1 border-t border-white/10" />

            {/* ── Sarana Prasarana ── */}
            <SectionHeader label="Sarana Prasarana" section="sarpras" color={SARPRAS_COLORS["39"]} />
            {sectionOn.sarpras && expandedSections.has("sarpras") && SARPRAS_LEGEND_ENTRIES.map(({ key, label, color }) => (
              <LegendRow key={key} color={color} label={label} visible={visSarpras.has(key)} onToggle={() => toggleSet(setVisSarpras, key)} />
            ))}
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
              basemap === key ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg scale-[1.02]" : "text-white/70 hover:text-white hover:bg-white/10"
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

      {/* ── Right Controls ── */}
      <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-1.5">
        <button onClick={locateMe} disabled={locating} className="w-9 h-9 bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 dark:hover:bg-white/20 border border-white/10 shadow-xl transition-all disabled:opacity-40" title="Lokasi saya">
          <i className={`bi ${locating ? "bi-arrow-repeat animate-spin" : "bi-crosshair"} text-sm`} />
        </button>
        <button onClick={toggleFullscreen} className="w-9 h-9 bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 dark:hover:bg-white/20 border border-white/10 shadow-xl transition-all" title={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}>
          <i className={`bi ${isFullscreen ? "bi-fullscreen-exit" : "bi-arrows-fullscreen"} text-sm`} />
        </button>
        <button onClick={() => mapRef.current?.zoomIn()} className="w-9 h-9 bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-t-xl rounded-b-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 dark:hover:bg-white/20 border border-white/10 border-b-white/5 shadow-xl transition-all" title="Perbesar">
          <i className="bi bi-plus-lg text-sm" />
        </button>
        <button onClick={() => mapRef.current?.zoomOut()} className="w-9 h-9 bg-black/40 dark:bg-white/10 backdrop-blur-xl rounded-b-xl rounded-t-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 dark:hover:bg-white/20 border border-white/10 shadow-xl transition-all" title="Perkecil">
          <i className="bi bi-dash-lg text-sm" />
        </button>
      </div>

      {/* ── Save Dialog ── */}
      {showSaveDialog && (
        <>
          <div className="fixed inset-0 z-[1001] bg-black/20 backdrop-blur-sm" onClick={() => { setShowSaveDialog(false); drawnItemsRef.current?.clearLayers(); }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1002] bg-white dark:bg-gray-900 rounded-2xl p-6 w-80 shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-in">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"><i className="bi bi-floppy text-emerald-600 text-sm" /></div>
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
