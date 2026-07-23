"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/", label: "Beranda", icon: "bi-house" },
  { href: "/sejarah", label: "Sejarah", icon: "bi-book" },
  { href: "/map", label: "Peta", icon: "bi-map" },
  { href: "/lapor", label: "Lapor", icon: "bi-send" },
  { href: "/quiz", label: "Quiz", icon: "bi-patch-question" },
  { href: "/dashboard", label: "Dashboard", icon: "bi-speedometer2", auth: true },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 md:px-8 py-2 sm:py-3", scrolled ? "glass border-b border-border/50 shadow-sm" : "bg-transparent")}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0 group/brand border border-emerald-600/30 dark:border-emerald-400/20 rounded-lg sm:rounded-xl px-2 py-1 sm:px-3 sm:py-1.5 hover:border-emerald-600/60 dark:hover:border-emerald-400/40">
              <i className="bi bi-geo-alt-fill text-xl text-emerald-600 dark:text-emerald-400 group-hover/brand:scale-110 group-hover/brand:-translate-y-0.5 transition-transform duration-300" />
              <span className="font-display font-bold text-sm">KERBAN</span>
            </Link>
            <div className="hidden md:flex items-center gap-1.5">
              {NAV_ITEMS.filter((item) => !item.auth || session).map((item) => (
                <Link key={item.href} href={item.href} className={cn(
                  "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95",
                  item.href !== "/map" && "cursor-target",
                  isActive(item.href)
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-500/50"
                    : "text-foreground/60 hover:text-foreground hover:bg-muted/50 hover:shadow-md"
                )}>
                  <i className={cn(item.icon, "mr-1.5 text-xs")} />{item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button onClick={toggleTheme} className="p-2 rounded-xl text-foreground/60 hover:text-foreground hover:bg-muted/50 hover:scale-110 active:scale-90 transition-all duration-300 group/theme" aria-label="Toggle theme">
              <i className={cn("bi text-sm transition-transform duration-500", theme === "dark" ? "bi-sun-fill group-hover/theme:rotate-90" : "bi-moon-fill group-hover/theme:-rotate-12")} />
            </button>
            {pathname === "/map" && (
              <button onClick={() => setSettingsOpen(!settingsOpen)} className="p-2 rounded-xl text-foreground/60 hover:text-foreground hover:bg-muted/50 hover:scale-110 active:scale-90 transition-all duration-300 hidden sm:flex" aria-label="Map settings">
                <i className={cn("bi bi-sliders text-sm transition-transform duration-300", settingsOpen && "rotate-90")} />
              </button>
            )}
            {session ? (
              <button onClick={() => signOut({ callbackUrl: "/" })} className="p-2 rounded-xl text-foreground/60 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:scale-110 active:scale-90 transition-all duration-300" aria-label="Logout">
                <i className="bi bi-box-arrow-right text-sm" />
              </button>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-emerald-500/30 ring-1 ring-emerald-500/30 cursor-target">
                <i className="bi bi-person mr-1" /><span className="hidden sm:inline">Masuk</span>
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl text-foreground/60 hover:text-foreground hover:bg-muted/50 hover:scale-110 active:scale-90 transition-all duration-300 md:hidden" aria-label="Menu">
              <i className={cn("bi text-sm transition-transform duration-300", menuOpen ? "bi-x-lg rotate-90" : "bi-list")} />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-14 left-4 right-4 glass-card p-4 flex flex-col gap-1 animate-fade-in">
            {NAV_ITEMS.filter((item) => !item.auth || session).map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={cn("px-4 py-3 rounded-xl text-sm font-medium transition-all", isActive(item.href) ? "bg-emerald-600 text-white" : "text-foreground/70 hover:text-foreground hover:bg-muted/50")}>
                <i className={cn(item.icon, "mr-3")} />{item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {pathname === "/map" && settingsOpen && (
        <div className="fixed top-14 right-4 z-50 glass-card p-4 w-64 animate-fade-in">
          <h3 className="font-semibold text-sm mb-3">Pengaturan Peta</h3>
          <div className="space-y-2">
            {[{ id: "satellite", label: "Satelit", icon: "bi-satellite" }, { id: "street", label: "Jalan", icon: "bi-map" }, { id: "topo", label: "Topografi", icon: "bi-geo-alt" }].map((item) => (
              <button key={item.id} onClick={() => { localStorage.setItem("basemap", item.id); window.dispatchEvent(new CustomEvent("basemap-change", { detail: item.id })); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-all">
                <i className={item.icon} />{item.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="h-14" />
    </>
  );
}
