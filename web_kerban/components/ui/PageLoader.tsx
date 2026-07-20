"use client";
import { useState, useEffect } from "react";

export function PageLoader() {
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setExiting(true), 700);
    const hideTimer = setTimeout(() => setGone(true), 1200);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`page-loader ${exiting ? "hidden" : ""}`}>
      <div className="flex flex-col items-center gap-7">
        {/* Spinner group */}
        <div className="relative w-16 h-16">
          {/* Outer rings */}
          <div className="loader-outer-ring" />
          <div className="loader-outer-ring [animation-delay:0.7s]" />
          {/* Conic spinner */}
          <div className="loader-spinner-css" />
          {/* Center dot */}
          <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.5)] z-10" />
        </div>

        {/* Brand */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="loader-brand-text">Kerban</span>
          <span className="loader-tagline-text">Sistem Informasi & WebGIS</span>
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-1.5 -mt-1">
          <span className="loader-dot" />
          <span className="loader-dot [animation-delay:0.16s]" />
          <span className="loader-dot [animation-delay:0.32s]" />
        </div>
      </div>
    </div>
  );
}
