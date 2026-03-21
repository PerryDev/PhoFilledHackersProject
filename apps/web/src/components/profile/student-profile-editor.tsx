// apps/web/src/components/profile/student-profile-editor.tsx
// Student profile editor for the authenticated web user.
// Persists current and projected snapshots through the canonical profile API.

"use client";

import { useState } from "react";
import { Check, LoaderCircle, Sparkles, UserRound } from "lucide-react";
import type { StudentProfileState } from "@etest/auth";

import { SectionCard, Pill } from "@/components/dashboard/primitives";
import { authClient } from "@/lib/auth-client";
import {
  budgetFlexibilityOptions,
  curriculumStrengthOptions,
  englishExamTypeOptions,
  getStudentProfileMissingFields,
  joinListValue,
  parseBooleanChoice,
  preferredUndergraduateSizeOptions,
  splitListValue,
  type StudentProfile,
  type StudentProfileDocument,
} from "@/lib/student-profile";

type Props = Readonly<{
  displayName: string;
  email: string;
  initialDocument: StudentProfileDocument;
}>;

function isStudentProfileState(value: unknown): value is StudentProfileState {
  return Boolean(
    value &&
      typeof value === "object" &&
      "snapshots" in value &&
      "missingFields" in value,
  );
}

export function StudentProfileEditor({ displayName, email, initialDocument }: Props) {
  const [nameDraft, setNameDraft] = useState(displayName);
  const [currentProfile, setCurrentProfile] = useState(initialDocument.current.profile);
  const [projectedProfile, setProjectedProfile] = useState(initialDocument.projected.profile);
  const [currentAssumptions, setCurrentAssumptions] = useState(joinListValue(initialDocument.current.assumptions));
  const [projectedAssumptions, setProjectedAssumptions] = useState(joinListValue(initialDocument.projected.assumptions));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const document = {
    current: {
      assumptions: splitListValue(currentAssumptions),
      profile: currentProfile,
    },
    projected: {
      assumptions: splitListValue(projectedAssumptions),
      profile: projectedProfile,
    },
  } satisfies StudentProfileDocument;

  const missingFields = getStudentProfileMissingFields(document);

  const updateProfile = (updater: (profile: StudentProfile) => StudentProfile) => {
    setSaved(false);
    setCurrentProfile((profile) => {
      const nextCurrentProfile = updater(profile);

      setProjectedProfile((existingProjectedProfile) => ({
        ...existingProjectedProfile,
        citizenshipCountry: nextCurrentProfile.citizenshipCountry,
        targetEntryTerm: nextCurrentProfile.targetEntryTerm,
        testing: nextCurrentProfile.testing,
        preferences: nextCurrentProfile.preferences,
        budget: nextCurrentProfile.budget,
        readiness: nextCurrentProfile.readiness,
        academic: {
          ...nextCurrentProfile.academic,
          projectedGpa100: existingProjectedProfile.academic.projectedGpa100,
        },
      }));

      return nextCurrentProfile;
    });
  };

  const updateProjectedProfile = (updater: (profile: StudentProfile) => StudentProfile) => {
    setSaved(false);
    setProjectedProfile((profile) => updater(profile));
  };

  const updateCurrentAssumptions = (value: string) => {
    setSaved(false);
    setCurrentAssumptions(value);
  };

  const updateProjectedAssumptions = (value: string) => {
    setSaved(false);
    setProjectedAssumptions(value);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

      const nextDocument: StudentProfileDocument = {
        current: {
          assumptions: splitListValue(currentAssumptions),
          profile: currentProfile,
        },
        projected: {
          assumptions: splitListValue(projectedAssumptions),
          profile: projectedProfile,
        },
      };

      try {
      const savedState = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          currentProfile: nextDocument.current.profile,
          projectedProfile: nextDocument.projected.profile,
          currentAssumptions: nextDocument.current.assumptions,
          projectedAssumptions: nextDocument.projected.assumptions,
        }),
      }).then(async (response) => {
        const payload = (await response.json().catch(() => null)) as
          | StudentProfileState
          | { error?: string }
          | null;

        if (!response.ok) {
          throw new Error(
            payload && "error" in payload && typeof payload.error === "string"
              ? payload.error
              : "Unable to save profile.",
          );
        }

        if (!isStudentProfileState(payload)) {
          throw new Error("Unable to read the saved profile state.");
        }

        return payload;
      });

      if (nameDraft.trim() && nameDraft.trim() !== displayName) {
        await authClient.updateUser({
          name: nameDraft.trim(),
        } as never);
      }

      setCurrentProfile({
        citizenshipCountry:
          savedState.snapshots.current.profile?.citizenshipCountry ??
          savedState.profile?.citizenshipCountry ??
          "",
        targetEntryTerm:
          savedState.snapshots.current.profile?.targetEntryTerm ??
          savedState.profile?.targetEntryTerm ??
          "",
        academic:
          savedState.snapshots.current.profile?.academic ??
          savedState.profile?.academic ??
          currentProfile.academic,
        testing:
          savedState.snapshots.current.profile?.testing ??
          savedState.profile?.testing ??
          currentProfile.testing,
        preferences:
          savedState.snapshots.current.profile?.preferences ??
          savedState.profile?.preferences ??
          currentProfile.preferences,
        budget:
          savedState.snapshots.current.profile?.budget ??
          savedState.profile?.budget ??
          currentProfile.budget,
        readiness:
          savedState.snapshots.current.profile?.readiness ??
          savedState.profile?.readiness ??
          currentProfile.readiness,
      });
      setProjectedProfile({
        citizenshipCountry:
          savedState.snapshots.projected.profile?.citizenshipCountry ??
          savedState.profile?.citizenshipCountry ??
          "",
        targetEntryTerm:
          savedState.snapshots.projected.profile?.targetEntryTerm ??
          savedState.profile?.targetEntryTerm ??
          "",
        academic:
          savedState.snapshots.projected.profile?.academic ??
          savedState.profile?.academic ??
          projectedProfile.academic,
        testing:
          savedState.snapshots.projected.profile?.testing ??
          savedState.profile?.testing ??
          projectedProfile.testing,
        preferences:
          savedState.snapshots.projected.profile?.preferences ??
          savedState.profile?.preferences ??
          projectedProfile.preferences,
        budget:
          savedState.snapshots.projected.profile?.budget ??
          savedState.profile?.budget ??
          projectedProfile.budget,
        readiness:
          savedState.snapshots.projected.profile?.readiness ??
          savedState.profile?.readiness ??
          projectedProfile.readiness,
      });
      setCurrentAssumptions(joinListValue(savedState.snapshots.current.assumptions));
      setProjectedAssumptions(joinListValue(savedState.snapshots.projected.assumptions));

      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(180deg,#F8FAFC_0%,#FFFFFF_30%,#EEF2FF_100%)] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-border bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-primary">
              Student profile
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              Keep the current and projected profile states in sync.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This page writes to the canonical student profile tables and keeps
              current versus projected assumptions explicit for later recommendation runs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill className="bg-primary/10 text-primary">
              {missingFields.length} missing fields
            </Pill>
            <Pill className="bg-slate-900 text-white">Signed in as {nameDraft || displayName}</Pill>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <SectionCard title="Current snapshot" icon={UserRound}>
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Name"
                  value={nameDraft}
                onChange={(value) => {
                  setSaved(false);
                  setNameDraft(value);
                }}
                  placeholder="Student display name"
                />
                <ReadOnlyField label="Email" value={email} />
                <TextField
                  label="Citizenship country"
                  value={currentProfile.citizenshipCountry}
                  onChange={(value) => updateProfile((profile) => ({ ...profile, citizenshipCountry: value }))}
                  placeholder="Vietnam"
                />
                <TextField
                  label="Target entry term"
                  value={currentProfile.targetEntryTerm}
                  onChange={(value) => updateProfile((profile) => ({ ...profile, targetEntryTerm: value }))}
                  placeholder="Fall 2027"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Current GPA /100"
                  value={currentProfile.academic.currentGpa100}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      academic: { ...profile.academic, currentGpa100: value },
                    }))
                  }
                />
                <NumberField
                  label="Class rank percentile"
                  value={currentProfile.academic.classRankPercent}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      academic: { ...profile.academic, classRankPercent: value },
                    }))
                  }
                />
                <SelectField
                  label="Curriculum strength"
                  value={currentProfile.academic.curriculumStrength}
                  options={curriculumStrengthOptions}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      academic: { ...profile.academic, curriculumStrength: value },
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="SAT total"
                  value={currentProfile.testing.satTotal}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      testing: { ...profile.testing, satTotal: value },
                    }))
                  }
                />
                <NumberField
                  label="ACT composite"
                  value={currentProfile.testing.actComposite}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      testing: { ...profile.testing, actComposite: value },
                    }))
                  }
                />
                <SelectField
                  label="English exam type"
                  value={currentProfile.testing.englishExamType}
                  options={englishExamTypeOptions}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      testing: { ...profile.testing, englishExamType: value },
                    }))
                  }
                />
                <NumberField
                  label="English exam score"
                  value={currentProfile.testing.englishExamScore}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      testing: { ...profile.testing, englishExamScore: value },
                    }))
                  }
                />
                <YesNoField
                  label="Will submit tests"
                  value={currentProfile.testing.willSubmitTests}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      testing: { ...profile.testing, willSubmitTests: value },
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TagListField
                  label="Intended majors"
                  value={joinListValue(currentProfile.preferences.intendedMajors)}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      preferences: { ...profile.preferences, intendedMajors: splitListValue(value) },
                    }))
                  }
                />
                <TagListField
                  label="Preferred states"
                  value={joinListValue(currentProfile.preferences.preferredStates)}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      preferences: { ...profile.preferences, preferredStates: splitListValue(value) },
                    }))
                  }
                />
                <TagListField
                  label="Campus locales"
                  value={joinListValue(currentProfile.preferences.preferredCampusLocale)}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      preferences: { ...profile.preferences, preferredCampusLocale: splitListValue(value) },
                    }))
                  }
                />
                <TagListField
                  label="School control"
                  value={joinListValue(currentProfile.preferences.preferredSchoolControl)}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        preferredSchoolControl: splitListValue(value).filter(
                          (item): item is "public" | "private_nonprofit" =>
                            item === "public" || item === "private_nonprofit",
                        ),
                      },
                    }))
                  }
                />
                <SelectField
                  label="Preferred size"
                  value={currentProfile.preferences.preferredUndergraduateSize}
                  options={preferredUndergraduateSizeOptions}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      preferences: { ...profile.preferences, preferredUndergraduateSize: value },
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Annual budget USD"
                  value={currentProfile.budget.annualBudgetUsd}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      budget: { ...profile.budget, annualBudgetUsd: value },
                    }))
                  }
                />
                <SelectField
                  label="Budget flexibility"
                  value={currentProfile.budget.budgetFlexibility}
                  options={budgetFlexibilityOptions}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      budget: { ...profile.budget, budgetFlexibility: value },
                    }))
                  }
                />
                <YesNoField
                  label="Needs financial aid"
                  value={currentProfile.budget.needsFinancialAid}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      budget: { ...profile.budget, needsFinancialAid: value },
                    }))
                  }
                />
                <YesNoField
                  label="Needs merit aid"
                  value={currentProfile.budget.needsMeritAid}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      budget: { ...profile.budget, needsMeritAid: value },
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <YesNoField
                  label="Wants early round"
                  value={currentProfile.readiness.wantsEarlyRound}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      readiness: { ...profile.readiness, wantsEarlyRound: value },
                    }))
                  }
                />
                <YesNoField
                  label="Teacher recommendations ready"
                  value={currentProfile.readiness.hasTeacherRecommendationsReady}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      readiness: { ...profile.readiness, hasTeacherRecommendationsReady: value },
                    }))
                  }
                />
                <YesNoField
                  label="Counselor documents ready"
                  value={currentProfile.readiness.hasCounselorDocumentsReady}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      readiness: { ...profile.readiness, hasCounselorDocumentsReady: value },
                    }))
                  }
                />
                <YesNoField
                  label="Essay drafts started"
                  value={currentProfile.readiness.hasEssayDraftsStarted}
                  onChange={(value) =>
                    updateProfile((profile) => ({
                      ...profile,
                      readiness: { ...profile.readiness, hasEssayDraftsStarted: value },
                    }))
                  }
                />
              </div>

              <TextareaField
                label="Current assumptions"
                value={currentAssumptions}
                onChange={updateCurrentAssumptions}
                placeholder="Comma-separated assumptions that make the current state explicit"
              />
            </div>
          </SectionCard>

          <SectionCard title="Projected snapshot" icon={Sparkles}>
            <div className="space-y-5">
              <p className="text-sm leading-6 text-muted-foreground">
                This snapshot mirrors the current profile and only changes the projected fields you set below.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Projected GPA /100"
                  value={projectedProfile.academic.projectedGpa100}
                  onChange={(value) =>
                    updateProjectedProfile((profile) => ({
                      ...profile,
                      academic: { ...profile.academic, projectedGpa100: value },
                    }))
                  }
                />
                <ReadOnlyField
                  label="Projected state mirrors"
                  value="Current citizenship, testing, preferences, budget, and readiness"
                />
              </div>

              <TextareaField
                label="Projected assumptions"
                value={projectedAssumptions}
                onChange={updateProjectedAssumptions}
                placeholder="Comma-separated assumptions for the projected state"
              />

              <div className="rounded-2xl border border-dashed border-border bg-surface-soft p-4 text-sm leading-6 text-muted-foreground">
                The projected snapshot stays reproducible because it is derived from the current profile plus the
                projected GPA and assumptions stored in your account.
              </div>

              <div className="space-y-2 rounded-2xl border border-border bg-white p-4">
                <p className="text-sm font-semibold text-foreground">Missing before recommendation</p>
                {missingFields.length ? (
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {missingFields.slice(0, 8).map((item) => (
                      <li key={`${item.snapshotKind}-${item.field}`}>
                        <span className="font-medium text-foreground">{item.snapshotKind}</span>: {item.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-emerald-700">No blocking gaps remain for a recommendation run.</p>
                )}
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  {saved ? (
                    <Pill className="bg-emerald-100 text-emerald-700">
                      <Check className="mr-1 h-3.5 w-3.5" />
                      Saved
                    </Pill>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  {saving ? "Saving..." : "Save profile"}
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

function ReadOnlyField({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <input
        type="text"
        value={value}
        readOnly
        className="h-12 w-full rounded-2xl border border-border bg-surface-soft px-4 text-sm text-muted-foreground outline-none"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: Readonly<{
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ""}
        onChange={(event) => {
          const nextValue = event.target.value.trim();
          onChange(nextValue ? Number(nextValue) : null);
        }}
        className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: Readonly<{
  label: string;
  value: T | "";
  options: readonly T[] | readonly { value: T | ""; label: string }[];
  onChange: (value: T) => void;
}>) {
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        {normalizedOptions.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function YesNoField({
  label,
  value,
  onChange,
}: Readonly<{
  label: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <select
        value={value === null ? "" : String(value)}
        onChange={(event) => onChange(parseBooleanChoice(event.target.value))}
        className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        <option value="">Not set</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  );
}

function TagListField({
  label,
  value,
  onChange,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder="Comma-separated values"
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}
