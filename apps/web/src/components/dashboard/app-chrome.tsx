// apps/web/src/components/dashboard/app-chrome.tsx
// Route-aware wrapper for the dashboard shell.
// Keeps login and profile pages visually separate from the counselor dashboard chrome.

"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { DashboardShell } from "./dashboard-shell";

const bareRoutes = new Set(["/login", "/profile"]);

export function AppChrome({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  if (bareRoutes.has(pathname)) {
    return <>{children}</>;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
