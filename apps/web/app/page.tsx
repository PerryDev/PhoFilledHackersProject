// apps/web/app/page.tsx
// Lead queue route for the counselor dashboard.
// The page stays server-rendered while the interactive queue lives in a client component.
import { LeadQueue } from "@/components/dashboard/lead-queue";
import { requireAuthSession } from "@/lib/auth-session";

export default async function HomePage() {
  await requireAuthSession();
  return <LeadQueue />;
}
