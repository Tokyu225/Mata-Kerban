"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const PETA_ITEMS = [
  { file: "A3_ADMIN_1", label: "Peta Administrasi", desc: "Batas wilayah administrasi dusun" },
  { file: "A3_FU_1", label: "Fasilitas Umum", desc: "Sebaran fasilitas umum warga" },
  { file: "A3_PERSIL_1", label: "Peta Persil", desc: "Bidang tanah dan persil lahan" },
  { file: "A3_SARPRAS_1", label: "Sarana Prasarana", desc: "Infrastruktur dan sarana dusun" },
  { file: "batasRT+rumahRT_1", label: "Batas RT & Rumah", desc: "Batas RT dan sebaran rumah" },
  { file: "Kelayakan Hunian_1", label: "Kelayakan Hunian", desc: "Tingkat kelayakan hunian warga" },
  { file: "Kepadatan Hunian_1", label: "Kepadatan Hunian", desc: "Kepadatan penduduk per wilayah" },
  { file: "perbandingan penduduk FIX", label: "Perbandingan Penduduk", desc: "Statistik perbandingan demografi" },
  { file: "PL A3 FIXX", label: "Peta Lahan", desc: "Penggunaan lahan wilayah" },
  { file: "sentraBatuBata_1", label: "Sentra Batu Bata", desc: "Kawasan industri batu bata" },
];

export default function PetaPage() {
  const [selected, setSelected] = useState(0);
  const current = PETA_ITEMS[selected];
  const imgSrc = `/peta/img/${encodeURIComponent(current.file)}/${encodeURIComponent(current.file)}-1.png`;
  const pdfSrc = `/peta/${encodeURIComponent(current.file)}.pdf`;

  return (
    <div className="bg-[#f2f7f2] dark:bg-[#121a14] min-h-screen flex flex-col">
      {/* Header bar */}
      <div className="border-b border-emerald-200/30 dark:border-emerald-800/20 bg-white/80 dark:bg-[#1a221c]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[#4a6b52] dark:text-[#7a9e82] hover:text-[#1a3d2a] dark:hover:text-[#c8e8d0] transition-colors">
              <i className="bi bi-arrow-left text-lg" />
            </Link>
            <div>
              <h1 className="font-serif font-bold text-[#1a3d2a] dark:text-[#c8e8d0] text-lg leading-tight">
                Peta Dusun Kerban
              </h1>
              <p className="text-xs text-[#4a6b52]/60 dark:text-[#7a9e82]/60">{current.label}</p>
            </div>
          </div>
          <a
            href={pdfSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <i className="bi bi-arrows-fullscreen" /> Lihat Full Size
          </a>
        </div>
      </div>

      {/* Main map viewer */}
      <div className="flex-1 flex items-center justify-center p-2 md:p-4">
        <div className="w-full max-w-7xl flex items-stretch gap-2 md:gap-4">
          {/* Left arrow */}
          <button
            onClick={() => setSelected((selected - 1 + PETA_ITEMS.length) % PETA_ITEMS.length)}
            className="flex-shrink-0 w-10 md:w-14 flex items-center justify-center bg-white/80 dark:bg-[#1a221c]/80 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200/30 dark:border-emerald-800/20 rounded-xl transition-all duration-200 group self-center"
            title="Sebelumnya"
          >
            <i className="bi bi-chevron-left text-xl md:text-2xl text-[#4a6b52] dark:text-[#7a9e82] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          </button>

          {/* Map */}
          <div className="flex-1 flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.file}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative w-full bg-white dark:bg-[#1a221c] rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/10 border border-emerald-200/30 dark:border-emerald-800/20"
              >
                <img
                  src={imgSrc}
                  alt={current.label}
                  className="w-full h-auto max-h-[78vh] object-contain cursor-pointer"
                  onClick={() => window.open(pdfSrc, "_blank")}
                />
                {/* Click hint */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <i className="bi bi-cursor-fill" /> Klik untuk full size
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Info bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={current.file + "-info"}
              className="mt-3 text-center"
            >
              <h2 className="font-serif text-xl font-bold text-[#1a3d2a] dark:text-[#c8e8d0]">
                {current.label}
              </h2>
              <p className="text-sm text-[#4a6b52] dark:text-[#7a9e82]">{current.desc}</p>
            </motion.div>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => setSelected((selected + 1) % PETA_ITEMS.length)}
            className="flex-shrink-0 w-10 md:w-14 flex items-center justify-center bg-white/80 dark:bg-[#1a221c]/80 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200/30 dark:border-emerald-800/20 rounded-xl transition-all duration-200 group self-center"
            title="Selanjutnya"
          >
            <i className="bi bi-chevron-right text-xl md:text-2xl text-[#4a6b52] dark:text-[#7a9e82] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="border-t border-emerald-200/30 dark:border-emerald-800/20 bg-white/60 dark:bg-[#1a221c]/60 backdrop-blur-sm py-4">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {PETA_ITEMS.map((item, idx) => {
              const thumbSrc = `/peta/img/${encodeURIComponent(item.file)}/${encodeURIComponent(item.file)}-1.png`;
              const isActive = idx === selected;
              return (
                <button
                  key={item.file}
                  onClick={() => setSelected(idx)}
                  className={`flex-shrink-0 w-24 md:w-28 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    isActive
                      ? "border-emerald-500 shadow-md shadow-emerald-500/20 scale-105"
                      : "border-transparent hover:border-emerald-300/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="aspect-[3/4] bg-muted relative">
                    <img
                      src={thumbSrc}
                      alt={item.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className={`p-1.5 text-center ${isActive ? "bg-emerald-50 dark:bg-emerald-900/20" : ""}`}>
                    <p className={`text-[10px] leading-tight font-medium truncate ${
                      isActive ? "text-emerald-700 dark:text-emerald-300" : "text-[#4a6b52] dark:text-[#7a9e82]"
                    }`}>
                      {item.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
