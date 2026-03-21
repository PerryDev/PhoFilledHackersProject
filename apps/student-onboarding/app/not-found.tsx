// apps/student-onboarding/app/not-found.tsx
// Shared 404 fallback for the student onboarding app.
// Keeps the route visually aligned with the rest of the experience.
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.12),_transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.3),transparent)]" />
      <div className="absolute left-[-8rem] top-12 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-0 right-[-7rem] h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <section className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Not found
        </p>
        <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          This route does not exist in the onboarding experience.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          If you were looking for your student workspace, go back to the home
          route and continue from there.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Back home
          </Link>
          <Link
            href="/login"
            className="inline-flex rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-soft"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
