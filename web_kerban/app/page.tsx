"use client";

import { useState } from "react";
import Link from "next/link";

const MENU_ITEMS = [
  {
    href: "/map",
    icon: "bi-map-fill",
    title: "Peta Interaktif",
    desc: "Jelajahi WebGIS Dusun Kerban",
    color: "from-blue-500 to-cyan-500",
  },
  {
    href: "/lapor",
    icon: "bi-send-fill",
    title: "Lapor Warga",
    desc: "Sampaikan laporan Anda",
    color: "from-orange-500 to-red-500",
  },
  {
    href: "/quiz",
    icon: "bi-patch-question-fill",
    title: "Quiz Interaktif",
    desc: "Uji pengetahuan tentang Kerban",
    color: "from-green-500 to-emerald-500",
  },
  {
    href: "/dashboard",
    icon: "bi-speedometer2",
    title: "Dashboard",
    desc: "Kelola data dan laporan",
    color: "from-purple-500 to-pink-500",
  },
];

const PRODUK_UNGGULAN = [
  { name: "Kerajinan Bambu", icon: "bi-tree", desc: "Produk kerajinan tangan khas" },
  { name: "Batik Kerban", icon: "bi-brush", desc: "Motif batik khas dusun" },
  { name: "Hasil Tani", icon: "bi-flower1", desc: "Produk pertanian unggulan" },
  { name: "Kuliner Khas", icon: "bi-cup-hot", desc: "Makanan tradisional" },
];

export default function HomePage() {
  const [showVideo, setShowVideo] = useState(true);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {showVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster="/videos/placeholder.mp4"
            >
              <source src="/videos/drone_place.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-900 via-slate-900 to-slate-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium mb-6 tracking-wider uppercase">
            <i className="bi bi-geo-alt-fill mr-1.5" />
            Sistem Informasi & WebGIS
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-cyan-400">
              Dusun Kerban
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform informasi dan pemetaan interaktif untuk masyarakat Dusun
            Kerban. Laporkan, pantau, dan jelajahi data spasial secara real-time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/map" className="btn-primary text-base px-8 py-3">
              <i className="bi bi-map mr-2" />
              Jelajahi Peta
            </Link>
            <Link href="/lapor" className="btn-outline text-base px-8 py-3">
              <i className="bi bi-send mr-2" />
              Buat Laporan
            </Link>
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="p-3 rounded-xl glass text-foreground/70 hover:text-foreground transition-all"
              title={showVideo ? "Sembunyikan video" : "Tampilkan video"}
            >
              <i className={`bi ${showVideo ? "bi-camera-video-off" : "bi-camera-video"}`} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <i className="bi bi-chevron-down text-2xl text-foreground/40" />
        </div>
      </section>

      {/* Sambutan Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="glass-card p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center shrink-0">
                <i className="bi bi-person-fill text-5xl text-muted-foreground" />
              </div>
              <div>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                  Sambutan
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                  Kepala Dusun Kerban
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Selamat datang di portal resmi Sistem Informasi & WebGIS Dusun
                  Kerban. Platform ini hadir sebagai wujud komitmen kami dalam
                  memberikan pelayanan informasi yang transparan, akurat, dan
                  mudah diakses oleh seluruh warga. Mari bersama membangun Dusun
                  Kerban yang lebih maju dan sejahtera.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              Mengenal
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Sejarah Dusun Kerban</h2>
          </div>
          <div className="glass-card p-8 md:p-12">
            <p className="text-muted-foreground leading-relaxed text-justify">
              Dusun Kerban merupakan salah satu dusun yang memiliki sejarah
              panjang dalam perkembangan wilayah setempat. Berawal dari sebuah
              pemukiman kecil, Dusun Kerban terus berkembang menjadi komunitas
              yang dinamis dengan tetap mempertahankan kearifan lokal dan
              nilai-nilai gotong royong. Kini, dengan hadirnya teknologi
              informasi dan pemetaan digital, Dusun Kerban siap melangkah menuju
              era modernisasi tanpa meninggalkan akar budayanya.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Utama */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              Layanan
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Menu Utama</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group glass-card p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <i className={`bi ${item.icon} text-2xl text-white`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary-600 dark:text-primary-400">
                  Akses <i className="bi bi-arrow-right ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produk Unggulan */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              Potensi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Produk Unggulan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUK_UNGGULAN.map((produk) => (
              <div key={produk.name} className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <i className={`bi ${produk.icon} text-2xl text-primary-600 dark:text-primary-400`} />
                </div>
                <h3 className="font-semibold mb-2">{produk.name}</h3>
                <p className="text-sm text-muted-foreground">{produk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="glass-card p-10 md:p-14 bg-gradient-to-br from-primary-600/10 to-cyan-500/10 dark:from-primary-600/20 dark:to-cyan-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Berkontribusi?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Laporkan kondisi lingkungan, infrastruktur, atau kejadian di sekitar
              Dusun Kerban. Setiap laporan Anda sangat berarti.
            </p>
            <Link href="/lapor" className="btn-primary text-base px-10 py-3.5 inline-block">
              <i className="bi bi-send-fill mr-2" />
              Buat Laporan Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
