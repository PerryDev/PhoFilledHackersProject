"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import {
  initialProfileDraft,
  requiredProfileFields,
  type Locale,
  type ProfileField,
  type StudentProfileDraft,
  type ThemeMode,
} from "@/lib/onboarding-data";
import { AuthWall } from "./auth-wall";
import { ChatAssistant } from "./chat-assistant";
import { GlobalHeader, type Viewer } from "./global-header";
import { LiveProfile } from "./live-profile";

function resolveTheme(theme: ThemeMode) {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return theme;
}

export function StudentOnboardingApp() {
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [profile, setProfile] = useState<StudentProfileDraft>(initialProfileDraft);
  const [recentlyUpdated, setRecentlyUpdated] = useState<ProfileField | null>(null);
  const [progressCurrent, setProgressCurrent] = useState(0);
  const [progressTotal, setProgressTotal] = useState(1);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  useEffect(() => {
    const resolvedTheme = resolveTheme(theme);
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");

    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.classList.toggle("dark", mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  useEffect(() => {
    if (!recentlyUpdated) {
      return;
    }

    const timeoutId = window.setTimeout(() => setRecentlyUpdated(null), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [recentlyUpdated]);

  const filledCount = Object.values(profile).filter((value) => value.length > 0).length;
  const totalCount = Object.keys(profile).length;
  const isComplete = requiredProfileFields.every((field) => profile[field].trim().length > 0);

  function resetProfile(nextViewer?: Viewer | null) {
    setProfile({
      ...initialProfileDraft,
      fullName: nextViewer?.name ?? "",
    });
    setRecentlyUpdated(null);
    setProgressCurrent(0);
    setProgressTotal(1);
  }

  function handleAuthenticated(nextViewer: Viewer) {
    setViewer(nextViewer);
    resetProfile(nextViewer);
  }

  function handleLogout() {
    setViewer(null);
    resetProfile(null);
    setMobileProfileOpen(false);
  }

  function handleAnswer(field: ProfileField, value: string) {
    setProfile((existing) => ({
      ...existing,
      [field]: value,
    }));
    setRecentlyUpdated(field);
  }

  function handleLocaleChange(nextLocale: Locale) {
    setLocale(nextLocale);

    if (viewer) {
      resetProfile(viewer);
    }
  }

  if (!viewer) {
    return (
      <div className="min-h-screen">
        <GlobalHeader
          locale={locale}
          onLocaleChange={handleLocaleChange}
          theme={theme}
          onThemeChange={setTheme}
          viewer={null}
          onLogin={() =>
            handleAuthenticated({
              name: "Minh Nguyen",
              email: "minh.nguyen@gmail.com",
            })
          }
        />
        <AuthWall locale={locale} onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <GlobalHeader
        locale={locale}
        onLocaleChange={handleLocaleChange}
        theme={theme}
        onThemeChange={setTheme}
        viewer={viewer}
        onLogout={handleLogout}
      />

      <div className="hidden min-h-0 flex-1 md:flex">
        <div className="w-[40%] min-w-[360px] border-r border-border">
          <ChatAssistant
            key={`${locale}-${viewer.name}`}
            locale={locale}
            userName={viewer.name}
            onAnswer={handleAnswer}
            onProgressChange={(current, total) => {
              setProgressCurrent(current);
              setProgressTotal(total);
            }}
            onFinished={() => undefined}
          />
        </div>
        <div className="relative flex-1">
          <LiveProfile
            locale={locale}
            profile={profile}
            recentlyUpdated={recentlyUpdated}
            filledCount={filledCount}
            totalCount={totalCount}
            isComplete={isComplete}
          />
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col md:hidden">
        <ChatAssistant
          key={`${locale}-${viewer.name}`}
          locale={locale}
          userName={viewer.name}
          onAnswer={handleAnswer}
          onProgressChange={(current, total) => {
            setProgressCurrent(current);
            setProgressTotal(total);
          }}
          onFinished={() => undefined}
        />

        <button
          type="button"
          onClick={() => setMobileProfileOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
        >
          <ClipboardList className="h-4 w-4" />
          <span className="text-xs">
            {progressCurrent}/{progressTotal}
          </span>
        </button>

        <div
          className={`fixed inset-0 z-50 bg-black/25 transition ${mobileProfileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          onClick={() => setMobileProfileOpen(false)}
        />
        <div
          className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] rounded-t-[24px] border border-border bg-card transition-transform duration-300 ${mobileProfileOpen ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted" />
          <div className="px-5 py-4 text-sm text-foreground">Profile</div>
          <div className="relative h-[70vh]">
            <LiveProfile
              locale={locale}
              profile={profile}
              recentlyUpdated={recentlyUpdated}
              filledCount={filledCount}
              totalCount={totalCount}
              isComplete={isComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
