"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import SejarahAudio from "@/components/SejarahAudio";
import ShinyText from "@/components/reactbits/ShinyText";

const TIMELINE_EVENTS = [
  {
    year: "1825",
    title: "Perang Jawa",
    desc: "Pasukan Pangeran Diponegoro membangun perkemahan dan menggali sumber air di wilayah Desa Sumberarum, termasuk Dusun Kerban. Wilayah ini menjadi saksi perjuangan melawan kolonial Belanda.",
    icon: "bi-shield-fill",
  },
  {
    year: "~1900-an",
    title: "Tradisi Kerepan",
    desc: "Masyarakat Jawa meyakini kepercayaan 'Ana Dewa Ngangklang Jagat' — ketika menjelang maghrib setiap orang berhenti beraktivitas dan istirahat, menjadi kebiasaan turun-temurun.",
    icon: "bi-sunset-fill",
  },
  {
    year: "1945",
    title: "Era Kemerdekaan",
    desc: "Semangat pengorbanan para pejuang terdahulu menjadi fondasi identitas Dusun Kerban sebagai simbol perjuangan dan ketahanan masyarakat.",
    icon: "bi-flag-fill",
  },
  {
    year: "Kini",
    title: "Dusun Kerban Modern",
    desc: "Kerban kini bertransformasi menjadi dusun yang mandiri, berbudaya, dan sejahtera — tetap memegang teguh warisan leluhur sambil menyambut era digital.",
    icon: "bi-rocket-takeoff-fill",
  },
];

