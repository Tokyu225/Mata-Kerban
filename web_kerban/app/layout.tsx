import type { Metadata } from "next";
import "./globals.css";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageLoader } from "@/components/ui/PageLoader";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Kerban",
  description:
    "Sistem Informasi dan WebGIS interaktif untuk Dusun Kerban. Pantau laporan warga, peta interaktif, dan informasi desa.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme');
                  if (mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <SessionProvider>
          <ThemeProvider>
            <PageLoader />
            <PublicLayout>{children}</PublicLayout>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
