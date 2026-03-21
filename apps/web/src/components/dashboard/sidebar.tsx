"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarCheck, Compass, Settings, Users } from "lucide-react";

const items = [
  { href: "/", icon: Users, label: "Lead Queue", exact: true },
  { href: "/#catalog", icon: BookOpen, label: "School Catalog" },
  { href: "/#bookings", icon: CalendarCheck, label: "Booking Requests" },
  { href: "/#settings", icon: Settings, label: "Settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Compass className="h-[18px] w-[18px] text-accent-foreground" />
          </div>
          <div className="leading-tight">
            <span className="block text-base font-extrabold tracking-[0.02em] text-sidebar-foreground">
              ETEST
            </span>
            <span className="mt-[-2px] block text-[11px] font-medium tracking-[0.08em] text-sidebar-foreground/45">
              COMPASS
            </span>
          </div>
        </div>
        <div className="px-5 pb-1 pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sidebar-foreground/30">
            Navigation
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3 pb-4">
          {items.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith("/");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] ${
                  active && item.label === "Lead Queue"
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon
                  className={`h-[17px] w-[17px] ${
                    active && item.label === "Lead Queue"
                      ? "text-accent-foreground"
                      : "text-sidebar-foreground/50"
                  }`}
                />
                <span className={active && item.label === "Lead Queue" ? "font-semibold" : "font-medium"}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-[10px] tracking-[0.02em] text-sidebar-foreground/25">
            © 2026 ETEST Vietnam
          </p>
        </div>
      </aside>
      <nav className="sticky top-0 z-30 flex items-center gap-2 overflow-x-auto border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
              item.label === "Lead Queue"
                ? "bg-accent text-accent-foreground"
                : "bg-white text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
