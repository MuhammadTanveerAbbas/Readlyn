import type { ReactNode } from "react";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ backgroundColor: "var(--surface-sunken)" }}
    >
      <div className="relative z-10 w-full max-w-[420px] animate-fade-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <img
              src="/favicon.svg"
              alt="Readlyn"
              width={22}
              height={22}
              className="group-hover:scale-110 transition-transform duration-200"
              style={{ imageRendering: "pixelated" }}
            />
            <span className="font-sans text-[13px] font-bold text-[var(--text-primary)] tracking-[2.5px]">
              READLYN
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          </Link>
        </div>

        {/* Card */}
        <div
          className="w-full rounded-2xl p-8"
          style={{
            background: "var(--surface-base)",
            border: "1px solid var(--line-default)",
            boxShadow: "0 24px 60px rgba(17,17,19,0.10)",
          }}
        >
          {/* Header */}
          <div className="mb-7">
            <h1
              className="font-sans font-bold text-[var(--text-primary)]"
              style={{ fontSize: "1.6rem", letterSpacing: "-0.03em" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 font-sans text-[12px] text-[var(--text-muted)] tracking-[0.4px] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center font-sans text-[10px] text-[var(--text-muted)] tracking-[0.5px] leading-relaxed">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[var(--text-muted)] hover:text-[var(--text-body)] transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>

      </div>
    </main>
  );
}