function TimelineSection() {
  const lineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start end", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section className="py-20 px-4 bg-muted/30 overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-semibold tracking-widest uppercase px-5 py-1.5 rounded-full mb-5">
            Linimasa
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 dark:text-emerald-50">
            Perjalanan Sejarah
          </h2>
          <p className="text-muted-foreground mt-2">Jejak penting dalam perjalanan Dusun Kerban dari masa ke masa</p>
        </motion.div>

        <div ref={lineRef} className="relative">
          {/* Vertical line with scroll-driven grow animation */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-px">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400/20 via-amber-500/20 to-emerald-500/20" />
            <motion.div
              style={{ scaleY, transformOrigin: "top" }}
              className="absolute inset-0 bg-gradient-to-b from-amber-400 via-amber-500 to-emerald-500 origin-top"
            />
          </div>

          <div className="space-y-10">
            {TIMELINE_EVENTS.map((event, idx) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: idx * 0.15 + 0.3,
                  }}
                  className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-amber-500 border-4 border-background dark:border-card shadow-md z-10 -translate-x-1/2 mt-1.5"
                />

                {/* Content */}
                <div className={`ml-14 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.15 + 0.15,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 40px rgba(245, 158, 11, 0.15)" }}
                    className="glass-card p-6 transition-all duration-300"
                  >
                    <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {event.year}
                    </span>
                    <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-50 mb-2">
                      <i className={`bi ${event.icon} mr-2 text-amber-500`} />
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{event.desc}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SejarahPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-amber-950 via-stone-950 to-emerald-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
            backgroundImage: "radial-gradient(circle, rgb(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold tracking-widest uppercase px-5 py-1.5 rounded-full mb-5">
            Warisan Leluhur
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            <ShinyText text="Sejarah" speed={3} color="#f59e0b" shineColor="#fef3c7" spread={100} />
            <br />
            <span className="text-foreground">Dusun Kerban</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Menelusuri jejak sejarah dan warisan budaya yang membentuk identitas Dusun Kerban — dari legenda hingga masa kini.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <i className="bi bi-chevron-down text-2xl text-foreground/30" />
        </div>
      </section>

      {/* Audio Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium px-4 py-2 rounded-full mb-4">
              <i className="bi bi-mic-fill" /> Dengarkan Langsung
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 dark:text-emerald-50">
              Rekaman Narasi Sejarah
            </h2>
            <p className="text-muted-foreground mt-2">
              Rekaman suara asli yang menuturkan sejarah Dusun Kerban — Suara 133
            </p>
          </div>
          <div className="glass-card p-6 md:p-8">
            <SejarahAudio />
          </div>
        </div>
      </section>

      {/* Asal-Usul Nama */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold tracking-widest uppercase px-5 py-1.5 rounded-full mb-5">
              Asal-Usul
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 dark:text-emerald-50">
              Dua Versi Cerita
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Nama &quot;Kerban&quot; memiliki dua versi asal-usul yang sama-sama diyakini dan dihormati oleh masyarakat setempat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Story 1: Kerepan */}
            <div className="group glass-card overflow-hidden hover:shadow-2xl hover:shadow-amber-900/5 transition-all duration-500">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-400" />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <i className="bi bi-sunset-fill text-amber-600 dark:text-amber-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-emerald-950 dark:text-emerald-50">Versi &quot;Kerepan&quot;</h3>
                    <p className="text-xs text-muted-foreground">Kebiasaan Luhur</p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Kerban memiliki sejarah historis yang diyakini masyarakat sebagai sebuah nama dusun yang merefleksikan kebiasaan tradisi masyarakat Jawa. Orang Jawa meyakini kepercayaan terdahulu yakni <em>&ldquo;Ana Dewa Ngangklang Jagat&rdquo;</em> (Ada Dewa yang sedang berkeliling Dunia), yang mana ketika menjelang maghrib diharuskan setiap orang berhenti beraktivitas dan istirahat.
                  </p>
                  <p>
                    Hal ini terus dilakukan sehingga menjadi suatu kebiasaan atau dalam Bahasa Jawa disebut <strong>&ldquo;Kerepan&rdquo;</strong>. <strong>Kerban</strong> sendiri merupakan simplifikasi dari kata <em>kerepan</em> yang berarti kebiasaan luhur yang dilakukan oleh orang Jawa terdahulu hingga sekarang.
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <i className="bi bi-lightbulb-fill text-amber-500 text-lg mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">Makna Filosofis</p>
                        <p className="text-sm text-amber-700/80 dark:text-amber-300/70">
                          Kerepan mengajarkan keseimbangan hidup: bekerja di siang hari, beristirahat saat senja — harmoni antara manusia, alam, dan Sang Pencipta.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Story 2: Korban */}
            <div className="group glass-card overflow-hidden hover:shadow-2xl hover:shadow-red-900/5 transition-all duration-500">
              <div className="h-2 bg-gradient-to-r from-red-500 to-rose-400" />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <i className="bi bi-shield-fill text-red-600 dark:text-red-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-emerald-950 dark:text-emerald-50">Versi &quot;Korban&quot;</h3>
                    <p className="text-xs text-muted-foreground">Simbol Pengorbanan</p>
                  </div>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Dalam versi sejarah yang lain, istilah Dusun Kerban juga dikaitkan dengan makna <strong>&ldquo;Korban&rdquo;</strong> atau <strong>&ldquo;Pengorbanan&rdquo;</strong> yang berkaitan dengan cerita perjuangan <strong>Pangeran Diponegoro</strong>.
                  </p>
                  <p>
                    Menurut penuturan lokal, pada awal <strong>Perang Jawa tahun 1825</strong>, pasukan Pangeran Diponegoro pernah membangun perkemahan dan menggali sumber air di wilayah Desa Sumberarum (salah satunya di Kerban). Banyaknya korban pada saat perlawanan terhadap kolonial Belanda menjadikan dusun Kerban sangat identik dengan simbol pengorbanan para pejuang terdahulu.
                  </p>
                  <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <i className="bi bi-lightbulb-fill text-red-500 text-lg mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Makna Historis</p>
                        <p className="text-sm text-red-700/80 dark:text-red-300/70">
                          Pengorbanan para pejuang menjadi fondasi identitas Kerban — mengingatkan generasi penerus akan harga sebuah kemerdekaan dan keberanian.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <TimelineSection />

      {/* Gallery */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold tracking-widest uppercase px-5 py-1.5 rounded-full mb-5">
              Galeri
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 dark:text-emerald-50">
              Dokumentasi Dusun
            </h2>
            <p className="text-muted-foreground mt-2">Potret kehidupan dan budaya Dusun Kerban</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { src: "/images/tembang.jpg", label: "Tembang & Tradisi", icon: "bi-music-note" },
              { src: "/images/aboutus.jpeg", label: "Masyarakat Kerban", icon: "bi-people-fill" },
              { src: "/images/har.jpeg", label: "Generasi Penerus", icon: "bi-person-heart" },
            ].map((img, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 aspect-[4/3]"
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const parent = el.parentElement;
                    if (parent && !parent.querySelector(".fallback")) {
                      const fb = document.createElement("div");
                      fb.className = "fallback absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40 flex items-center justify-center";
                      fb.innerHTML = `<div class="text-center"><i class="bi bi-image text-4xl text-amber-400/50 dark:text-amber-500/30"></i></div>`;
                      parent.appendChild(fb);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-white">
                    <i className={`bi ${img.icon}`} />
                    <span className="text-sm font-medium">{img.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 via-white to-emerald-50 dark:from-amber-950/20 dark:via-background dark:to-emerald-950/20">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="glass-card p-10 md:p-14">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
              <i className="bi bi-geo-alt-fill text-2xl text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-950 dark:text-emerald-50 mb-4">
              Jelajahi Lebih Lanjut
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Lihat peta interaktif Dusun Kerban dan temukan lokasi bersejarah, fasilitas umum, serta informasi spasial lainnya.
            </p>
            <a
              href="/map"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40"
            >
              <i className="bi bi-map-fill" /> Buka Peta Interaktif
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
