// apps/web/src/components/dashboard/sidebar.tsx
// Responsive navigation rail with route highlights and seeded student shortcuts.
// Keeps the shell close to the Figma prototype without inventing extra app routes.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Settings, Users, X } from "lucide-react";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { students } from "@/lib/dashboard-data";
import { useDashboardSettings } from "@/components/dashboard/providers";

const recentStudents = students.slice(0, 4);

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
        className={`fixed inset-y-0 left-0 z-50 w-[240px] border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:flex`}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <div className="leading-tight">
                <p className="text-[16px] font-extrabold tracking-[0.02em]">ETEST</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-sidebar-foreground/45">
                  Compass
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-sidebar-border bg-white/5 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent lg:hidden"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="px-5 pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sidebar-foreground/30">
              {t.navLabel}
            </p>
          </div>

          <nav className="flex flex-col gap-1 px-3 py-4">
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
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-5 pb-3 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sidebar-foreground/30">
              Recent students
            </p>
          </div>

          <div className="flex-1 space-y-2 overflow-auto px-3 pb-3">
            {recentStudents.map((student) => (
              <Link
                key={student.id}
                href={`/student/${student.id}`}
                onClick={onClose}
                className="block rounded-2xl border border-sidebar-border/70 bg-white/5 px-3 py-3 text-[12px] text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
              >
                <p className="font-semibold text-sidebar-foreground">{student.name}</p>
                <p className="mt-0.5 text-sidebar-foreground/45">{student.intendedMajors.join(" · ")}</p>
              </Link>
            ))}
          </div>

          <div className="border-t border-sidebar-border px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.12em] text-sidebar-foreground/25">
              © 2026 ETEST Vietnam
            </p>
          </div>
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
