"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import ScrollFloat from "@/components/reactbits/ScrollFloat";
import GradientText from "@/components/reactbits/GradientText";
import SejarahAudio from "@/components/SejarahAudio";
import TimelineSection from "@/components/TimelineSection";
import KerbanDalamAngka from "@/components/KerbanDalamAngka";
import BounceCards from "@/components/reactbits/BounceCards";

const MENU_ITEMS = [
  { href: "/sejarah", icon: "bi-book-fill", title: "Sejarah", desc: "Warisan & asal-usul Kerban", color: "from-amber-400 to-orange-500" },
  { href: "/map", icon: "bi-map-fill", title: "Peta Interaktif", desc: "Jelajahi WebGIS Dusun Kerban", color: "from-emerald-400 to-teal-500" },
  { href: "/lapor", icon: "bi-send-fill", title: "Lapor Warga", desc: "Sampaikan laporan Anda", color: "from-rose-400 to-red-500" },
  { href: "/quiz", icon: "bi-patch-question-fill", title: "Quiz Interaktif", desc: "Uji pengetahuan tentang Kerban", color: "from-lime-400 to-green-500" },
  { href: "/dashboard", icon: "bi-speedometer2", title: "Dashboard", desc: "Kelola data dan laporan", color: "from-emerald-500 to-green-600" },
];

interface UmkmItem {
  name: string;
  icon: string;
  desc: string;
  category: string;
}

function inferUmkmIcon(name: string): string {
  const lower = name.toLowerCase();
  if (/pijat|spa|salon/i.test(lower)) return "bi-heart-pulse";
  if (/sushi|mie|bakso|warung|snack|kitchen|makan|kuliner|es\s|kristal/i.test(lower)) return "bi-cup-hot";
  if (/advertising|cahaya|gemilang|percetakan|sablon/i.test(lower)) return "bi-printer";
  if (/shop|toko|abshop/i.test(lower)) return "bi-shop";
  if (/pt\.|pabrik|industri|pabrik/i.test(lower)) return "bi-building";
  if (/kandang|ternak|bakul/i.test(lower)) return "bi-basket";
  return "bi-shop-window";
}

const TEAM_MEMBERS = [
  { src: "/images/aboutus.jpeg", name: "Tim Kerban", role: "Bersama" },
  { src: "/images/har.jpeg", name: "Hardika Ahmad Tegar P.", role: "Anggota" },
  { src: "/images/shiro.jpeg", name: "Dzaki Jumayyel M.", role: "Anggota" },
  { src: "/images/eva.jpeg", name: "Eva Azalia", role: "Anggota" },
  { src: "/images/shawal.jpeg", name: "Anissa Syawalini Putri A.", role: "Anggota" },
];

const PETA_CARDS = [
  { img: "/peta/img/A3_ADMIN_1/A3_ADMIN_1-1.png" },
  { img: "/peta/img/A3_SARPRAS_1/A3_SARPRAS_1-1.png" },
  { img: "/peta/img/A3_PERSIL_1/A3_PERSIL_1-1.png" },
  { img: "/peta/img/PL%20A3%20FIXX/PL%20A3%20FIXX-1.png" },
  { img: "/peta/img/Kepadatan%20Hunian_1/Kepadatan%20Hunian_1-1.png" },
];

