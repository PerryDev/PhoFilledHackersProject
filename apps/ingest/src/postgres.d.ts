// apps/ingest/src/postgres.d.ts
// Minimal local declaration for the postgres client package.
// Keeps typecheck working in this workspace before the runtime dependency is installed.

declare module "postgres" {
  const postgres: any;
  export default postgres;
}
