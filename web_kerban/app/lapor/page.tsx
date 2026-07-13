"use client";

import dynamic from "next/dynamic";

const LaporContent = dynamic(() => import("./LaporContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="loader-spinner" />
    </div>
  ),
});

export default function LaporPage() {
  return <LaporContent />;
}
