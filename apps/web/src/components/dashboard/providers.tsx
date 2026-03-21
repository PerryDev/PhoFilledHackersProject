// apps/web/src/components/dashboard/providers.tsx
// Shared dashboard state for language, theme, search, and session-backed user info.
// Keeps UI preferences client-side while auth state comes from the server session.
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

type DashboardUser = {
  id: string;
  name: string;
  email: string;
} | null;

type DashboardSettings = {
  language: DashboardLanguage;
  setLanguage: (language: DashboardLanguage) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  currentUser: DashboardUser;
  setCurrentUser: (value: DashboardUser) => void;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

const DashboardSettingsContext = createContext<DashboardSettings | null>(null);

export function DashboardProviders({
  children,
  initialUser,
}: Readonly<{
  children: ReactNode;
  initialUser: DashboardUser;
}>) {
  const [language, setLanguage] = useState<DashboardLanguage>("en");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<DashboardUser>(initialUser);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(
      "etest-dashboard-language",
    ) as DashboardLanguage | null;
    const savedTheme = window.localStorage.getItem(
      "etest-dashboard-theme",
    ) as ThemeMode | null;

    if (savedLanguage === "en" || savedLanguage === "vi") {
      setLanguage(savedLanguage);
    }

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
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

  return (
    <DashboardSettingsContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        searchTerm,
        setSearchTerm,
        currentUser,
        setCurrentUser,
        isAuthenticated: currentUser !== null,
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
    throw new Error(
      "useDashboardSettings must be used within DashboardProviders",
    );
  }

  return context;
}
