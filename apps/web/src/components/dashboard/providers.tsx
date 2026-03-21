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
  profileName: string;
  setProfileName: (value: string) => void;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
  isHydrated: boolean;
};

const DashboardSettingsContext = createContext<DashboardSettings | null>(null);

export function DashboardProviders({ children }: Readonly<{ children: ReactNode }>) {
  const [language, setLanguage] = useState<DashboardLanguage>("en");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileName, setProfileName] = useState("Thanh Le");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("etest-dashboard-language") as DashboardLanguage | null;
    const savedTheme = window.localStorage.getItem("etest-dashboard-theme") as ThemeMode | null;
    const savedProfileName = window.localStorage.getItem("etest-dashboard-profile-name");
    const savedAuthState = window.localStorage.getItem("etest-dashboard-authenticated");

    if (savedLanguage === "en" || savedLanguage === "vi") {
      setLanguage(savedLanguage);
    }

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }

    if (savedProfileName?.trim()) {
      setProfileName(savedProfileName);
    }

    if (savedAuthState === "true" || savedAuthState === "false") {
      setIsAuthenticated(savedAuthState === "true");
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("etest-dashboard-language", language);
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem("etest-dashboard-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("etest-dashboard-profile-name", profileName);
  }, [profileName]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem("etest-dashboard-authenticated", String(isAuthenticated));
  }, [isAuthenticated, isHydrated]);

  const signIn = () => setIsAuthenticated(true);
  const signOut = () => setIsAuthenticated(false);

  return (
    <DashboardSettingsContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        searchTerm,
        setSearchTerm,
        profileName,
        setProfileName,
        isAuthenticated,
        signIn,
        signOut,
        isHydrated,
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
