"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import { students, type StudentProfile } from "@/lib/mock-data";

const stageBadge: Record<StudentProfile["studentStage"], string> = {
  "Active Applicant": "bg-success text-success-foreground",
  "Pre-Applicant": "bg-warning text-warning-foreground",
  "Early Builder": "bg-info text-info-foreground",
};

export function LeadQueue() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  const filtered = useMemo(() => {
    return students.filter((student) => {
      if (stageFilter !== "All" && student.studentStage !== stageFilter) {
        return false;
      }

      const query = search.trim().toLowerCase();
      if (!query) {
        return true;
      }

      return (
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    });
  }, [search, stageFilter]);

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Student Lead Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review pending consultation requests
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_20px_45px_rgba(10,34,64,0.08)]">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-[220px] flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-border bg-surface-soft py-2 pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="relative">
              <select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
                className="appearance-none rounded-xl border border-border bg-surface-soft px-3 py-2 pr-8 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="All">All Stages</option>
                <option value="Early Builder">Early Builder</option>
                <option value="Pre-Applicant">Pre-Applicant</option>
                <option value="Active Applicant">Active Applicant</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="ml-auto text-[13px] text-muted-foreground">
            {filtered.length} student{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-surface-soft">
                {[
                  "Student Name & Contact",
                  "Grade & Grad Year",
                  "Intended Major(s)",
                  "Stage",
                  "Handoff Date",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-[11px] font-semibold tracking-[0.05em] text-muted-foreground"
                  >
                    {header.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  className="border-t border-border/60 hover:bg-surface-soft/80"
                >
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-foreground">{student.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{student.email}</p>
                    <p className="text-xs text-muted-foreground">{student.phone}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-foreground">Grade {student.gradeLevel}</p>
                    <p className="text-xs text-muted-foreground">
                      Class of {student.graduationYear}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-foreground">
                    {student.intendedMajors.join(", ")}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block rounded-xl px-2.5 py-1 text-xs font-medium ${stageBadge[student.studentStage]}`}
                    >
                      {student.studentStage}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">
                    {new Date(student.handoffDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/student/${student.id}`}
                      className="inline-flex rounded-xl bg-accent px-4 py-2 text-[13px] font-semibold text-accent-foreground shadow-sm hover:opacity-90"
                    >
                      Review Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
