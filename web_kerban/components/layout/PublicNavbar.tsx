"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/", label: "Beranda", icon: "bi-house" },
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
      <nav className={cn("fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 px-5 py-3 rounded-full", scrolled ? "glass shadow-lg shadow-black/10 dark:shadow-black/30" : "bg-transparent")}>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/" className="flex items-center gap-2 mr-2 text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <i className="bi bi-geo-alt-fill text-xl text-emerald-600 dark:text-emerald-400" />
            <span className="font-display font-bold text-sm hidden sm:inline">DUSUN KERBAN</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.filter((item) => !item.auth || session).map((item) => (
              <Link key={item.href} href={item.href} className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all duration-200", isActive(item.href) ? "bg-emerald-600 text-white shadow-md" : "text-foreground/70 hover:text-foreground hover:bg-muted/50")}>
                <i className={cn(item.icon, "mr-1.5")} />{item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all" aria-label="Toggle theme">
              <i className={cn("bi", theme === "dark" ? "bi-sun-fill" : "bi-moon-fill")} />
            </button>
            <button onClick={() => setSettingsOpen(!settingsOpen)} className="p-2.5 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all hidden sm:flex" aria-label="Map settings">
              <i className="bi bi-sliders" />
            </button>
            {session ? (
              <button onClick={() => signOut()} className="p-2.5 rounded-full text-foreground/70 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all" aria-label="Logout">
                <i className="bi bi-box-arrow-right" />
              </button>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-full text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md">
                <i className="bi bi-person mr-1" /><span className="hidden sm:inline">Masuk</span>
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2.5 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-all md:hidden" aria-label="Menu">
              <i className={cn("bi", menuOpen ? "bi-x-lg" : "bi-list")} />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-20 left-4 right-4 glass-card p-4 flex flex-col gap-1 animate-fade-in">
            {NAV_ITEMS.filter((item) => !item.auth || session).map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={cn("px-4 py-3 rounded-xl text-sm font-medium transition-all", isActive(item.href) ? "bg-emerald-600 text-white" : "text-foreground/70 hover:text-foreground hover:bg-muted/50")}>
                <i className={cn(item.icon, "mr-3")} />{item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed top-20 right-4 z-50 glass-card p-4 w-64 animate-fade-in">
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
      <div className="h-20" />
    </>
  );
}
