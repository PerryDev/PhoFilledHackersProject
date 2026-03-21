// apps/web/app/student/[id]/page.tsx
// Dynamic student detail route for the counselor dashboard.
// Resolves a seeded student by id and falls back to the standard Next not-found flow.
import { notFound } from "next/navigation";
import { StudentDetail } from "@/components/dashboard/student-detail";
import { getStudentById } from "@/lib/dashboard-data";

export default async function StudentPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const student = getStudentById(id);

  if (!student) {
    notFound();
  }

  return <StudentDetail student={student} />;
}
