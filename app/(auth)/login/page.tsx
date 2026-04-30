"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense, useEffect } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace("/dashboard");
      } else {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060606]">
        <div className="w-8 h-8 border-2 border-[#F5C518] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    oauthError === "oauth_failed"
      ? "Google sign-in failed. Please try again."
      : "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Readlyn workspace."
    >
      {/* Google OAuth */}
      <GoogleOAuthButton label="Continue with Google" />

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <span className="font-ibm-mono text-[10px] text-[#333] tracking-[1px]">
          OR
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      </div>

      {/* Email/password form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-ibm-mono text-[11px] text-[#555] tracking-[1px] uppercase">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="font-ibm-mono text-[11px] text-[#F5C518] opacity-70 hover:opacity-100 transition-opacity tracking-[0.3px]"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/[0.07] text-white text-[13px] font-ibm-mono placeholder:text-[#333] focus:outline-none focus:border-[rgba(245,197,24,0.4)] focus:ring-1 focus:ring-[rgba(245,197,24,0.15)] transition-all duration-200"
          />
        </div>

        {error && (
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
            style={{
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="shrink-0 mt-[1px]"
            >
              <circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.5" />
              <path
                d="M7 4v3.5M7 9.5v.5"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="font-ibm-mono text-[11px] text-[#ef4444] tracking-[0.3px] leading-relaxed">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-grotesk text-[13px] font-bold text-black bg-[#F5C518] hover:bg-[#FFDC40] transition-all duration-200 shadow-[0_0_24px_rgba(245,197,24,0.25)] hover:shadow-[0_0_36px_rgba(245,197,24,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Sign up link */}
      <p className="mt-6 text-center font-ibm-mono text-[11px] text-[#444] tracking-[0.3px]">
        No account yet?{" "}
        <Link
          href="/signup"
          className="text-[#A3A3A3] hover:text-white transition-colors"
        >
          Create one free
        </Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
