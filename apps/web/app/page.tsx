// apps/web/app/page.tsx
// Bootstrap placeholder page for the initial web app shell.
// Makes the workspace visibly runnable before product features land in later branches.
const workspaceModules = [
  "apps/web",
  "apps/ingest",
  "packages/db",
  "packages/catalog",
  "packages/api-contracts",
  "packages/auth",
] as const;

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Hackathon bootstrap</p>
        <h1>ETEST Compass Monorepo</h1>
        <p className="lead">
          The canonical workspace is in place so later branches can add schema,
          ingestion, review, and recommendation slices without repo surgery.
        </p>
      </section>

      <section className="module-grid" aria-label="Bootstrap workspace modules">
        {workspaceModules.map((moduleName) => (
          <article className="module-card" key={moduleName}>
            <h2>{moduleName}</h2>
            <p>Workspace placeholder ready for the next vertical slice.</p>
          </article>
        ))}
      </section>
    </main>
  );
}
