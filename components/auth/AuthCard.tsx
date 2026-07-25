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
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Background glows */}
      <div
        className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(245,197,24,0.08) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute -left-40 top-1/3 h-[400px] w-[400px] pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-40 bottom-1/3 h-[400px] w-[400px] pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,53,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

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
            <span className="font-grotesk text-[13px] font-bold text-white tracking-[2.5px]">
              READLYN
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_rgba(245,197,24,0.8)]" />
          </Link>
        </div>

        {/* Card */}
        <div
          className="w-full rounded-2xl p-8"
          style={{
            background: "rgba(13,13,13,0.9)",
            border: "1px solid var(--border-default)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03), 0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(245,197,24,0.03)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="mb-7">
            <h1
              className="font-grotesk font-bold text-white"
              style={{ fontSize: "1.6rem", letterSpacing: "-0.03em" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 font-ibm-mono text-[12px] text-[var(--text-dim)] tracking-[0.4px] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center font-ibm-mono text-[10px] text-[#555] tracking-[0.5px] leading-relaxed">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-[var(--text-dim)] hover:text-[var(--text-body)] transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[var(--text-dim)] hover:text-[var(--text-body)] transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>

      </div>
    </main>
  );
}
