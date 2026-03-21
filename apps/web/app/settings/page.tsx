// apps/web/app/settings/page.tsx
// Settings route for dashboard preferences.
// Renders the bilingual and theme controls from the shared dashboard shell.
import { SettingsPanel } from "@/components/dashboard/settings-panel";
import { requireAuthSession } from "@/lib/auth-session";

export default async function SettingsPage() {
  await requireAuthSession();
  return <SettingsPanel />;
}
