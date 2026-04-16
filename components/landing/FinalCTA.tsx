"use client";

import { useReveal } from "@/hooks/use-reveal";

export default function FinalCTA() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative flex flex-col items-center w-full py-32 md:py-40 px-6 text-center overflow-hidden bg-[#060606]"
    >
      {/* Background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(245,197,24,0.06) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Decorative orbs */}
      <div
        className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,139,255,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Badge */}
      <div className="relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[#888888] text-[11px] font-medium tracking-[0.15em] uppercase mb-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5C518] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5C518]" />
        </span>
        Ready to launch faster?
      </div>

      {/* Title */}
      <h2
        className="font-grotesk font-black text-white text-center w-full max-w-[900px] mb-6"
        style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          letterSpacing: "-0.035em",
          lineHeight: 1.02,
        }}
      >
        From concept to code.{" "}
        <span
          style={{
            color: "#F5C518",
            textShadow: "0 0 40px rgba(245,197,24,0.3)",
          }}
        >
          Ship without friction.
        </span>
      </h2>

      {/* Subtitle */}
      <p className="font-ibm-mono text-[13px] text-[#555555] tracking-[0.5px] text-center max-w-[520px] mb-12 leading-[1.8]">
        We&apos;re building Readlyn in public. Try it free, no credit card
        needed, and tell us what to improve.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <a
          href="/signup"
          className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl font-grotesk text-[14px] font-bold text-black
                     bg-[#F5C518] hover:bg-[#FFDC40]
                     shadow-[0_0_30px_rgba(245,197,24,0.35)]
                     hover:shadow-[0_0_50px_rgba(245,197,24,0.55)]
                     transition-all duration-200
                     hover:scale-[1.02] active:scale-[0.98]"
        >
          Start free no card needed
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="group-hover:translate-x-0.5 transition-transform"
          >
            <path
              d="M1 7h12M8 3l5 4-5 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          href="https://github.com"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl
                     border border-white/10 text-[#888888]
                     hover:border-white/25 hover:text-white
                     transition-all duration-200 font-ibm-mono text-[12px] tracking-[1px]
                     hover:scale-[1.02] active:scale-[0.98]"
        >
          View on GitHub
        </a>
      </div>

      {/* Honest note */}
      <p className="font-ibm-mono text-[11px] text-[#444444] tracking-widest mt-10 text-center">
        Early access · Built in public · Your feedback shapes the roadmap
      </p>
    </section>
  );
}
