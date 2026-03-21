// apps/student-onboarding/src/lib/auth-client.ts
// Browser Better Auth client for the student onboarding app.
// Keeps login, sign-up, and logout pointed at the local App Router endpoint.

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
