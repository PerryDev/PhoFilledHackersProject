import { notFound } from "next/navigation";
import { StudentDetail } from "@/components/dashboard/student-detail";
import { students } from "@/lib/mock-data";

type StudentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return students.map((student) => ({ id: student.id }));
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { id } = await params;
  const student = students.find((entry) => entry.id === id);

  if (!student) {
    notFound();
  }

  return <StudentDetail student={student} />;
}
