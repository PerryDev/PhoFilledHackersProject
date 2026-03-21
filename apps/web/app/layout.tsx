// apps/web/app/layout.tsx
// Root App Router layout for the counselor dashboard.
// Sets the global font, theme shell, and shared dashboard providers once.
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { DashboardProviders } from "@/components/dashboard/providers";
import { AppChrome } from "@/components/dashboard/app-chrome";
import { getOptionalServerSession } from "@/lib/auth-session";
import "./globals.css";

export const metadata: Metadata = {
  title: "ETEST Compass",
  description: "Student profiles and counselor dashboard for US university recommendations.",
};

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getOptionalServerSession();

  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <DashboardProviders
          initialUser={
            session?.user
              ? {
                  id: session.user.id,
                  name: session.user.name,
                  email: session.user.email,
                }
              : null
          }
        >
          <AppChrome>{children}</AppChrome>
        </DashboardProviders>
      </body>
    </html>
  );
}
