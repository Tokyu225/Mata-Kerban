"use client";

import { useRef } from "react";
import GradientText from "@/components/reactbits/GradientText";

interface StatCard {
  value: string;
  label: string;
  desc: string;
  icon: string;
  color: string;
}

const STATS: StatCard[] = [
  {
    value: "462",
    label: "Total Penduduk",
    desc: "235 Laki-laki & 227 Perempuan",
    icon: "bi-people-fill",
    color: "from-emerald-400 to-teal-500",
  },
  {
    value: "116",
    label: "Kepala Keluarga",
    desc: "Menempati 115 rumah sehat dan layak huni",
    icon: "bi-house-heart-fill",
    color: "from-amber-400 to-orange-500",
  },
  {
    value: "40 Ha",
    label: "Lahan Pertanian",
    desc: "Komoditas utama Ketela dengan panen 10 ton per tahun",
    icon: "bi-tree-fill",
    color: "from-lime-400 to-green-500",
  },
  {
    value: "5",
    label: "Industri Rumah Tangga",
    desc: "Meliputi bidang Pangan (2) dan Jasa (3)",
    icon: "bi-shop",
    color: "from-rose-400 to-red-500",
  },
];

export default function KerbanDalamAngka() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-emerald-950/40 via-emerald-950/20 to-background"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-600/5 blur-3xl" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <GradientText
            colors={["#4ade80", "#22c55e", "#4ade80"]}
            animationSpeed={5}
            className="text-xs font-medium uppercase tracking-wider"
          >
            Statistik
          </GradientText>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 text-emerald-950 dark:text-emerald-50">
            Kerban dalam Angka
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-[0.95rem] leading-relaxed">
            Potret komunitas kami melalui data statistik terbaru yang kami
            sajikan secara transparan untuk memberikan gambaran yang jelas
            tentang dinamika Dusun Kerban.
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="group glass-card p-6 text-center hover:scale-[1.03] transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/10 dark:hover:shadow-emerald-500/5"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <i className={`bi ${stat.icon} text-2xl text-white`} />
              </div>

              {/* Number */}
              <p className="text-4xl md:text-5xl font-extrabold text-emerald-950 dark:text-emerald-50 mb-1 tracking-tight">
                {stat.value}
              </p>

              {/* Label */}
              <p className="font-semibold text-sm text-emerald-800 dark:text-emerald-200 mb-2">
                {stat.label}
              </p>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
