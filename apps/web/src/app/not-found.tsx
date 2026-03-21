import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Not Found
      </p>
      <h1 className="mt-3 text-3xl font-bold text-foreground">
        Student profile unavailable
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
        The requested student record could not be found in this prototype dataset.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
      >
        Return to queue
      </Link>
    </div>
  );
}
