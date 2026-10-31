"use client";

import { useReveal } from "@/hooks/use-reveal";

const steps = [
  {
    number: "01",
    title: "Describe your topic",
    description:
      "Type any topic or paste your content. Pick a layout archetype (Steps, Stats, Timeline, etc.) and a color theme.",
    color: "var(--accent)",
    detail: "Seconds",
  },
  {
    number: "02",
    title: "AI builds the infographic",
    description:
      "Groq returns a validated infographic document with real element positions, streamed live to your canvas.",
    color: "var(--orange)",
    detail: "Streamed live",
    featured: true,
  },
  {
    number: "03",
    title: "Edit and export",
    description:
      "Drag, resize, recolor, and edit text on the Fabric.js canvas. Export as PNG, SVG, or JSON, or generate a multi-size ZIP.",
    color: "var(--success)",
    detail: "PNG, SVG, JSON",
  },
];

export default function HowItWorks() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[var(--surface-sunken)] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <span className="font-sans text-[11px] font-semibold text-[var(--accent-text)] tracking-[0.2em] uppercase">
            How it works
          </span>
        <h2
          className="font-display font-bold text-[var(--text-primary)] leading-[1.05] whitespace-pre-line"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {"Three steps.\nPrompt to export."}
        </h2>
        <p className="font-sans text-[13px] text-[var(--text-body)] tracking-[0.3px] leading-[1.8]">
          No design skills needed. Just describe what you want.
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-3 relative">
        <div className="hidden md:block absolute top-[52px] left-[calc(33.33%+24px)] right-[calc(33.33%+24px)] h-px bg-[var(--line-default)]" />

        {steps.map((step, i) => (
          <div
            key={i}
            className={`group relative flex flex-col gap-6 p-8 w-full md:flex-1 rounded-2xl overflow-hidden
                        border transition-all duration-500 hover:-translate-y-1
                        ${
                          step.featured
                            ? "border-[var(--orange)]/25 bg-[var(--surface-base)] shadow-[0_20px_60px_rgba(17,17,19,0.10)]"
                            : "border-[var(--line-subtle)] bg-[var(--surface-base)] hover:border-[var(--line-default)]"
                        }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-sans z-10 transition-all duration-300 group-hover:scale-110"
                style={{
                  border: `1px solid ${step.color}30`,
                  backgroundColor: `${step.color}12`,
                  color: step.color,
                }}
              >
                {step.number}
              </div>
              <span
                className="font-sans text-[10px] tracking-[0.15em] uppercase"
                style={{ color: `${step.color}80` }}
              >
                {step.detail}
              </span>
            </div>

            <div className="flex flex-col gap-3 z-10">
              <h3
                className="font-display font-bold text-[var(--text-primary)] leading-[1.2]"
                style={{ fontSize: "1.15rem", letterSpacing: "-0.02em" }}
              >
                {step.title}
              </h3>
              <p className="font-sans text-[12px] text-[var(--text-body)] tracking-[0.3px] leading-[1.8]">
                {step.description}
              </p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
