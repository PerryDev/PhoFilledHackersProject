// apps/web/next.config.ts
// Minimal Next.js config for the bootstrap branch.
// Keeps the initial app strict without adding product-specific behavior.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
