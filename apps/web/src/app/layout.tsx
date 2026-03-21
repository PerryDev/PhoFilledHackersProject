import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ETEST Compass Counselor Dashboard",
  description:
    "Admin counselor dashboard for reviewing student leads, recommendations, and booking requests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
