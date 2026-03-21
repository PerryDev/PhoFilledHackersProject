// apps/web/src/components/dashboard/student-detail.tsx
// Student detail route content with profile panels and booking summary.
// Delegates the recommendation-heavy portion to a focused subcomponent.
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { dashboardCopy } from "@/lib/dashboard-copy";
import { type StudentProfile } from "@/lib/dashboard-data";
import { useDashboardSettings } from "@/components/dashboard/providers";
import { InfoRow, Pill, SectionCard } from "@/components/dashboard/primitives";
import { RecommendationSection } from "@/components/dashboard/recommendation-list";

const bandStyles: Record<string, string> = {
  Developing: "bg-muted text-muted-foreground",
  Moderate: "bg-info text-info-foreground",
  Strong: "bg-success text-success-foreground",
  "Very Strong": "bg-success text-success-foreground",
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-warning text-warning-foreground",
  Competitive: "bg-success text-success-foreground",
  "Highly Competitive": "bg-success text-success-foreground",
};

export function StudentDetail({ student }: Readonly<{ student: StudentProfile }>) {
  const { language } = useDashboardSettings();
  const t = dashboardCopy[language];

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.detailBack}
      </Link>

      <section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{student.name}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {student.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {student.phone}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill className="bg-accent text-accent-foreground">
                {student.studentStage === "Early Builder"
                  ? t.stageEarlyBuilder
                  : student.studentStage === "Pre-Applicant"
                    ? t.stagePreApplicant
                    : t.stageActiveApplicant}
              </Pill>
              <Pill className="bg-surface-strong text-secondary-foreground">
                Grade {student.gradeLevel} · Class of {student.graduationYear}
              </Pill>
            </div>
          </div>

          <button className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-opacity hover:opacity-90">
            <Phone className="h-4 w-4" />
            {t.detailContact}
          </button>
        </div>

        {student.bookingIntent ? (
          <div className="mt-5 rounded-2xl bg-deadline px-4 py-3 text-deadline-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-semibold">{t.detailBooking}</span>
              <Pill className="bg-warning text-warning-foreground">{student.bookingIntent.status}</Pill>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="font-semibold">{t.detailTopic}:</span> {student.bookingIntent.topic}
              </p>
              <p>
                <span className="font-semibold">{t.detailTimeWindow}:</span> {student.bookingIntent.timeWindow}
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title={t.detailAcademic} icon={GraduationCap}>
          <InfoRow label={t.detailHighSchool} value={student.highSchool} />
          <InfoRow label={t.detailCurriculum} value={student.curriculum} />
          <InfoRow
            label={t.detailGpa}
            value={student.gpa}
            badge={{ label: student.gradeTrend, className: bandStyles[student.gradeTrend] }}
          />
          {Object.entries(student.testScores).map(([key, value]) =>
            value ? <InfoRow key={key} label={key.toUpperCase()} value={value} /> : null
          )}
          <InfoRow label={t.detailMajors} value={student.intendedMajors.join(", ")} />
          <InfoRow label={t.detailStrategy} value={student.strategyMode} />
        </SectionCard>

        <SectionCard title={t.detailActivities} icon={Activity}>
          <div className="space-y-3">
            <InfoBlock label={t.detailActivityDepth} value={student.activityDepthSignal} />
            <InfoBlock label={t.detailActivitiesLabel} value={student.activities} />
            <InfoBlock label={t.detailAwards} value={student.awards} />
            <InfoBlock label={t.detailLeadership} value={student.leadershipSignal} />
            <InfoBlock label={t.detailProjects} value={student.projects} />
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <MiniStatus text={`${t.detailEssays}: ${student.essayStatus}`} />
            <MiniStatus text={`${t.detailRecommendations}: ${student.recommendationLetters}`} />
            <MiniStatus text={`${t.detailDocuments}: ${student.documentStatus}`} />
          </div>
        </SectionCard>

        <SectionCard title={t.detailBudget} icon={DollarSign}>
          <InfoRow label={t.detailTargetBudget} value={student.targetAnnualBudget} />
          <InfoRow label={t.detailStretchBudget} value={student.maxStretchBudget} />
          <InfoRow
            label={t.detailScholarshipNeed}
            value={student.scholarshipNeed}
            badge={{
              label: student.scholarshipDependence,
              className:
                student.scholarshipDependence === "High"
                  ? "bg-destructive/15 text-destructive"
                  : student.scholarshipDependence === "Medium"
                    ? "bg-warning text-warning-foreground"
                    : "bg-success text-success-foreground",
            }}
          />
          <InfoRow label={t.detailAffordability} value={student.affordabilitySensitivity} />
          <div className="py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {t.detailGeography}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {student.geographicPreferences.map((value) => (
                <Pill key={value} className="bg-surface-strong text-secondary-foreground">
                  {value}
                </Pill>
              ))}
            </div>
          </div>
          <InfoRow label={t.detailCampus} value={`${student.campusType} · ${student.campusSize}`} />
        </SectionCard>

        <SectionCard title={t.detailAiSummary} icon={MessageSquare}>
          <p className="text-sm leading-6 text-foreground/80">{student.chatSummary}</p>
        </SectionCard>
      </div>

      <RecommendationSection student={student} />
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div>
      <span className="text-xs font-medium uppercase text-muted-foreground">{label}</span>
      <p className="mt-1 text-sm leading-6 text-foreground/85">{value}</p>
    </div>
  );
}

function MiniStatus({
  text,
}: Readonly<{
  text: string;
}>) {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <CheckCircle2 className="h-4 w-4 text-success-foreground" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
