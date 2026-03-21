import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { SchoolRecommendation, StudentProfile } from "@/lib/mock-data";

const confidenceColor = {
  Low: "bg-warning text-warning-foreground",
  Medium: "bg-info text-info-foreground",
  High: "bg-success text-success-foreground",
};

const budgetColor = {
  "Within Budget": "bg-success text-success-foreground",
  Stretch: "bg-warning text-warning-foreground",
  "Over Budget": "bg-destructive/15 text-destructive",
};

const bandColor: Record<string, string> = {
  Developing: "bg-muted text-muted-foreground",
  Moderate: "bg-info text-info-foreground",
  Strong: "bg-success text-success-foreground",
  "Very Strong": "bg-success text-success-foreground",
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-warning text-warning-foreground",
  Competitive: "bg-success text-success-foreground",
  "Highly Competitive": "bg-success text-success-foreground",
};

function DetailCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: typeof GraduationCap;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-3xl border border-border bg-card shadow-sm ${className}`}>
      <div className="flex items-center gap-2.5 border-b border-border bg-surface-soft px-5 py-3.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-[14px] w-[14px] text-primary" />
        </div>
        <h3 className="text-[13px] font-bold uppercase tracking-[0.02em] text-foreground">
          {title}
        </h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/50 py-2 last:border-0">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-right text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}

function RecommendationCard({ school }: { school: SchoolRecommendation }) {
  const borderColor =
    school.tier === "Reach"
      ? "var(--reach)"
      : school.tier === "Target"
        ? "var(--target)"
        : "var(--safety)";

  return (
    <article
      className="mb-3 rounded-3xl border border-border p-4 last:mb-0"
      style={{ borderLeftWidth: 4, borderLeftColor: borderColor }}
    >
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{school.schoolName}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {school.city}, {school.state}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-xl px-2 py-0.5 text-[10px] font-semibold ${confidenceColor[school.confidenceLevel]}`}>
            {school.confidenceLevel} confidence
          </span>
          <span className="rounded-xl bg-deadline px-2 py-0.5 text-[10px] font-semibold text-deadline-foreground">
            <Clock className="mr-0.5 inline h-3 w-3" />
            {school.deadlinePressure}
          </span>
        </div>
      </div>

      <div className="mb-3 grid gap-3 rounded-2xl bg-surface-soft p-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Current outlook" value={school.currentOutlook} />
        <Metric label="Projected outlook" value={school.projectedOutlook} />
        <Metric
          label="Tuition / all-in"
          value={`$${(school.tuitionAnnualUsd / 1000).toFixed(0)}k / $${(
            school.estimatedCostOfAttendanceUsd / 1000
          ).toFixed(0)}k`}
        />
        <div>
          <span className="block text-[10px] font-medium uppercase text-muted-foreground">
            Budget fit
          </span>
          <span className={`mt-0.5 inline-block rounded-xl px-2 py-0.5 text-[11px] font-medium ${budgetColor[school.budgetFit]}`}>
            {school.budgetFit}
          </span>
        </div>
      </div>

      {school.scholarshipAvailabilityFlag && school.scholarshipNotes ? (
        <div className="mb-3 flex items-start gap-1.5 rounded-xl bg-scholarship px-3 py-2 text-xs text-scholarship-foreground">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{school.scholarshipNotes}</span>
        </div>
      ) : null}

      <TagGroup
        title="Fit reasons"
        items={school.reasonsForFit}
        className="bg-info text-info-foreground"
        icon={<CheckCircle2 className="h-3 w-3" />}
      />
      <TagGroup
        title="Top blockers"
        items={school.topBlockers}
        className="bg-destructive/15 text-destructive"
        icon={<XCircle className="h-3 w-3" />}
      />
      <TagGroup
        title="Next actions"
        items={school.nextActions}
        className="bg-warning text-warning-foreground"
        icon={<TrendingUp className="h-3 w-3" />}
      />

      <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 text-[10px] text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
        <span>
          Last verified:{" "}
          {new Date(school.lastVerifiedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
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
              Source {index + 1}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[10px] font-medium uppercase text-muted-foreground">
        {label}
      </span>
      <p className="mt-0.5 text-[12px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function TagGroup({
  title,
  items,
  className,
  icon,
}: {
  title: string;
  items: string[];
  className: string;
  icon: React.ReactNode;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-2">
      <span className="text-[11px] font-medium uppercase text-muted-foreground">
        {title}
      </span>
      <div className="mt-1 flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            key={item}
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] ${className}`}
          >
            {icon}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StudentDetail({ student }: { student: StudentProfile }) {
  const tests = Object.entries(student.testScores).filter(([, value]) => value);

  const stageBadge =
    student.studentStage === "Active Applicant"
      ? "bg-success text-success-foreground"
      : student.studentStage === "Pre-Applicant"
        ? "bg-warning text-warning-foreground"
        : "bg-info text-info-foreground";

  return (
    <section>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Lead Queue
      </Link>

      <section className="mb-6 rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{student.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {student.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                {student.phone}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-xl px-2.5 py-1 text-xs font-medium ${stageBadge}`}>
                {student.studentStage}
              </span>
              <span className="text-xs text-muted-foreground">
                Grade {student.gradeLevel} · Class of {student.graduationYear} · {student.curriculum}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-xl px-2 py-0.5 text-[11px] ${bandColor[student.academicStrengthBand]}`}>
                Academic: {student.academicStrengthBand}
              </span>
              <span className={`rounded-xl px-2 py-0.5 text-[11px] ${bandColor[student.testReadinessBand]}`}>
                Test: {student.testReadinessBand}
              </span>
            </div>
          </div>
          <a
            href={`mailto:${student.email}`}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm hover:opacity-90"
          >
            <Phone className="h-4 w-4" />
            Contact Student
          </a>
        </div>

        {student.bookingIntent ? (
          <div className="mt-4 rounded-xl bg-deadline px-4 py-3">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Calendar className="h-4 w-4 text-deadline-foreground" />
              <span className="text-[13px] font-semibold text-deadline-foreground">
                Booking Request
              </span>
              <span className="rounded-xl bg-warning px-2 py-0.5 text-[10px] font-semibold text-warning-foreground">
                {student.bookingIntent.status}
              </span>
            </div>
            <p className="ml-6 text-[13px] text-deadline-foreground">
              <span className="font-medium">Topic:</span> {student.bookingIntent.topic}
            </p>
            <p className="ml-6 text-[13px] text-deadline-foreground">
              <span className="font-medium">Time Window:</span> {student.bookingIntent.timeWindow}
            </p>
          </div>
        ) : null}
      </section>

      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DetailCard title="Academic Profile" icon={GraduationCap}>
          <InfoRow label="High School" value={student.highSchool} />
          <InfoRow label="Curriculum" value={student.curriculum} />
          <InfoRow label="GPA" value={`${student.gpa} · ${student.gradeTrend}`} />
          {tests.map(([label, value]) => (
            <InfoRow key={label} label={label.toUpperCase()} value={value ?? ""} />
          ))}
          <InfoRow label="Intended Major(s)" value={student.intendedMajors.join(", ")} />
          <InfoRow label="Strategy Mode" value={student.strategyMode} />
        </DetailCard>

        <DetailCard title="Activities & Readiness" icon={Activity}>
          <div className="space-y-3">
            <CopyBlock label="Activity Depth" value={student.activityDepthSignal} />
            <CopyBlock label="Activities" value={student.activities} />
            <CopyBlock label="Awards" value={student.awards} />
            <CopyBlock label="Leadership" value={student.leadershipSignal} />
            <CopyBlock label="Projects" value={student.projects} />
            <div className="space-y-1.5 border-t border-border pt-2">
              <StatusRow label={`Essays: ${student.essayStatus}`} dimmed={student.essayStatus.includes("Not")} />
              <StatusRow
                label={`Recommendations: ${student.recommendationLetters}`}
                dimmed={student.recommendationLetters.includes("None")}
              />
              <StatusRow label={`Documents: ${student.documentStatus}`} dimmed={false} />
            </div>
          </div>
        </DetailCard>

        <DetailCard title="Budget & Preferences" icon={DollarSign}>
          <InfoRow label="Target Annual Budget" value={student.targetAnnualBudget} />
          <InfoRow label="Max Stretch Budget" value={student.maxStretchBudget} />
          <InfoRow label="Scholarship Need" value={student.scholarshipNeed} />
          <InfoRow label="Affordability Sensitivity" value={student.affordabilitySensitivity} />
          <div className="border-b border-border/50 py-2">
            <span className="text-[13px] text-muted-foreground">Geographic Preferences</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {student.geographicPreferences.map((location) => (
                <span
                  key={location}
                  className="rounded-lg bg-surface-strong px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {location}
                </span>
              ))}
            </div>
          </div>
          <InfoRow label="Campus" value={`${student.campusType} · ${student.campusSize}`} />
        </DetailCard>

        <DetailCard title="AI Chat Summary" icon={MessageSquare}>
          <p className="text-[13px] leading-relaxed text-foreground/80">
            {student.chatSummary}
          </p>
        </DetailCard>
      </div>

      <DetailCard title="System Recommendations" icon={Target} className="mb-6">
        <div className="space-y-6">
          {(["reach", "target", "safety"] as const).map((bucket) => {
            const schools = student.recommendations[bucket];

            if (schools.length === 0) {
              return null;
            }

            return (
              <div key={bucket}>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        bucket === "reach"
                          ? "var(--reach)"
                          : bucket === "target"
                            ? "var(--target)"
                            : "var(--safety)",
                    }}
                  />
                  <h4 className="text-sm font-semibold capitalize text-foreground">
                    {bucket} Schools
                  </h4>
                  <span className="text-xs text-muted-foreground">({schools.length})</span>
                </div>
                {schools.map((school) => (
                  <RecommendationCard key={school.schoolName} school={school} />
                ))}
              </div>
            );
          })}
        </div>
      </DetailCard>
    </section>
  );
}

function CopyBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[11px] font-medium uppercase text-muted-foreground">{label}</span>
      <p className="mt-0.5 text-[13px] text-foreground/80">{value}</p>
    </div>
  );
}

function StatusRow({ label, dimmed }: { label: string; dimmed: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {dimmed ? (
        <AlertTriangle className="h-4 w-4 text-muted-foreground/40" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-success-foreground" />
      )}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
