// apps/web/src/components/dashboard/settings-panel.tsx
// Settings route content aligned to the Figma dashboard settings design.
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Bell, Check, Globe, Moon, Palette, Save, Shield, Sun, type LucideIcon } from "lucide-react";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { useDashboardSettings } from "@/components/dashboard/providers";
import { Pill, ToggleSwitch } from "@/components/dashboard/primitives";

type NotificationKey = "newLeads" | "weeklyDigest" | "systemAlerts";

function SettingsSectionCard({
  icon: Icon,
  title,
  description,
  children,
}: Readonly<{
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}>) {
  return (
    <section className="overflow-hidden rounded-[1.65rem] border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b border-border bg-surface-soft px-6 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-[15px] w-[15px] text-primary" />
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-foreground">{title}</h3>
          <p className="text-[12px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

export function SettingsPanel() {
  const { language, setLanguage, theme, setTheme, profileName, setProfileName } = useDashboardSettings();
  const t = dashboardCopy[language];
  const [saved, setSaved] = useState(false);
  const [draftProfileName, setDraftProfileName] = useState(profileName);
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    newLeads: true,
    weeklyDigest: false,
    systemAlerts: true,
  });

  useEffect(() => {
    if (!saved) {
      return;
    }

    const timeout = window.setTimeout(() => setSaved(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  useEffect(() => {
    setDraftProfileName(profileName);
  }, [profileName]);

  const notificationItems: ReadonlyArray<{ key: NotificationKey; label: string; subLabel: string }> = [
    { key: "newLeads", label: t.settingsNotifNewLeads, subLabel: "Get notified when a new student is added to your queue." },
    { key: "weeklyDigest", label: t.settingsNotifWeekly, subLabel: "A summary email of your queue activity every Monday." },
    { key: "systemAlerts", label: t.settingsNotifSystem, subLabel: "Important notices about your account and platform health." },
  ];

  return (
    <div className="max-w-[48rem]">
      <section className="mb-7">
        <h1 className="text-[24px] font-bold text-foreground">
          {t.settingsTitle}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t.settingsDescription}</p>
      </section>

      <div className="space-y-4">
        <SettingsSectionCard
          icon={Globe}
          title={t.settingsLanguageTitle}
          description={t.settingsLanguageHelp}
        >
          <p className="mb-3 text-[13px] text-muted-foreground">{t.settingsLanguageLabel}</p>
          <div className="inline-flex gap-1 rounded-xl border border-border bg-surface-soft p-1">
            {([
              { value: "en" as const, label: t.settingsLangEn, short: "EN" },
              { value: "vi" as const, label: t.settingsLangVi, short: "VI" },
            ]).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLanguage(option.value)}
                className={`relative flex items-center gap-2 rounded-lg px-5 py-2 text-[13px] transition-all ${
                  language === option.value
                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                    : "font-medium text-muted-foreground hover:bg-border/50 hover:text-foreground"
                }`}
              >
                {language === option.value ? <Check className="h-[13px] w-[13px] text-primary-foreground/80" /> : null}
                <span>
                  {option.label}
                  <span
                    className={`ml-1.5 text-[11px] ${
                      language === option.value ? "text-primary-foreground/60" : "text-muted-foreground/60"
                    }`}
                  >
                    ({option.short})
                  </span>
                </span>
              </button>
            ))}
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          icon={Palette}
          title={t.settingsThemeTitle}
          description={t.settingsThemeHelp}
        >
          <p className="mb-3 text-[13px] text-muted-foreground">{t.settingsThemeLabel}</p>
          <div className="inline-flex gap-1 rounded-xl border border-border bg-surface-soft p-1">
            {([
              { value: "light" as const, label: t.settingsThemeLight, icon: Sun },
              { value: "dark" as const, label: t.settingsThemeDark, icon: Moon },
            ]).map((option) => {
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] transition-all ${
                    theme === option.value
                      ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                      : "font-medium text-muted-foreground hover:bg-border/50 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${theme === option.value ? "text-primary-foreground/80" : ""}`} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          icon={Bell}
          title={t.settingsNotificationsTitle}
          description={t.settingsNotificationsHelp}
        >
          <div className="space-y-0">
            {notificationItems.map((item, index) => (
              <div
                key={item.key}
                className={`flex items-center justify-between gap-4 py-3.5 ${
                  index < notificationItems.length - 1 ? "border-b border-border/60" : ""
                }`}
              >
                <div className="pr-6">
                  <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{item.subLabel}</p>
                </div>
                <ToggleSwitch
                  checked={notifications[item.key]}
                  onChange={(value) => setNotifications((current) => ({ ...current, [item.key]: value }))}
                  label={item.label}
                />
              </div>
            ))}
          </div>
        </SettingsSectionCard>

        <SettingsSectionCard
          icon={Shield}
          title={t.settingsAccountTitle}
          description={t.settingsAccountHelp}
        >
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                {t.settingsDisplayName}
              </label>
              <input
                type="text"
                value={draftProfileName}
                onChange={(event) => setDraftProfileName(event.target.value)}
                suppressHydrationWarning
                className="h-11 w-full rounded-xl border border-border bg-surface-soft px-3.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                {t.settingsEmail}
              </label>
              <input
                type="email"
                defaultValue="thanh.le@etest.edu.vn"
                suppressHydrationWarning
                className="h-11 w-full rounded-xl border border-border bg-surface-soft px-3.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
                {t.settingsRole}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value="Senior Counselor"
                  readOnly
                  className="h-11 flex-1 rounded-xl border border-border bg-muted px-3.5 text-[13px] text-muted-foreground"
                />
                <Pill className="bg-primary/10 text-primary">{t.settingsManaged}</Pill>
              </div>
            </div>
          </div>
        </SettingsSectionCard>

        <div className="flex justify-end pb-6 pt-2">
          <button
            type="button"
            onClick={() => {
              const nextProfileName = draftProfileName.trim() || "Thanh Le";
              setDraftProfileName(nextProfileName);
              setProfileName(nextProfileName);
              setSaved(true);
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm transition-all ${
              saved
                ? "bg-success text-success-foreground"
                : "bg-accent text-accent-foreground hover:opacity-90 active:opacity-80"
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
    </div>
  );
}
