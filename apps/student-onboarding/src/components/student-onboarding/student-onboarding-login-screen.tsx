// apps/student-onboarding/src/components/student-onboarding/student-onboarding-login-screen.tsx
// Login shell matching the Figma app structure before authentication.
// Renders the shared global header above the auth wall to keep the public route aligned with the Make flow.
"use client";

import { useState } from "react";
import { AuthWall } from "./auth-wall";
import { GlobalHeader } from "./global-header";
import type { Locale, ThemeMode } from "@/lib/onboarding-data";

export function StudentOnboardingLoginScreen() {
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<ThemeMode>("light");

  return (
    <div className="flex min-h-screen flex-col">
      <GlobalHeader
        locale={locale}
        onLocaleChange={setLocale}
        theme={theme}
        onThemeChange={setTheme}
        viewer={null}
      />
      <AuthWall locale={locale} />
    </div>
  );
}
