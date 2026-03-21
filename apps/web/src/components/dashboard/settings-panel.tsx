// apps/web/src/components/dashboard/settings-panel.tsx
// Settings route content for language, theme, notifications, and account details.
// Reuses the shared dashboard state so route changes preserve preferences.
"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Globe, Moon, Palette, Save, Shield, Sun } from "lucide-react";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { useDashboardSettings } from "@/components/dashboard/providers";
import { Pill, SectionCard, ToggleSwitch } from "@/components/dashboard/primitives";

export function SettingsPanel() {
  const { language, setLanguage, theme, setTheme } = useDashboardSettings();
  const t = dashboardCopy[language];
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    newLeads: true,
    bookingUpdates: true,
    weeklyDigest: false,
    systemAlerts: true,
  });

  useEffect(() => {
    if (!saved) {
      return;
    }

    const timeout = window.setTimeout(() => setSaved(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  return (
    <div className="max-w-4xl space-y-6">
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {t.navSettings}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t.settingsTitle}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          {t.settingsDescription}
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title={t.settingsLanguageTitle} icon={Globe}>
          <p className="mb-3 text-sm text-muted-foreground">{t.settingsLanguageHelp}</p>
          <div className="inline-flex rounded-xl border border-border bg-surface-soft p-1">
            {(
              [
                { value: "en" as const, label: t.settingsLangEn },
                { value: "vi" as const, label: t.settingsLangVi },
              ]
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLanguage(option.value)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  language === option.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t.settingsThemeTitle} icon={Palette}>
          <p className="mb-3 text-sm text-muted-foreground">{t.settingsThemeHelp}</p>
          <div className="inline-flex rounded-xl border border-border bg-surface-soft p-1">
            {(
              [
                { value: "light" as const, label: t.settingsThemeLight, icon: Sun },
                { value: "dark" as const, label: t.settingsThemeDark, icon: Moon },
              ]
            ).map((option) => {
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    theme === option.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title={t.settingsNotificationsTitle} icon={Bell}>
          <p className="mb-3 text-sm text-muted-foreground">{t.settingsNotificationsHelp}</p>
          <div className="space-y-3">
            {(
              [
                ["newLeads", t.settingsNotifNewLeads],
                ["bookingUpdates", t.settingsNotifBooking],
                ["weeklyDigest", t.settingsNotifWeekly],
                ["systemAlerts", t.settingsNotifSystem],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-soft px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{key === "newLeads" ? "Queue changes" : key === "bookingUpdates" ? "Schedule updates" : key === "weeklyDigest" ? "Monday digest" : "Security notices"}</p>
                </div>
                <ToggleSwitch
                  checked={notifications[key]}
                  onChange={(value) => setNotifications((current) => ({ ...current, [key]: value }))}
                  label={label}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t.settingsAccountTitle} icon={Shield}>
          <p className="mb-4 text-sm text-muted-foreground">{t.settingsAccountHelp}</p>
          <div className="space-y-4">
            <Field label={t.settingsDisplayName} defaultValue="Thanh Le" />
            <Field label={t.settingsEmail} defaultValue="thanh.le@etest.edu.vn" type="email" />
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-surface-soft px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{t.settingsRole}</p>
                <p className="text-xs text-muted-foreground">Senior Counselor</p>
              </div>
              <Pill className="bg-primary/10 text-primary">{t.settingsManaged}</Pill>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setSaved(true)}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors ${
            saved ? "bg-success text-success-foreground" : "bg-accent text-accent-foreground hover:opacity-90"
          }`}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              {t.settingsSaved}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t.settingsSave}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  defaultValue,
  type = "text",
}: Readonly<{
  label: string;
  defaultValue: string;
  type?: string;
}>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        defaultValue={defaultValue}
        suppressHydrationWarning
        className="h-11 w-full rounded-xl border border-border bg-surface-soft px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
      />
    </label>
  );
}
