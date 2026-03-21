"use client";

import { useState } from "react";
import { ArrowRight, Compass, Loader2, Mail, Shield } from "lucide-react";
import { type Locale, copy } from "@/lib/onboarding-data";
import { FacebookIcon, GoogleIcon } from "./icons";
import type { Viewer } from "./global-header";

interface AuthWallProps {
  locale: Locale;
  onAuthenticated: (viewer: Viewer) => void;
}

export function AuthWall({ locale, onAuthenticated }: AuthWallProps) {
  const text = copy[locale];
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  function simulateAuth(provider: string, viewer: Viewer) {
    setLoading(provider);

    window.setTimeout(() => {
      setLoading(null);
      onAuthenticated(viewer);
    }, 1000);
  }

  function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setLoading("email");
    window.setTimeout(() => {
      setLoading(null);
      setMagicLinkSent(true);
    }, 900);
  }

  return (
    <div className="relative flex min-h-[calc(100vh-57px)] items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4D8E]/5 via-background to-[#1B4D8E]/10" />
        <div className="absolute inset-0 flex opacity-[0.08]">
          <div className="w-[40%] space-y-4 border-r border-border/50 p-8">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? "justify-end" : ""}`}>
                <div
                  className={`h-10 rounded-2xl ${
                    index % 2 === 0 ? "w-48 bg-primary" : "w-64 bg-muted"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-4 p-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="h-32 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Compass className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl text-foreground">{text.authTitle}</h1>
              <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground">{text.authSubtitle}</p>
            </div>
          </div>

          {magicLinkSent ? (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-foreground">{text.authCheckEmail}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {text.authMagicLinkSent} <span className="text-foreground">{email}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  simulateAuth("magic", {
                    name: email.split("@")[0] || "Student",
                    email,
                  })
                }
                disabled={loading === "magic"}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
              >
                {loading === "magic" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                <span>{text.authSimulateMagic}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setMagicLinkSent(false)}
                className="cursor-pointer text-xs text-muted-foreground transition hover:text-foreground"
              >
                {text.authDifferentEmail}
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    simulateAuth("google", {
                      name: "Minh Nguyen",
                      email: "minh.nguyen@gmail.com",
                    })
                  }
                  disabled={loading !== null}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted/50 disabled:opacity-60"
                >
                  {loading === "google" ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />}
                  {text.authGoogle}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    simulateAuth("facebook", {
                      name: "Minh Nguyen",
                      email: "minh.nguyen@facebook.com",
                    })
                  }
                  disabled={loading !== null}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted/50 disabled:opacity-60"
                >
                  {loading === "facebook" ? <Loader2 className="h-5 w-5 animate-spin" /> : <FacebookIcon />}
                  {text.authFacebook}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{text.authOr}</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={text.authEmailPlaceholder}
                  className="w-full rounded-lg border border-border bg-panel px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={loading !== null}
                />
                <button
                  type="submit"
                  disabled={!email.trim() || loading !== null}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading === "email" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  {text.authSendMagicLink}
                </button>
              </form>
            </>
          )}

          <div className="flex items-start gap-2 border-t border-border pt-2">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">{text.authTrust}</p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {text.authTerms} <span className="cursor-pointer underline hover:text-foreground">{text.authTermsOfService}</span> {text.authAnd}{" "}
          <span className="cursor-pointer underline hover:text-foreground">{text.authPrivacy}</span>
        </p>
      </div>
    </div>
  );
}
