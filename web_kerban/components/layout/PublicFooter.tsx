import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <i className="bi bi-geo-alt-fill text-2xl text-primary-600 dark:text-primary-400" />
              <span className="font-display font-bold text-lg">KERBAN</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">Platform WebGIS interaktif untuk pelayanan dan keterbukaan informasi Dusun Kerban.</p>
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
              <a
                href="https://www.google.com/maps/search/?api=1&query_place_id=ChIJAaNB-8-Nei4R1IToJK5Jo9I"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <i className="bi bi-geo-alt mt-0.5" />
                <span>
                  Dusun Kerban, Sumberarum, Kec. Tempuran,
                  <br />
                  Kab. Magelang, Jawa Tengah
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground space-y-1">
          <p>&copy; 2026 Dusun Kerban. All Rights Reserved.</p>
          <p>Website dikelola oleh Pengurus Dusun Kerban &amp; Tim PKL UGM 2026.</p>
        </div>
      </div>
    </footer>
  );
}
