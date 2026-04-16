"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import GoogleOAuthButton from "@/components/auth/GoogleOAuthButton";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = "Email is required";
    if (password.length < 8) errs.password = "Minimum 8 characters";
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords don't match";
    return errs;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setIsLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <AuthCard
        title="Check your inbox"
        subtitle="We sent you a confirmation link."
      >
        <div className="flex flex-col items-center gap-5 py-4">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{
              background: "rgba(245,197,24,0.08)",
              border: "1px solid rgba(245,197,24,0.2)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 8l9 6 9-6"
                stroke="#F5C518"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect
                x="3"
                y="6"
                width="18"
                height="13"
                rx="2"
                stroke="#F5C518"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-ibm-mono text-[12px] text-[#666] tracking-[0.3px] leading-relaxed">
              A confirmation email was sent to
            </p>
            <p className="font-ibm-mono text-[13px] text-[#A3A3A3] mt-1">
              {email}
            </p>
          </div>
          <p className="font-ibm-mono text-[11px] text-[#444] tracking-[0.3px] text-center leading-relaxed">
            Click the link in the email to activate your account. Check your
            spam folder if you don&apos;t see it.
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
      title="Create account"
      subtitle="Start building infographics with AI  free."
    >
      {/* Google OAuth */}
      <GoogleOAuthButton label="Sign up with Google" />

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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthInput
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((p) => ({ ...p, email: "" }));
          }}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <AuthInput
          label="Password"
          type="password"
          required
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFieldErrors((p) => ({ ...p, password: "" }));
          }}
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        <AuthInput
          label="Confirm password"
          type="password"
          required
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setFieldErrors((p) => ({ ...p, confirmPassword: "" }));
          }}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />

        {/* Password strength hint */}
        {password.length > 0 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((level) => {
              const strength =
                password.length >= 12 &&
                /[A-Z]/.test(password) &&
                /[0-9]/.test(password) &&
                /[^A-Za-z0-9]/.test(password)
                  ? 4
                  : password.length >= 10 &&
                      /[A-Z]/.test(password) &&
                      /[0-9]/.test(password)
                    ? 3
                    : password.length >= 8
                      ? 2
                      : 1;
              const colors = ["#ef4444", "#FF6B35", "#F5C518", "#4ADE80"];
              return (
                <div
                  key={level}
                  className="flex-1 h-[3px] rounded-full transition-all duration-300"
                  style={{
                    background:
                      level <= strength
                        ? colors[strength - 1]
                        : "rgba(255,255,255,0.07)",
                  }}
                />
              );
            })}
            <span className="font-ibm-mono text-[10px] text-[#444] tracking-[0.5px] shrink-0">
              {password.length >= 12 &&
              /[A-Z]/.test(password) &&
              /[0-9]/.test(password) &&
              /[^A-Za-z0-9]/.test(password)
                ? "Strong"
                : password.length >= 10 &&
                    /[A-Z]/.test(password) &&
                    /[0-9]/.test(password)
                  ? "Good"
                  : password.length >= 8
                    ? "Fair"
                    : "Weak"}
            </span>
          </div>
        )}

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
              Creating account...
            </span>
          ) : (
            "Create free account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center font-ibm-mono text-[11px] text-[#444] tracking-[0.3px]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#A3A3A3] hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
