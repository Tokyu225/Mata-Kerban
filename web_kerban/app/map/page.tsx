"use client";

import dynamic from "next/dynamic";

const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="loader-spinner" />
    </div>
  ),
});

export default function MapPage() {
  return <MapContent />;
}
