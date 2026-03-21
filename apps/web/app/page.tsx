// apps/web/app/page.tsx
// Lead queue route for the counselor dashboard.
// The page stays server-rendered while the interactive queue lives in a client component.
import { LeadQueue } from "@/components/dashboard/lead-queue";

export default function HomePage() {
  return <LeadQueue />;
}
