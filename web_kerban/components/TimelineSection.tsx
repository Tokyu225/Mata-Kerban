"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

export const TIMELINE_EVENTS = [
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

export default function TimelineSection() {
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
