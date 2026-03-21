// apps/web/app/layout.tsx
// Root App Router layout for the counselor dashboard.
// Sets the global font, theme shell, and shared dashboard providers once.
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { DashboardProviders } from "@/components/dashboard/providers";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "ETEST Compass | Admin Counselor Dashboard",
  description: "Internal counselor dashboard for reviewing student leads and school fits.",
};

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <DashboardProviders>
          <DashboardShell>{children}</DashboardShell>
        </DashboardProviders>
      </body>
    </html>
  );
}
