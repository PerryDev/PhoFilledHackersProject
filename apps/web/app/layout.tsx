// apps/web/app/layout.tsx
// Shared app layout for the bootstrap branch.
// Provides the root HTML shell so the workspace has one real Next.js entrypoint.
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ETEST Compass",
  description: "Monorepo bootstrap workspace for the ETEST Compass hackathon build.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
