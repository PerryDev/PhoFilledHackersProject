// apps/web/src/components/dashboard/primitives.tsx
// Reusable visual primitives for the dashboard cards and controls.
// Keeps the route components compact and visually consistent.
"use client";

import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

export function SectionCard({
  title,
  icon: Icon,
  children,
  className = "",
}: Readonly<{
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
}>) {
  return (
    <section className={`overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm ${className}`}>
      <div className="flex items-center gap-2.5 border-b border-border bg-surface-soft px-5 py-3.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.02em] text-foreground">
          {title}
        </h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export function InfoRow({
  label,
  value,
  badge,
}: Readonly<{
  label: string;
  value: string;
  badge?: { label: string; className: string };
}>) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/50 py-2 last:border-0">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 text-right">
        <span className="text-[13px] font-medium text-foreground">{value}</span>
        {badge ? (
          <span className={`rounded-xl px-2 py-0.5 text-[11px] font-medium ${badge.className}`}>
            {badge.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function Pill({
  children,
  className = "",
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-[11px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
}: Readonly<{
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}>) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full border transition-colors ${
        checked ? "border-primary bg-primary" : "border-border bg-border"
      }`}
    >
      <span
        className={`absolute left-0.5 top-1/2 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-5 -translate-y-1/2" : "translate-x-0 -translate-y-1/2"
        }`}
      />
    </button>
  );
}
