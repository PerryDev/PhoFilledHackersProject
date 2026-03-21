// apps/web/app/profile/page.tsx
// Standalone student profile route for the authenticated web user.
// Reads the Better Auth session on the server before rendering the editor.

import { getStudentProfileStateForUser } from "@etest/auth";
import { StudentProfileEditor } from "@/components/profile/student-profile-editor";
import { requireAuthSession } from "@/lib/auth-session";
import { buildStudentProfileDocumentFromState } from "@/lib/student-profile";

export default async function ProfilePage() {
  const session = await requireAuthSession();
  const initialState = await getStudentProfileStateForUser(session.user.id);
  const initialDocument = buildStudentProfileDocumentFromState(initialState);

  return (
    <StudentProfileEditor
      displayName={session.user.name || "Student"}
      email={session.user.email}
      initialDocument={initialDocument}
    />
  );
}
