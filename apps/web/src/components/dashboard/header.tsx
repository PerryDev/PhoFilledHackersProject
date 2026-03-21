// apps/web/src/components/dashboard/header.tsx
// Sticky dashboard header aligned with the Figma dashboard interactions.
"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCircle, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { authClient } from "@/lib/auth-client";
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
  const router = useRouter();
  const { currentUser, language, setCurrentUser } = useDashboardSettings();
  const t = dashboardCopy[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const notificationPopoverRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  const profilePopoverRef = useRef<HTMLDivElement>(null);

  const profileName = currentUser?.name ?? "Student";
  const profileInitials = profileName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "TL";

  useEffect(() => {
    if (!showNotifications) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (notificationButtonRef.current?.contains(target) || notificationPopoverRef.current?.contains(target)) {
        return;
      }

      setShowNotifications(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [showNotifications]);

  useEffect(() => {
    if (!showProfile) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (profileButtonRef.current?.contains(target) || profilePopoverRef.current?.contains(target)) {
        return;
      }

      setShowProfile(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [showProfile]);

  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(10,34,64,0.18)] backdrop-blur">
      <div className="flex h-16 items-center justify-end gap-3 px-4 sm:px-6">
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={mobileOpen ? onCloseMenu : onOpenMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary-foreground/90 transition-colors hover:bg-white/15 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden sm:block">
            <button
              ref={notificationButtonRef}
              type="button"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={() => {
                setShowNotifications((current) => !current);
                setShowProfile(false);
              }}
              className={`relative rounded-xl p-2 transition-colors ${
                showNotifications ? "bg-white/15" : "hover:bg-white/10"
              }`}
            >
              <Bell className="h-5 w-5 text-primary-foreground/80" />
            </button>

            {showNotifications ? (
              <div
                ref={notificationPopoverRef}
                className="absolute right-0 top-full z-50 mt-2.5 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-lg"
              >
                <div className="border-b border-border px-4 py-3">
                  <p className="text-base font-bold text-card-foreground">Notifications</p>
                </div>
                <div className="flex flex-col items-center justify-center px-6 py-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="mb-1 text-sm font-medium text-card-foreground">No new notifications</p>
                  <p className="text-xs text-muted-foreground">You're all caught up!</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative hidden sm:block">
            <div
              ref={profileButtonRef}
              onClick={() => {
                setShowProfile((current) => !current);
                setShowNotifications(false);
              }}
              className="group flex cursor-pointer items-center gap-2 border-l border-white/15 pl-4"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-accent-foreground">
                {profileInitials}
              </div>
              <div className="leading-tight">
                <p className="text-[13px] font-semibold text-primary-foreground">{profileName}</p>
                <p className="text-[11px] text-primary-foreground/50">
                  {currentUser?.email ?? "Authenticated user"}
                </p>
              </div>
              <ChevronDown
                className={`ml-1 h-4 w-4 text-primary-foreground/50 transition-all group-hover:text-primary-foreground ${
                  showProfile ? "rotate-180 text-primary-foreground" : ""
                }`}
              />
            </div>

            {showProfile ? (
              <div
                ref={profilePopoverRef}
                className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-border bg-card shadow-lg"
              >
                <div className="p-1">
                  <button
                    type="button"
                    onClick={() => {
                      startTransition(async () => {
                        await authClient.signOut();
                        setCurrentUser(null);
                        setShowProfile(false);
                        router.replace("/login");
                        router.refresh();
                      });
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[#F1F5F9] dark:hover:bg-white/5"
                  >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[14px] font-medium text-foreground">Sign out</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
