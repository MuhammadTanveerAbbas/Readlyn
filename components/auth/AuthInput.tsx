"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/**
 * Shared input for auth forms. Includes eye toggle when type="password".
 */
export default function AuthInput({ label, error, type, ...props }: AuthInputProps) {
  const isPassword = type === "password";
  const [visible, setVisible] = useState(false);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </span>
      <div className="relative">
        <input
          {...props}
          type={isPassword ? (visible ? "text" : "password") : type}
          className={`h-11 w-full rounded-[var(--radius-md)] border bg-[var(--surface-base)] px-4 font-sans text-base text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:ring-2 transition-colors ${
            isPassword ? "pr-11" : ""
          } ${
            error
              ? "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20"
              : "border-[var(--line-default)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors duration-150"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeClosed /> : <EyeOpen />}
          </button>
        )}
      </div>
      {error ? (
        <span className="font-sans text-xs text-[var(--danger)]">{error}</span>
      ) : null}
    </label>
  );
}
