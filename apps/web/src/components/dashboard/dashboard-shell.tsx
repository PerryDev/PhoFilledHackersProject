// apps/web/src/components/dashboard/dashboard-shell.tsx
// Shared dashboard frame with sidebar, header, and mobile drawer.
// Preserves state across routes while matching the Figma admin shell.
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";

export function DashboardShell({ children }: Readonly<{ children: ReactNode }>) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="relative min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-[240px]">
        <Header
          onOpenMenu={() => setMobileOpen(true)}
          mobileOpen={mobileOpen}
          onCloseMenu={() => setMobileOpen(false)}
        />

        <main className="px-4 py-6 sm:px-6 lg:px-6 lg:py-6">
          <div className="mx-auto w-full max-w-[1360px]">{children}</div>
        </main>
      </div>

    </div>
  );
}
