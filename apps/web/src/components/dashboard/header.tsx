// apps/web/src/components/dashboard/header.tsx
// Sticky dashboard header with search, theme, and language controls.
// Mirrors the Figma prototype while using the shared dashboard state.
"use client";

import { Bell, Menu, Moon, Search, Sun, X } from "lucide-react";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { useDashboardSettings } from "@/components/dashboard/providers";

export function Header({
  onOpenMenu,
  mobileOpen,
  onCloseMenu,
}: Readonly<{
  onOpenMenu: () => void;
  mobileOpen: boolean;
  onCloseMenu: () => void;
}>) {
  const { language, setLanguage, theme, setTheme, searchTerm, setSearchTerm } = useDashboardSettings();
  const t = dashboardCopy[language];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(10,34,64,0.18)] backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={mobileOpen ? onCloseMenu : onOpenMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary-foreground/90 transition-colors hover:bg-white/15 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="relative hidden flex-1 min-w-[240px] max-w-[420px] lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/40" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t.searchPlaceholder}
            suppressHydrationWarning
            className="h-10 w-full rounded-xl border border-white/15 bg-white/10 pl-10 pr-4 text-[13px] text-primary-foreground placeholder:text-primary-foreground/40 outline-none transition-colors focus:border-accent/70 focus:bg-white/15"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center rounded-xl border border-white/15 bg-white/10 p-1 sm:flex">
            {(["en", "vi"] as const).map((nextLanguage) => (
              <button
                key={nextLanguage}
                type="button"
                onClick={() => setLanguage(nextLanguage)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  language === nextLanguage ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                {nextLanguage.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-white/15"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{theme === "dark" ? t.commonLight : t.commonDark}</span>
          </button>

          <button
            type="button"
            className="relative hidden h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-primary-foreground/85 transition-colors hover:bg-white/15 sm:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-primary" />
          </button>

          <div className="hidden items-center gap-2 border-l border-white/15 pl-3 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-accent-foreground">
              TL
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold">Thanh Le</p>
              <p className="text-[11px] text-primary-foreground/55">Senior Counselor</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-3 lg:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/40" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t.searchPlaceholder}
            suppressHydrationWarning
            className="h-10 w-full rounded-xl border border-white/15 bg-white/10 pl-10 pr-4 text-[13px] text-primary-foreground placeholder:text-primary-foreground/40 outline-none"
          />
        </div>
      </div>
    </header>
  );
}
