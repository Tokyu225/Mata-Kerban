"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import ShinyText from "@/components/reactbits/ShinyText";
import GradientText from "@/components/reactbits/GradientText";

const MENU_ITEMS = [
  { href: "/map", icon: "bi-map-fill", title: "Peta Interaktif", desc: "Jelajahi WebGIS Dusun Kerban", color: "from-emerald-400 to-teal-500" },
  { href: "/lapor", icon: "bi-send-fill", title: "Lapor Warga", desc: "Sampaikan laporan Anda", color: "from-amber-400 to-orange-500" },
  { href: "/quiz", icon: "bi-patch-question-fill", title: "Quiz Interaktif", desc: "Uji pengetahuan tentang Kerban", color: "from-lime-400 to-green-500" },
  { href: "/dashboard", icon: "bi-speedometer2", title: "Dashboard", desc: "Kelola data dan laporan", color: "from-emerald-500 to-green-600" },
];

const PRODUK_UNGGULAN = [
  { name: "Kerajinan Bambu", icon: "bi-tree", desc: "Produk kerajinan tangan khas" },
  { name: "Batik Kerban", icon: "bi-brush", desc: "Motif batik khas dusun" },
  { name: "Hasil Tani", icon: "bi-flower1", desc: "Produk pertanian unggulan" },
  { name: "Kuliner Khas", icon: "bi-cup-hot", desc: "Makanan tradisional" },
];

const TEAM_MEMBERS = [
  { src: "/images/aboutus.jpeg", name: "Tim Kerban", role: "Bersama" },
  { src: "/images/har.jpeg", name: "Har", role: "Anggota" },
  { src: "/images/shiro.jpeg", name: "Shiro", role: "Anggota" },
  { src: "/images/eva.jpeg", name: "Eva", role: "Anggota" },
  { src: "/images/shawal.jpeg", name: "Shawal", role: "Anggota" },
];

