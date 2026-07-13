"use client";
import { useEffect, useRef } from "react";

export function PageLoader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => { ref.current?.classList.add("hidden"); }, 600);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div ref={ref} className="page-loader">
      <div className="flex flex-col items-center gap-4">
        <div className="loader-spinner" />
        <span className="text-sm font-medium text-muted-foreground animate-pulse">Memuat...</span>
      </div>
    </div>
  );
}
