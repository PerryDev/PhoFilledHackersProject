// apps/web/app/not-found.tsx
// Dashboard-friendly 404 fallback.
// Keeps missing routes inside the same visual system as the rest of the app.
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center px-6 py-16">
      <section className="w-full rounded-[2rem] border border-border bg-card/90 p-10 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Not found
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          This student record does not exist.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          The dashboard only exposes seeded records for the current prototype.
          Return to the lead queue to continue reviewing the active pipeline.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          Back to lead queue
        </Link>
      </section>
    </main>
  );
}
