import type { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Shared input for auth forms.
 */
export default function AuthInput({
  label,
  error,
  ...props
}: AuthInputProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </span>
      <input
        {...props}
        className={`h-11 w-full rounded-[var(--radius-md)] border bg-[var(--surface-base)] px-4 font-sans text-base text-[var(--text-primary)] placeholder:text-[var(--text-faint)] focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20"
            : "border-[var(--line-default)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
        }`}
      />
      {error ? (
        <span className="font-sans text-xs text-[var(--danger)]">{error}</span>
      ) : null}
    </label>
  );
}

