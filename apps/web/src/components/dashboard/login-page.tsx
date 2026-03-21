"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Compass, Mail, Shield } from "lucide-react";
import { useDashboardSettings } from "@/components/dashboard/providers";

export function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, signIn } = useDashboardSettings();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isHydrated, router]);

  const completeSignIn = () => {
    signIn();
    router.push("/");
  };

  const handleSendLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSent(true);
    window.setTimeout(() => {
      completeSignIn();
    }, 1200);
  };

  if (!isHydrated) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(135deg,#F8FAFC_0%,#FFFFFF_52%,#EEF2FF_100%)] px-4 py-10">
      <div className="w-full max-w-[400px] rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <div className="px-8 pb-8 pt-10">
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-primary">
              <Compass className="h-7 w-7 text-white" />
            </div>
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold text-[#0F172A]">ETEST Compass</h1>
          <p className="mx-auto mb-8 max-w-[320px] text-center text-[14px] leading-[1.6] text-[#64748B]">
            Sign in to build your profile and get personalized US university recommendations
          </p>

          <button
            type="button"
            onClick={completeSignIn}
            className="mb-3 flex w-full items-center justify-center gap-3 rounded-[10px] border border-[#E2E8F0] bg-white px-4 py-2.5 text-[14px] font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={completeSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-[10px] border border-[#E2E8F0] bg-white px-4 py-2.5 text-[14px] font-medium text-[#0F172A] transition-colors hover:bg-[#F8FAFC]"
          >
            <FacebookIcon />
            Continue with Facebook
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E2E8F0]" />
            <span className="bg-white px-2 text-[12px] font-medium text-[#94A3B8]">OR</span>
            <div className="h-px flex-1 bg-[#E2E8F0]" />
          </div>

          <form onSubmit={handleSendLink}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="mb-3 w-full rounded-[10px] border-none bg-[#F3F4F6] px-4 py-2.5 text-[14px] text-[#0F172A] outline-none transition-shadow placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#8DA0CB]/40"
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors"
              style={{ backgroundColor: sent ? "#64748B" : "#8DA0CB" }}
            >
              <Mail className="h-4 w-4" />
              {sent ? "Magic Link Sent!" : "Send Magic Link"}
            </button>
          </form>
        </div>

        <div className="px-8 pb-6">
          <div className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#94A3B8]" />
            <p className="text-[12px] leading-[1.5] text-[#94A3B8]">
              Your data is encrypted and never shared with third parties. We only use your information to
              provide personalized college recommendations.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-[12px] text-[#94A3B8]">
        By continuing, you agree to our{" "}
        <a href="#" className="underline transition-colors hover:text-[#64748B]">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline transition-colors hover:text-[#64748B]">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