export default function HomePage() {
  const [showVideo, setShowVideo] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Clamp to safe bounds
  const safeSlide = Math.max(0, Math.min(activeSlide, TEAM_MEMBERS.length - 1));
  const currentMember = TEAM_MEMBERS[safeSlide];

  const handleSlideHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = slideContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const segment = Math.floor((x / rect.width) * TEAM_MEMBERS.length);
    setActiveSlide(Math.max(0, Math.min(segment, TEAM_MEMBERS.length - 1)));
  }, []);

  const handleSlideLeave = useCallback(() => {
    setActiveSlide(0);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {showVideo ? (
            <video autoPlay muted loop playsInline className="w-full h-full object-cover" poster="/videos/placeholder.mp4">
              <source src="/videos/drone_place.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-green-950 to-stone-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{
            backgroundImage: "radial-gradient(circle, rgb(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-bold mb-6 leading-tight">
            <ShinyText text="Kerban" speed={3} color="#4ade80" shineColor="#bbf7d0" spread={100} />
          </h1>

          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform informasi dan pemetaan interaktif untuk masyarakat Dusun
            Kerban. Laporkan, pantau, dan jelajahi data spasial secara real-time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/map" className="btn-primary text-base px-8 py-3">
              <i className="bi bi-map mr-2" />Jelajahi Peta
            </Link>
            <Link href="/lapor" className="btn-outline text-base px-8 py-3">
              <i className="bi bi-send mr-2" />Buat Laporan
            </Link>
            <button onClick={() => setShowVideo(!showVideo)} className="p-3 rounded-xl glass text-foreground/70 hover:text-foreground transition-all" title={showVideo ? "Sembunyikan video" : "Tampilkan video"}>
              <i className={`bi ${showVideo ? "bi-camera-video-off" : "bi-camera-video"}`} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <i className="bi bi-chevron-down text-2xl text-foreground/30" />
        </div>
      </section>

      {/* Sambutan */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="glass-card p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <i className="bi bi-person-fill text-5xl text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <GradientText colors={["#4ade80", "#22c55e", "#4ade80", "#16a34a", "#4ade80"]} animationSpeed={6} className="text-xs font-medium uppercase tracking-wider">
                  Sambutan
                </GradientText>
                <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">Kepala Dusun Kerban</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Selamat datang di portal resmi WebGIS Dusun
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

      {/* Sejarah */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <GradientText colors={["#4ade80", "#16a34a", "#4ade80"]} animationSpeed={5} className="text-xs font-medium uppercase tracking-wider">
              Mengenal
            </GradientText>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Sejarah Dusun Kerban</h2>
          </div>
          <div className="glass-card p-8 md:p-12">
            <p className="text-muted-foreground leading-relaxed text-justify">
              Dusun Kerban merupakan salah satu dusun yang memiliki sejarah panjang dalam perkembangan wilayah setempat. Berawal dari sebuah pemukiman kecil, Dusun Kerban terus berkembang menjadi komunitas yang dinamis dengan tetap mempertahankan kearifan lokal dan nilai-nilai gotong royong. Kini, dengan hadirnya teknologi informasi dan pemetaan digital, Dusun Kerban siap melangkah menuju era modernisasi tanpa meninggalkan akar budayanya.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Utama */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <GradientText colors={["#4ade80", "#22c55e", "#4ade80"]} animationSpeed={5} className="text-xs font-medium uppercase tracking-wider">
              Layanan
            </GradientText>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Menu Utama</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MENU_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="group glass-card p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <i className={`bi ${item.icon} text-2xl text-white`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
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
            <GradientText colors={["#4ade80", "#16a34a", "#4ade80"]} animationSpeed={5} className="text-xs font-medium uppercase tracking-wider">
              Potensi
            </GradientText>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Produk Unggulan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUK_UNGGULAN.map((p) => (
              <div key={p.name} className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <i className={`bi ${p.icon} text-2xl text-emerald-600 dark:text-emerald-400`} />
                </div>
                <h3 className="font-semibold mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hover Slideshow */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400/20 via-green-500/10 to-emerald-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div
                ref={slideContainerRef}
                onMouseMove={handleSlideHover}
                onMouseLeave={handleSlideLeave}
                className="relative overflow-hidden rounded-2xl shadow-2xl cursor-crosshair"
              >
                <img
                  src={currentMember.src}
                  alt={currentMember.name}
                  className="w-full h-auto object-cover aspect-[3/4] max-h-[500px] transition-all duration-300"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Slide name label */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-bold text-lg">{currentMember.name}</p>
                  <p className="text-white/70 text-sm">{currentMember.role}</p>
                </div>
                {/* Dots indicator */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {TEAM_MEMBERS.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === safeSlide
                          ? "bg-white w-6"
                          : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                {/* Hover hint */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/60 text-xs transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <i className="bi bi-arrows-horizontal mr-1" />Geser
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
            </div>

            {/* Text */}
            <div className="space-y-6">
              <GradientText
                colors={["#4ade80", "#22c55e", "#4ade80"]}
                animationSpeed={5}
                className="text-xs font-medium uppercase tracking-wider"
              >
                Tentang Kami
              </GradientText>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Mengenal Lebih Dekat{" "}
                <span className="text-emerald-600 dark:text-emerald-400">Dusun Kerban</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" />
              <p className="text-muted-foreground text-lg leading-relaxed">
                Kami adalah komunitas yang berdedikasi untuk memajukan Dusun
                Kerban melalui teknologi, transparansi, dan kolaborasi. Dengan
                semangat gotong royong, kami menghadirkan platform digital untuk
                menghubungkan warga, pemerintah, dan seluruh pemangku kepentingan.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { icon: "bi-people-fill", label: "Komunitas", desc: "Berbasis warga" },
                  { icon: "bi-shield-check", label: "Transparan", desc: "Data terbuka" },
                  { icon: "bi-lightning-charge-fill", label: "Cepat", desc: "Real-time" },
                  { icon: "bi-heart-fill", label: "Peduli", desc: "Lingkungan & sosial" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                      <i className={`bi ${item.icon} text-lg text-emerald-600 dark:text-emerald-400`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="glass-card p-10 md:p-14 bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-600/20">
            <GradientText colors={["#4ade80", "#22c55e", "#4ade80", "#16a34a", "#4ade80"]} animationSpeed={4} className="text-3xl md:text-4xl font-bold mb-4" as="h2">
              Siap Berkontribusi?
            </GradientText>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Laporkan kondisi lingkungan, infrastruktur, atau kejadian di sekitar Dusun Kerban. Setiap laporan Anda sangat berarti.
            </p>
            <Link href="/lapor" className="btn-primary text-base px-10 py-3.5 inline-block">
              <i className="bi bi-send-fill mr-2" />Buat Laporan Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
