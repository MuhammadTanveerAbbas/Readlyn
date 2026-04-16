"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/update-password`,
      },
    );

    setIsLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <AuthCard
        title="Link sent"
        subtitle="Check your email for the reset link."
      >
        <div className="flex flex-col items-center gap-5 py-4">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{
              background: "rgba(74,222,128,0.07)",
              border: "1px solid rgba(74,222,128,0.2)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#4ADE80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-ibm-mono text-[12px] text-[#666] tracking-[0.3px] leading-relaxed">
              A reset link was sent to
            </p>
            <p className="font-ibm-mono text-[13px] text-[#A3A3A3] mt-1">
              {email}
            </p>
          </div>
          <p className="font-ibm-mono text-[11px] text-[#444] tracking-[0.3px] text-center leading-relaxed">
            The link expires in 1 hour. Check your spam folder if you don&apos;t
            see it.
          </p>
          <Link
            href="/login"
            className="font-ibm-mono text-[11px] text-[#F5C518] opacity-70 hover:opacity-100 transition-opacity tracking-[0.5px]"
          >
            ← Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="Enter your email and we'll send you a secure reset link."
    >
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
              Sending...
            </span>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <p className="mt-6 text-center font-ibm-mono text-[11px] text-[#444] tracking-[0.3px]">
        <Link
          href="/login"
          className="text-[#A3A3A3] hover:text-white transition-colors"
        >
          ← Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
