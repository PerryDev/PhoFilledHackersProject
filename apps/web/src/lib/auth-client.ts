// apps/web/src/lib/auth-client.ts
// Browser-side Better Auth client for login/logout and reactive session hooks.
// Keeps auth requests pointed at the canonical App Router endpoint.

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
