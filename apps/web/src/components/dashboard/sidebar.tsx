// apps/web/src/components/dashboard/sidebar.tsx
// Responsive navigation rail aligned with the Figma dashboard shell.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Settings, Users, X } from "lucide-react";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { useDashboardSettings } from "@/components/dashboard/providers";

export function Sidebar({
  mobileOpen,
  onClose,
}: Readonly<{
  mobileOpen: boolean;
  onClose: () => void;
}>) {
  const pathname = usePathname();
  const { language } = useDashboardSettings();
  const t = dashboardCopy[language];

  const navItems = [
    {
      href: "/profile",
      icon: Compass,
      label: t.navStudentProfile,
      active: pathname.startsWith("/profile"),
    },
    {
      href: "/",
      icon: Users,
      label: t.navLeadQueue,
      active: pathname === "/" || pathname.startsWith("/student/"),
    },
    {
      href: "/settings",
      icon: Settings,
      label: t.navSettings,
      active: pathname.startsWith("/settings"),
    },
  ] as const;

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
              <Compass className="h-[18px] w-[18px] text-accent-foreground" />
            </div>
            <div className="leading-tight">
              <span className="block text-[16px] font-extrabold tracking-[0.02em] text-sidebar-foreground">
                ETEST
              </span>
              <span className="mt-[-2px] block text-[11px] font-medium uppercase tracking-[0.08em] text-sidebar-foreground/45">
                COMPASS
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-sidebar-border bg-white/5 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="px-5 pt-5 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sidebar-foreground/30">
            {t.navLabel}
          </p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 pb-4 pt-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors ${
                  item.active
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <Icon className={`h-[17px] w-[17px] ${item.active ? "text-accent-foreground" : "text-sidebar-foreground/50"}`} />
                <span className={item.active ? "font-semibold" : "font-medium"}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-sidebar-foreground/25">
            © 2026 ETEST Vietnam
          </p>
        </div>
      </aside>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
        />
      ) : null}
    </>
  );
}
