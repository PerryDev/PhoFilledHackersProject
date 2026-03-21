// apps/web/src/components/dashboard/recommendation-list.tsx
// Recommendation cards for the student detail route.
// Keeps the heavier school blocks isolated from the page shell and profile panels.
"use client";

import { CheckCircle2, Clock, ExternalLink, MapPin, Shield, Target, TrendingUp, XCircle } from "lucide-react";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { formatHandOffDate, formatTuitionPair, type StudentProfile } from "@/lib/dashboard-data";
import { useDashboardSettings } from "@/components/dashboard/providers";
import { Pill, SectionCard } from "@/components/dashboard/primitives";

const confidenceStyles: Record<StudentProfile["recommendations"]["reach"][number]["confidenceLevel"], string> = {
  Low: "bg-warning text-warning-foreground",
  Medium: "bg-info text-info-foreground",
  High: "bg-success text-success-foreground",
};

const budgetStyles: Record<StudentProfile["recommendations"]["reach"][number]["budgetFit"], string> = {
  "Within Budget": "bg-success text-success-foreground",
  Stretch: "bg-warning text-warning-foreground",
  "Over Budget": "bg-destructive/15 text-destructive",
};

export function RecommendationSection({ student }: Readonly<{ student: StudentProfile }>) {
  const { language } = useDashboardSettings();
  const t = dashboardCopy[language];

  return (
    <SectionCard title={t.detailRecommendationsTitle} icon={Target} className="mb-2">
      <div className="space-y-6">
        {(["reach", "target", "safety"] as const).map((tier) => {
          const schools = student.recommendations[tier];

          if (schools.length === 0) {
            return null;
          }

          return (
            <div key={tier}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tier === "reach" ? "var(--reach)" : tier === "target" ? "var(--target)" : "var(--safety)" }}
                />
                <h3 className="text-sm font-semibold capitalize text-foreground">
                  {tier} {t.detailSchools}
                </h3>
                <span className="text-sm text-muted-foreground">({schools.length})</span>
              </div>

              <div className="space-y-3">
                {schools.map((school) => (
                  <article
                    key={school.schoolName}
                    className="rounded-[1.5rem] border border-border p-4"
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor:
                        tier === "reach" ? "var(--reach)" : tier === "target" ? "var(--target)" : "var(--safety)",
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{school.schoolName}</p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {school.city}, {school.state}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Pill className={confidenceStyles[school.confidenceLevel]}>
                          {school.confidenceLevel} {t.detailConfidence}
                        </Pill>
                        <Pill className="bg-deadline text-deadline-foreground">
                          <Clock className="mr-1 inline h-3 w-3" />
                          {school.deadlinePressure}
                        </Pill>
                      </div>
                    </div>

                    <div className="mb-3 grid gap-3 rounded-2xl bg-surface-soft p-3 sm:grid-cols-2 xl:grid-cols-4">
                      <Metric label={t.detailCurrentOutlook} value={school.currentOutlook} />
                      <Metric label={t.detailProjectedOutlook} value={school.projectedOutlook} />
                      <Metric label={t.detailTuition} value={formatTuitionPair(school)} />
                      <div>
                        <span className="block text-[10px] font-medium uppercase text-muted-foreground">
                          {t.detailBudgetFit}
                        </span>
                        <Pill className={budgetStyles[school.budgetFit]}>{school.budgetFit}</Pill>
                      </div>
                    </div>

                    {school.scholarshipAvailabilityFlag && school.scholarshipNotes ? (
                      <div className="mb-3 flex items-start gap-1.5 rounded-xl bg-scholarship px-3 py-2 text-sm text-scholarship-foreground">
                        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>{school.scholarshipNotes}</span>
                      </div>
                    ) : null}

                    {school.reasonsForFit.length > 0 ? (
                      <TagGroup title={t.detailFitReasons} icon={CheckCircle2} tone="info" items={school.reasonsForFit} />
                    ) : null}
                    {school.topBlockers.length > 0 ? (
                      <TagGroup title={t.detailBlockers} icon={XCircle} tone="danger" items={school.topBlockers} />
                    ) : null}
                    {school.nextActions.length > 0 ? (
                      <TagGroup title={t.detailNextActions} icon={TrendingUp} tone="warning" items={school.nextActions} />
                    ) : null}

                    <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
                      <span>
                        {t.detailVerified}: {formatHandOffDate(school.lastVerifiedAt)}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {school.sourceUrls.map((url, index) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {t.detailSource} {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function Metric({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div>
      <span className="block text-[10px] font-medium uppercase text-muted-foreground">{label}</span>
      <p className="mt-0.5 text-[12px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function TagGroup({
  title,
  icon: Icon,
  tone,
  items,
}: Readonly<{
  title: string;
  icon: typeof CheckCircle2;
  tone: "info" | "danger" | "warning";
  items: string[];
}>) {
  const toneClass =
    tone === "info"
      ? "bg-info text-info-foreground"
      : tone === "danger"
        ? "bg-destructive/15 text-destructive"
        : "bg-warning text-warning-foreground";

  return (
    <div className="mb-2">
      <span className="text-xs font-semibold uppercase text-muted-foreground">{title}</span>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Pill key={item} className={toneClass}>
            <Icon className="mr-1 h-3 w-3" />
            {item}
          </Pill>
        ))}
      </div>
    </div>
  );
}
