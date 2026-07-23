"use client";

import { createRoot } from "react-dom/client";

interface PopupRow {
  label: string;
  value: string;
  highlight?: boolean;
}

interface MapPopupProps {
  title: string;
  subtitle?: string;
  rows: PopupRow[];
  color?: string;
}

function MapPopupInner({ title, subtitle, rows, color = "#059669" }: MapPopupProps) {
  return (
    <div className="min-w-[220px] max-w-[340px] font-sans shadow-2xl shadow-black/25 rounded-xl overflow-hidden">
      {/* Color bar at top */}
      <div className="h-1" style={{ backgroundColor: color }} />

      <div className="px-4 pt-3 pb-4 bg-white dark:bg-[#1a221c] border border-emerald-200/30 dark:border-emerald-800/20">
        {/* Title */}
        <h3 className="font-bold text-sm text-[#1a3d2a] dark:text-[#c8e8d0] leading-tight mb-0.5">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60 uppercase tracking-wider mb-2.5">
            {subtitle}
          </p>
        )}

        {/* Rows */}
        <div className="space-y-1.5">
          {rows.map((row, i) => (
            <div key={i} className="flex items-baseline gap-2 text-xs">
              <span className="text-[#7a9e82] dark:text-[#6a8a72] flex-shrink-0 min-w-[70px]">
                {row.label}
              </span>
              <span
                className={
                  row.highlight
                    ? "font-semibold text-[#1a3d2a] dark:text-[#c8e8d0]"
                    : "text-[#4a6b52] dark:text-[#8aaa90]"
                }
              >
                {row.value || "-"}
              </span>
            </div>
          ))}
        </div>

        {/* Subtle dot indicator at bottom */}
        <div className="mt-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[9px] text-[#9ab89e] dark:text-[#5a7a62]">
            Dusun Kerban
          </span>
        </div>
      </div>
    </div>
  );
}

/** Render a MapPopup into a detached DOM node and return it — for use with Leaflet bindPopup */
export function renderPopupNode(props: MapPopupProps): HTMLElement {
  const container = document.createElement("div");
  container.className = "map-popup-container";
  const root = createRoot(container);
  root.render(<MapPopupInner {...props} />);
  return container;
}

export default MapPopupInner;
