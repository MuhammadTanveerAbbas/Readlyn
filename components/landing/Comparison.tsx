"use client";

import { useReveal } from "@/hooks/use-reveal";

const capabilities = [
  {
    feature: "AI generates full layout from a prompt",
    detail: "Groq Llama 3.3 70B produces structured canvas elements",
  },
  {
    feature: "Streams elements live to the canvas",
    detail: "Watch your infographic build element by element",
  },
  {
    feature: "9 layout archetypes",
    detail: "Steps, stats, timeline, compare, list, pyramid, funnel, cycle, auto",
  },
  {
    feature: "Fabric.js canvas editor",
    detail: "Move, resize, and edit every element after generation",
  },
  {
    feature: "Export PNG, JSON, and multi-size ZIP",
    detail: "Download assets you can use anywhere",
  },
  {
    feature: "Free during early access",
    detail: "No credit card required to start",
  },
];

export default function Comparison() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="comparison"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[var(--bg-base)] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-px bg-[var(--accent)]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[var(--accent)] tracking-[0.2em] uppercase">
            Capabilities
          </span>
        </div>
        <h2
          className="font-grotesk font-bold text-white leading-[1.05] whitespace-pre-line"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {"What Readlyn\ndoes today."}
        </h2>
        <p className="font-ibm-mono text-[13px] text-[var(--text-muted-val)] tracking-[0.3px] leading-[1.8]">
          A straight list of features that ship in the product right now — no
          competitor comparisons, no roadmap promises.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-white/[0.08] overflow-hidden">
        {capabilities.map((row, i) => (
          <div
            key={row.feature}
            className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 sm:px-8 py-5 hover:bg-white/[0.02] transition-colors ${
              i < capabilities.length - 1 ? "border-b border-white/[0.05]" : ""
            }`}
          >
            <div className="flex items-center gap-3 sm:w-[45%] shrink-0">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20 shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-ibm-mono text-[12px] text-[var(--text-secondary)] tracking-[0.3px]">
                {row.feature}
              </span>
            </div>
            <span className="font-ibm-mono text-[11px] text-[var(--text-dim)] tracking-[0.2px] leading-[1.6] sm:flex-1">
              {row.detail}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
