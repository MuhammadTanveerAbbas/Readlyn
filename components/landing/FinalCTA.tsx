"use client";

import { useReveal } from "@/hooks/use-reveal";

export default function FinalCTA() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative flex flex-col items-center w-full py-32 md:py-40 px-6 text-center overflow-hidden bg-[var(--surface-sunken)]"
    >
      {/* Neutral grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,17,19,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,17,19,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Badge */}
      <div className="relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--line-default)] bg-[var(--fill-subtle)] text-[var(--text-muted)] text-[11px] font-medium tracking-[0.15em] uppercase mb-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
        </span>
        Ready to launch faster?
      </div>

      {/* Title */}
      <h2
        className="font-display font-black text-[var(--text-primary)] text-center w-full max-w-[900px] mb-6"
        style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          letterSpacing: "-0.035em",
          lineHeight: 1.02,
        }}
      >
        From prompt to published.{" "}
        <span
          style={{
            color: "var(--accent-text)",
          }}
        >
          Ship visuals without friction.
        </span>
      </h2>

      {/* Subtitle */}
      <p className="font-sans text-[13px] text-[var(--text-muted)] tracking-[0.5px] text-center max-w-[520px] mb-12 leading-[1.8]">
        We&apos;re building Readlyn in public. Try it free, no credit card
        needed, and tell us what to improve.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <a
          href="/signup"
          className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl font-sans text-[14px] font-bold text-[var(--text-primary)]
                     bg-[var(--accent)] hover:bg-[var(--accent-hover)]
                    
                    
                     transition-all duration-200
                     hover:scale-[1.02] active:scale-[0.98]"
        >
          Start free, no card needed
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
          href="https://github.com/MuhammadTanveerAbbas/Readlyn"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl
                     border border-[var(--line-default)] text-[var(--text-muted)]
                     hover:border-[var(--line-strong)] hover:text-[var(--text-primary)]
                     transition-all duration-200 font-sans text-[12px] tracking-[1px]
                     hover:scale-[1.02] active:scale-[0.98]"
        >
          View on GitHub
        </a>
      </div>

      {/* Honest note */}
      <p className="font-sans text-[11px] text-[var(--text-muted)] tracking-widest mt-10 text-center">
        Early access  Built in public  Your feedback shapes the roadmap
      </p>
    </section>
  );
}
