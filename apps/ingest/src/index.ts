// apps/ingest/src/index.ts
// Placeholder offline ingest entrypoint for the bootstrap branch.
// Verifies that the ingest app can resolve shared workspace packages before real pipelines arrive.
import { apiContractsWorkspaceStatus } from "@etest/api-contracts";
import { authWorkspaceStatus } from "@etest/auth";

const workspaceStatuses = [
  apiContractsWorkspaceStatus,
  authWorkspaceStatus,
];

for (const status of workspaceStatuses) {
  console.log(`[bootstrap] ${status.packageName}: ${status.status}`);
}
