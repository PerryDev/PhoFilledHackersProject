// apps/web/next.config.ts
// Next.js config for the dashboard app.
// Keeps local development strict while allowing the counselor UI to use the
// same canonical App Router entrypoints in every environment.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  reactStrictMode: true,
};

export default nextConfig;
