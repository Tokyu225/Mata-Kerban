"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import SejarahAudio from "@/components/SejarahAudio";
import { TIMELINE_EVENTS } from "@/components/TimelineSection";

export default function SejarahPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.6], [1, 1.08]);

  return (
    <div className="bg-[#f2f7f2] dark:bg-[#121a14]">
      {/* ═══════════════════════════════════════════════
          HERO — Manuscript / Parchment Style
          ═══════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background: warm parchment gradient, NO dot pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f0e8] via-[#d4e4d4] to-[#f2f7f2] dark:from-[#0e1a12] dark:via-[#162a1c] dark:to-[#121a14]" />

        {/* Ornamental corner decorations */}
        <div className="absolute top-12 left-12 text-emerald-300/25 dark:text-emerald-700/20 text-8xl font-serif select-none">
          ❧
        </div>
        <div className="absolute top-12 right-12 text-emerald-300/25 dark:text-emerald-700/20 text-8xl font-serif select-none rotate-90">
          ❧
        </div>
        <div className="absolute bottom-12 left-12 text-emerald-300/25 dark:text-emerald-700/20 text-8xl font-serif select-none -rotate-90">
          ❧
        </div>
        <div className="absolute bottom-12 right-12 text-emerald-300/25 dark:text-emerald-700/20 text-8xl font-serif select-none rotate-180">
          ❧
        </div>

        {/* Ornamental border lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

        {/* Decorative side lines */}
        <div className="absolute left-8 md:left-16 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-emerald-300/20 to-transparent" />
        <div className="absolute right-8 md:right-16 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-emerald-300/20 to-transparent" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        >
          {/* Chapter indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-emerald-400/60" />
            <span className="text-xs tracking-[0.3em] uppercase text-emerald-600/70 dark:text-emerald-400/60 font-medium">
              Bab Satu
            </span>
            <div className="h-px w-12 bg-emerald-400/60" />
          </motion.div>

          {/* Main title — serif, elegant */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-[#1a3d2a] dark:text-[#c8e8d0] leading-tight mb-6"
          >
            Sejarah
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">Dusun Kerban</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-[#4a6b52] dark:text-[#7a9e82] text-lg md:text-xl leading-relaxed italic"
          >
            Menelusuri jejak leluhur — dari legenda Kerepan hingga semangat pengorbanan
            yang membentuk identitas Dusun Kerban.
          </motion.p>

          {/* Scroll indicator — distinct from landing page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-14 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-emerald-500/50">Gulir ke Bawah</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-emerald-400/30 flex items-start justify-center p-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════
          ASAL-USUL — Side-by-side with ornamental divider
          ═══════════════════════════════════════════════ */}
      <section className="py-24 px-4 relative">
        {/* Decorative top ornament */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="h-px w-16 bg-emerald-300/30" />
          <span className="text-emerald-400/40 text-lg">◆</span>
          <div className="h-px w-16 bg-emerald-300/30" />
        </div>

        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-emerald-600/60 dark:text-emerald-400/50 font-medium">
              Asal-Usul
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a3d2a] dark:text-[#c8e8d0] mt-3 mb-4">
              Dua Versi Cerita
            </h2>
            <p className="text-[#4a6b52] dark:text-[#7a9e82] max-w-xl mx-auto leading-relaxed">
              Nama &ldquo;Kerban&rdquo; memiliki dua versi asal-usul yang sama-sama diyakini dan dihormati oleh masyarakat setempat
            </p>
          </motion.div>

          <div className="relative">
            {/* Central ornamental divider (visible on desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
              <div className="h-full w-px bg-gradient-to-b from-transparent via-emerald-300/40 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-emerald-300/30 bg-[#f2f7f2] dark:bg-[#121a14] flex items-center justify-center">
                <span className="text-emerald-400/60 text-sm">atau</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              {/* Story 1: Kerepan */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="group"
              >
                <div className="bg-white dark:bg-[#1a221c] border border-emerald-200/50 dark:border-emerald-800/20 rounded-2xl p-8 md:p-10 shadow-lg shadow-emerald-900/5 hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-500">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center mb-6">
                    <i className="bi bi-sunset-fill text-emerald-600 dark:text-emerald-400 text-2xl" />
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#1a3d2a] dark:text-[#c8e8d0] mb-2">
                    &ldquo;Kerepan&rdquo;
                  </h3>
                  <p className="text-xs tracking-widest uppercase text-emerald-500/70 mb-6">Kebiasaan Luhur</p>

                  <div className="space-y-5 text-[#4a634a] dark:text-[#9ab89e] leading-relaxed">
                    <p>
                      Kerban memiliki sejarah historis yang diyakini masyarakat sebagai sebuah nama dusun yang merefleksikan kebiasaan tradisi masyarakat Jawa. Orang Jawa meyakini kepercayaan terdahulu yakni <em className="text-emerald-700 dark:text-emerald-300 not-italic font-medium">&ldquo;Ana Dewa Ngangklang Jagat&rdquo;</em> (Ada Dewa yang sedang berkeliling Dunia), yang mana ketika menjelang maghrib diharuskan setiap orang berhenti beraktivitas dan istirahat.
                    </p>
                    <p>
                      Hal ini terus dilakukan sehingga menjadi suatu kebiasaan atau dalam Bahasa Jawa disebut <strong className="text-[#1a3d2a] dark:text-[#c8e8d0]">&ldquo;Kerepan&rdquo;</strong>. <strong className="text-[#1a3d2a] dark:text-[#c8e8d0]">Kerban</strong> sendiri merupakan simplifikasi dari kata <em>kerepan</em> yang berarti kebiasaan luhur yang dilakukan oleh orang Jawa terdahulu hingga sekarang.
                    </p>
                  </div>

                  {/* Quote box */}
                  <div className="mt-6 border-l-[3px] border-emerald-400/60 pl-5 py-1">
                    <p className="text-sm text-emerald-700/80 dark:text-emerald-300/70 italic leading-relaxed">
                      &ldquo;Keseimbangan hidup: bekerja di siang hari, beristirahat saat senja — harmoni antara manusia, alam, dan Sang Pencipta.&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Story 2: Korban */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="group"
              >
                <div className="bg-white dark:bg-[#1a221c] border border-teal-200/50 dark:border-teal-800/20 rounded-2xl p-8 md:p-10 shadow-lg shadow-teal-900/5 hover:shadow-xl hover:shadow-teal-900/10 transition-all duration-500">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 flex items-center justify-center mb-6">
                    <i className="bi bi-shield-fill text-teal-600 dark:text-teal-400 text-2xl" />
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#1a3d2a] dark:text-[#c8e8d0] mb-2">
                    &ldquo;Korban&rdquo;
                  </h3>
                  <p className="text-xs tracking-widest uppercase text-teal-500/70 mb-6">Simbol Pengorbanan</p>

                  <div className="space-y-5 text-[#4a634a] dark:text-[#9ab89e] leading-relaxed">
                    <p>
                      Dalam versi sejarah yang lain, istilah Dusun Kerban juga dikaitkan dengan makna <strong className="text-[#1a3d2a] dark:text-[#c8e8d0]">&ldquo;Korban&rdquo;</strong> atau <strong className="text-[#1a3d2a] dark:text-[#c8e8d0]">&ldquo;Pengorbanan&rdquo;</strong> yang berkaitan dengan cerita perjuangan <strong className="text-[#1a3d2a] dark:text-[#c8e8d0]">Pangeran Diponegoro</strong>.
                    </p>
                    <p>
                      Menurut penuturan lokal, pada awal <strong className="text-[#1a3d2a] dark:text-[#c8e8d0]">Perang Jawa tahun 1825</strong>, pasukan Pangeran Diponegoro pernah membangun perkemahan dan menggali sumber air di wilayah Desa Sumberarum (salah satunya di Kerban). Banyaknya korban pada saat perlawanan terhadap kolonial Belanda menjadikan dusun Kerban sangat identik dengan simbol pengorbanan para pejuang terdahulu.
                    </p>
                  </div>

                  {/* Quote box */}
                  <div className="mt-6 border-l-[3px] border-teal-400/60 pl-5 py-1">
                    <p className="text-sm text-teal-700/80 dark:text-teal-300/70 italic leading-relaxed">
                      &ldquo;Pengorbanan para pejuang menjadi fondasi identitas Kerban — mengingatkan generasi penerus akan harga sebuah kemerdekaan.&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AUDIO — Integrated narrative player
          ═══════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-[#e8f2e8]/50 to-transparent dark:via-[#121a14]/50">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-[#1a221c] border border-emerald-200/40 dark:border-emerald-800/20 rounded-3xl p-8 md:p-10 shadow-xl shadow-emerald-900/5"
          >
            {/* Header with decorative line */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-emerald-300/30" />
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <i className="bi bi-mic-fill text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-emerald-300/30" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#1a3d2a] dark:text-[#c8e8d0] text-center mb-1">
              Rekaman Narasi Sejarah
            </h3>
            <p className="text-xs text-center text-[#4a6b52] dark:text-[#7a9e82] mb-8">
              Tuturan asli sejarah Dusun Kerban — Suara 133
            </p>

            <SejarahAudio />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TIMELINE — restyled with sepia tones
          ═══════════════════════════════════════════════ */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-emerald-600/60 dark:text-emerald-400/50 font-medium">
              Linimasa
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a3d2a] dark:text-[#c8e8d0] mt-3 mb-3">
              Perjalanan Sejarah
            </h2>
            <p className="text-[#4a6b52] dark:text-[#7a9e82]">
              Jejak penting Dusun Kerban dari masa ke masa
            </p>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px bg-gradient-to-b from-emerald-300/20 via-emerald-400/30 to-emerald-300/20" />

            <div className="space-y-12">
              {TIMELINE_EVENTS.map((event, idx) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: idx * 0.12, ease: "easeOut" }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-emerald-500 border-[3px] border-[#f2f7f2] dark:border-[#121a14] -translate-x-1/2 mt-2 z-10 shadow-sm" />

                  {/* Content card */}
                  <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${idx % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                    <div className="bg-white dark:bg-[#1a221c] border border-emerald-200/30 dark:border-emerald-800/20 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-900/5 transition-shadow duration-300">
                      <span className="inline-block font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-md mb-3 tracking-wider">
                        {event.year}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-[#1a3d2a] dark:text-[#c8e8d0] mb-2 flex items-center gap-2">
                        <i className={`bi ${event.icon} text-emerald-500 text-sm`} />
                        {event.title}
                      </h3>
                      <p className="text-sm text-[#4a634a] dark:text-[#9ab89e] leading-relaxed">
                        {event.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER — Simple, distinct from landing page CTA
          ═══════════════════════════════════════════════ */}
      <section className="py-20 px-4 border-t border-emerald-200/30 dark:border-emerald-800/20">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Closing ornament */}
            <div className="text-emerald-400/30 text-6xl font-serif mb-6 select-none">❧</div>

            <p className="font-serif italic text-[#4a6b52] dark:text-[#7a9e82] text-lg leading-relaxed mb-8">
              &ldquo;Sejarah bukan sekadar cerita masa lalu — ia adalah kompas yang menuntun langkah
              generasi penerus Dusun Kerban.&rdquo;
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/map"
                className="inline-flex items-center gap-2 border border-emerald-400/40 dark:border-emerald-600/30 text-[#1a3d2a] dark:text-[#c8e8d0] hover:bg-emerald-50 dark:hover:bg-emerald-900/10 font-medium px-6 py-3 rounded-xl transition-all duration-300"
              >
                <i className="bi bi-map-fill" /> Jelajahi Peta
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 text-[#4a6b52] dark:text-[#7a9e82] hover:text-[#1a3d2a] dark:hover:text-[#c8e8d0] font-medium px-6 py-3 rounded-xl transition-all duration-300"
              >
                <i className="bi bi-arrow-left" /> Kembali ke Beranda
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
