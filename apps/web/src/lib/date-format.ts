// apps/web/src/lib/date-format.ts
// Stable UTC date formatting for dashboard metadata.
// Keeps SSR and hydration aligned for date-only values.
const stableDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatStableDate(value: string) {
  return stableDateFormatter.format(new Date(value));
}
