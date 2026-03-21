// apps/web/src/components/dashboard/lead-queue.tsx
// Lead queue route content with search, stage filtering, and seeded student rows.
// Uses the shared search state from the dashboard shell to keep the header and page in sync.
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Filter, Search } from "lucide-react";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { formatHandOffDate, students, type StudentProfile } from "@/lib/dashboard-data";
import { useDashboardSettings } from "@/components/dashboard/providers";
import { Pill } from "@/components/dashboard/primitives";

const stageStyles: Record<StudentProfile["studentStage"], string> = {
  "Early Builder": "bg-info text-info-foreground",
  "Pre-Applicant": "bg-warning text-warning-foreground",
  "Active Applicant": "bg-success text-success-foreground",
};

export function LeadQueue() {
  const { language } = useDashboardSettings();
  const t = dashboardCopy[language];
  const stageLabels: Record<StudentProfile["studentStage"], string> = {
    "Early Builder": t.stageEarlyBuilder,
    "Pre-Applicant": t.stagePreApplicant,
    "Active Applicant": t.stageActiveApplicant,
  };

  const [stageFilter, setStageFilter] = useState<"All" | StudentProfile["studentStage"]>("All");
  const [search, setSearch] = useState("");
  const normalizedQuery = search.trim().toLowerCase();

  const filteredStudents = students.filter((student) => {
    const matchesStage = stageFilter === "All" || student.studentStage === stageFilter;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      student.name.toLowerCase().includes(normalizedQuery) ||
      student.email.toLowerCase().includes(normalizedQuery);

    return matchesStage && matchesQuery;
  });

  return (
    <div>
      <section className="mb-6">
        <h1 className="text-[24px] font-bold text-foreground">
          {t.queueTitle}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {t.queueDescription}
        </p>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-4">
          <div className="relative min-w-[200px] max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.queueSearchPlaceholder}
              suppressHydrationWarning
              className="h-11 w-full rounded-xl border border-border bg-surface-soft pl-10 pr-4 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <label className="relative">
              <select
                value={stageFilter}
                onChange={(event) =>
                  setStageFilter(event.target.value as "All" | StudentProfile["studentStage"])
                }
                className="h-11 appearance-none rounded-xl border border-border bg-surface-soft px-3.5 pr-9 text-[13px] font-medium text-foreground outline-none"
              >
                <option value="All">{t.queueAllStages}</option>
                <option value="Early Builder">{t.stageEarlyBuilder}</option>
                <option value="Pre-Applicant">{t.stagePreApplicant}</option>
                <option value="Active Applicant">{t.stageActiveApplicant}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </label>
          </div>

          <div className="ml-auto text-[13px] text-muted-foreground">
            {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"}
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full">
            <thead>
              <tr>
                {Object.values(t.queueColumns).map((column) => (
                  <th
                    key={column}
                    className="bg-surface-soft px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <QueueRow
                  key={student.id}
                  student={student}
                  stageLabel={stageLabels[student.studentStage]}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 lg:hidden">
          {filteredStudents.map((student) => (
            <article key={student.id} className="rounded-2xl border border-border bg-surface-soft p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
                <Pill className={stageStyles[student.studentStage]}>{stageLabels[student.studentStage]}</Pill>
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <Row label={t.queueColumns.grade} value={`Grade ${student.gradeLevel} · ${student.graduationYear}`} />
                <Row label={t.queueColumns.majors} value={student.intendedMajors.join(", ")} />
                <Row label={t.queueColumns.handoff} value={formatHandOffDate(student.handoffDate)} />
              </div>
              <Link
                href={`/student/${student.id}`}
                className="mt-4 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm"
              >
                {t.queueReview}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function QueueRow({
  student,
  stageLabel,
}: Readonly<{ student: StudentProfile; stageLabel: string }>) {
  const { language } = useDashboardSettings();
  const t = dashboardCopy[language];

  return (
    <tr className="cursor-pointer border-b border-border/50 transition-colors hover:bg-surface-soft">
      <td className="px-4 py-4">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">{student.name}</p>
          <p className="text-[12px] text-muted-foreground">{student.email}</p>
          <p className="text-[12px] text-muted-foreground">{student.phone}</p>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-foreground">Grade {student.gradeLevel}</p>
        <p className="text-[12px] text-muted-foreground">Class of {student.graduationYear}</p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-foreground">{student.intendedMajors.join(", ")}</p>
      </td>
      <td className="px-4 py-4">
        <Pill className={stageStyles[student.studentStage]}>{stageLabel}</Pill>
      </td>
      <td className="px-4 py-4 text-sm text-muted-foreground">
        {formatHandOffDate(student.handoffDate)}
      </td>
      <td className="px-4 py-4">
        <Link
          href={`/student/${student.id}`}
          className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          {t.queueReview}
        </Link>
      </td>
    </tr>
  );
}

function Row({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
