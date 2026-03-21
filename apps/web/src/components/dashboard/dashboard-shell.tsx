// apps/web/src/components/dashboard/dashboard-shell.tsx
// Shared dashboard frame with sidebar, header, and mobile drawer.
// Preserves state across routes while matching the Figma admin shell.
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { useDashboardSettings } from "@/components/dashboard/providers";
import { Sidebar } from "@/components/dashboard/sidebar";

export function DashboardShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useDashboardSettings();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoginRoute = pathname === "/login";

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated && !isLoginRoute) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isLoginRoute) {
      router.replace("/");
    }
  }, [isAuthenticated, isHydrated, isLoginRoute, router]);

  if (!isHydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:ml-[240px]">
        <Header
          onOpenMenu={() => setMobileOpen(true)}
          mobileOpen={mobileOpen}
          onCloseMenu={() => setMobileOpen(false)}
        />

        <main className="px-4 py-6 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
