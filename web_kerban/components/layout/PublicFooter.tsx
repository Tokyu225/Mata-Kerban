import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <i className="bi bi-geo-alt-fill text-2xl text-primary-600 dark:text-primary-400" />
              <span className="font-display font-bold text-lg">DUSUN KERBAN</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Sistem Informasi & WebGIS interaktif untuk pelayanan dan keterbukaan informasi Dusun Kerban.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Tautan Cepat</h4>
            <div className="grid grid-cols-2 gap-2">
              {[{ href: "/", label: "Beranda" }, { href: "/map", label: "Peta Interaktif" }, { href: "/lapor", label: "Lapor Warga" }, { href: "/quiz", label: "Quiz" }, { href: "/dashboard", label: "Dashboard" }].map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Kontak</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><i className="bi bi-geo-alt" /> Dusun Kerban, Desa setempat</p>
              <p className="flex items-center gap-2"><i className="bi bi-envelope" /> info@dusunkerban.my.id</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dusun Kerban. v2.0 · Next.js · HNDH</p>
        </div>
      </div>
    </footer>
  );
}