export default function HomePage() {
  const [showVideo, setShowVideo] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [umkmList, setUmkmList] = useState<UmkmItem[]>([]);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch UMKM data from sarpras GeoJSON (Kelas 1 = Industri, Kelas 3 = Perdagangan/Jasa)
  useEffect(() => {
    fetch("/data/sarpras.geojson")
      .then((r) => r.json())
      .then((data) => {
        const features = data.features || [];
        const umkm: UmkmItem[] = [];
        for (const f of features) {
          const kelas = f.properties?.Kelas;
          if (kelas === "1" || kelas === "3") {
            const name = f.properties?.TOPONIM || "Tanpa Nama";
            umkm.push({
              name,
              icon: inferUmkmIcon(name),
              desc: kelas === "1" ? "Industri / Pabrik" : "Perdagangan / Jasa",
              category: kelas,
            });
          }
        }
        setUmkmList(umkm);
      })
      .catch(() => {
        // Fallback if GeoJSON not available
        setUmkmList([]);
      });
  }, []);

  // Ensure video autoplays silently (browser fallback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Browser blocked autoplay; will retry on first user interaction
      const playOnInteraction = () => {
        video.play().catch(() => {});
        document.removeEventListener("click", playOnInteraction);
        document.removeEventListener("touchstart", playOnInteraction);
      };
      document.addEventListener("click", playOnInteraction, { once: true });
      document.addEventListener("touchstart", playOnInteraction, { once: true });
    });
  }, [showVideo]);

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
            <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover" poster="/videos/placeholder.mp4">
              <source src="/videos/dji-trim.mp4" type="video/mp4" />
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

          <h1 className="mb-6 leading-tight">
            <ScrollFloat
              textClassName="text-5xl sm:text-6xl md:text-8xl font-display font-bold text-emerald-600 dark:text-emerald-400"
              animationDuration={0.8}
              stagger={0.02}
            >
              Kerban
            </ScrollFloat>
          </h1>

          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform informasi dan pemetaan interaktif untuk masyarakat Dusun
            Kerban. Laporkan, pantau, dan jelajahi data spasial secara real-time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/map" className="btn-primary text-base px-8 py-3 cursor-target">
              <i className="bi bi-map mr-2" />Jelajahi Peta
            </Link>
            <Link href="/lapor" className="btn-outline text-base px-8 py-3 cursor-target">
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
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-emerald-50/30 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/10">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/5 dark:bg-emerald-500/3 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-emerald-600/5 dark:bg-emerald-600/3 blur-3xl" />

        <div className="container mx-auto max-w-5xl relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-semibold tracking-widest uppercase px-5 py-1.5 rounded-full mb-6">
              Sambutan
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-950 dark:text-emerald-50 mb-2">
              Kepala Dusun Kerban
            </h2>
            <p className="text-emerald-700/60 dark:text-emerald-400/60 text-lg">
              Sugeng Rawuh — Selamat datang di jendela digital kami
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-xl shadow-emerald-900/5 dark:shadow-black/20 p-8 md:p-12 hover:shadow-2xl hover:shadow-emerald-900/8 dark:hover:shadow-emerald-500/5 transition-shadow duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Photo */}
              <div className="flex-shrink-0 relative group">
                {/* Spinning ring */}
                <div className="absolute -inset-3 rounded-full border-2 border-dashed border-emerald-400/20 dark:border-emerald-500/15 animate-[spin_30s_linear_infinite]" />
                <div className="w-40 h-40 md:w-44 md:h-44 rounded-full shadow-2xl shadow-emerald-500/25 ring-[5px] ring-white dark:ring-card relative z-10 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                  <img
                    src="/images/pak-sigit.png"
                    alt="Sigit Zuli Susanto - Kepala Dusun Kerban"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Quote */}
              <div className="flex-1">
                <div className="relative pl-7 border-l-[3px] border-emerald-200 dark:border-emerald-800">
                  {/* Quote icon */}
                  <div className="absolute -top-3 -left-[17px] w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                    <i className="bi bi-quote text-white text-sm" />
                  </div>
                  <p className="italic text-muted-foreground leading-relaxed text-[1.05rem] mb-5">
                    Dengan penuh rasa syukur, saya mewakili seluruh warga Dusun Kerban menyambut Anda. Website ini adalah cerminan semangat kami: terbuka, informatif, dan siap menyambut dunia sambil tetap berpegang teguh pada akar budaya dan nilai-nilai luhur kita.
                  </p>
                  <p className="italic text-muted-foreground leading-relaxed text-[1.05rem]">
                    Visi kami adalah menjadikan Kerban dusun percontohan yang mandiri, berbudaya, dan sejahtera. Kami mengundang Anda untuk menjelajahi setiap sudut digital dusun kami dan menantikan kunjungan Anda secara langsung. Matur nuwun.
                  </p>
                </div>

                {/* Name */}
                <div className="flex items-center gap-3.5 mt-7">
                  <div className="w-10 h-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
                  <div>
                    <h4 className="font-bold text-xl text-emerald-950 dark:text-emerald-100">
                      Sigit Zuli Susanto
                    </h4>
                    <p className="text-sm text-emerald-600/70 dark:text-emerald-400/60 font-medium">
                      Kepala Dusun Kerban
                    </p>
                  </div>
                </div>

                {/* Signature line */}
                <div className="flex items-center gap-2.5 mt-5 text-sm text-muted-foreground/60">
                  <i className="bi bi-geo-alt-fill text-emerald-600 dark:text-emerald-500" />
                  <span>Dusun Kerban, Desa Kerban — menyapa dunia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold tracking-widest uppercase px-5 py-1.5 rounded-full mb-5">
              Warisan Leluhur
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 dark:text-emerald-50">
              Sejarah Dusun Kerban
            </h2>
            <p className="text-muted-foreground mt-2">Cerita di balik nama yang kita banggakan</p>
          </div>

          {/* Video */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl shadow-emerald-900/10">
              <iframe
                src="https://www.youtube.com/embed/FE9l3Jla8S8?si=kiYIdtJzAVbSKFPe"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Audio Recording */}
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="glass-card p-5">
              <SejarahAudio />
            </div>
          </div>

          {/* Timeline */}
          <TimelineSection />
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
              <Link key={item.href} href={item.href} className="group glass-card p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-target">
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

      {/* Produk Unggulan / UMKM */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <GradientText colors={["#4ade80", "#16a34a", "#4ade80"]} animationSpeed={5} className="text-xs font-medium uppercase tracking-wider">
              UMKM & Potensi
            </GradientText>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Produk Unggulan</h2>
            <p className="text-muted-foreground mt-2 text-sm">Data UMKM berdasarkan peta Sarana Prasarana Dusun Kerban</p>
          </div>
          {umkmList.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Memuat data UMKM…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {umkmList.map((p) => (
                <div key={p.name} className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                    <i className={`bi ${p.icon} text-2xl text-emerald-600 dark:text-emerald-400`} />
                  </div>
                  <h3 className="font-semibold mb-2">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Peta — Card Swap Gallery */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <GradientText colors={["#4ade80", "#16a34a", "#4ade80"]} animationSpeed={5} className="text-xs font-medium uppercase tracking-wider">
                Galeri Peta
              </GradientText>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                Peta Dusun Kerban
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Jelajahi koleksi peta tematik dan administrasi wilayah Dusun Kerban. Klik kartu untuk melihat ukuran penuh.
              </p>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25"
              >
                <i className="bi bi-collection" /> Lihat Semua Peta
              </Link>
            </div>

            {/* Right: Bounce Cards */}
            <div className="relative h-[420px] md:h-[480px] flex items-center justify-center">
              <BounceCards
                images={PETA_CARDS.map(c => c.img)}
                containerWidth={450}
                containerHeight={380}
                animationDelay={0.3}
                animationStagger={0.06}
                enableHover
                transformStyles={[
                  'rotate(8deg) translate(-160px)',
                  'rotate(3deg) translate(-75px)',
                  'rotate(-2deg)',
                  'rotate(-6deg) translate(75px)',
                  'rotate(-4deg) translate(160px)'
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kerban dalam Angka */}
      <KerbanDalamAngka />

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
            <Link href="/lapor" className="btn-primary text-base px-10 py-3.5 inline-block cursor-target">
              <i className="bi bi-send-fill mr-2" />Buat Laporan Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
