// apps/web/src/components/dashboard/providers.tsx
// Shared dashboard state for language, theme, and search.
// Keeps the shell interactive while the routes stay route-driven and simple.
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { DashboardLanguage } from "@/lib/dashboard-copy";

type ThemeMode = "light" | "dark";

type DashboardSettings = {
  language: DashboardLanguage;
  setLanguage: (language: DashboardLanguage) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const DashboardSettingsContext = createContext<DashboardSettings | null>(null);

export function DashboardProviders({ children }: Readonly<{ children: ReactNode }>) {
  const [language, setLanguage] = useState<DashboardLanguage>("en");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.localStorage.setItem("etest-dashboard-language", language);
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem("etest-dashboard-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <DashboardSettingsContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </DashboardSettingsContext.Provider>
  );
}

export function useDashboardSettings() {
  const context = useContext(DashboardSettingsContext);

  if (!context) {
    throw new Error("useDashboardSettings must be used within DashboardProviders");
  }

  return context;
}
