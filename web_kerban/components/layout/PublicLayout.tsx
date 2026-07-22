"use client";
import { usePathname } from "next/navigation";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";
import TargetCursor from "@/components/reactbits/TargetCursor";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMapPage = pathname === "/map";

  if (isMapPage) {
    return (
      <div>
        <PublicNavbar />
        {children}
        <TargetCursor
          cursorColor="#4ade80"
          cursorColorOnTarget="#22c55e"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <TargetCursor
        cursorColor="#4ade80"
        cursorColorOnTarget="#22c55e"
      />
    </div>
  );
}
