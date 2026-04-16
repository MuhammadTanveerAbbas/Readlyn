"use client";

import { useReveal } from "@/hooks/use-reveal";

const steps = [
  {
    number: "01",
    title: "Describe your topic",
    description:
      "Type any topic or paste your content. Pick a layout archetype (Steps, Stats, Timeline, etc.) and a color theme.",
    color: "#F5C518",
    detail: "~10 seconds",
  },
  {
    number: "02",
    title: "AI builds the infographic",
    description:
      "Groq's Llama 3.3 70B generates a fully structured infographic with real element positions, streamed live to your canvas.",
    color: "#FF6B35",
    detail: "Streamed live",
    featured: true,
  },
  {
    number: "03",
    title: "Edit and export",
    description:
      "Drag, resize, recolor, and fine-tune any element on the Fabric.js canvas. Export as PNG or save the JSON to continue later.",
    color: "#4ADE80",
    detail: "PNG export",
  },
];

export default function HowItWorks() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[#080808] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-px bg-[#F5C518]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[#F5C518] tracking-[0.2em] uppercase">
            How it works
          </span>
        </div>
        <h2
          className="font-grotesk font-bold text-white leading-[1.05] whitespace-pre-line"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {"Three steps.\nPrompt to PNG."}
        </h2>
        <p className="font-ibm-mono text-[13px] text-[#666666] tracking-[0.3px] leading-[1.8]">
          No design skills needed. Just describe what you want.
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-3 relative">
        <div className="hidden md:block absolute top-[52px] left-[calc(33.33%+24px)] right-[calc(33.33%+24px)] h-px bg-gradient-to-r from-[#F5C518]/30 via-[#FF6B35]/30 to-[#4ADE80]/30" />

        {steps.map((step, i) => (
          <div
            key={i}
            className={`group relative flex flex-col gap-6 p-8 w-full md:flex-1 rounded-2xl overflow-hidden
                        border transition-all duration-500 hover:-translate-y-1
                        ${
                          step.featured
                            ? "border-[#FF6B35]/25 bg-[#0e0e0e] shadow-[0_0_0_1px_rgba(255,107,53,0.08),0_20px_60px_rgba(0,0,0,0.5)]"
                            : "border-white/[0.07] bg-[#0c0c0c] hover:border-white/[0.14]"
                        }`}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${step.color}06 0%, transparent 70%)`,
              }}
            />

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-grotesk z-10 transition-all duration-300 group-hover:scale-110"
                style={{
                  border: `1px solid ${step.color}30`,
                  backgroundColor: `${step.color}12`,
                  color: step.color,
                  boxShadow: `0 0 16px ${step.color}15`,
                }}
              >
                {step.number}
              </div>
              <span
                className="font-ibm-mono text-[10px] tracking-[0.15em] uppercase"
                style={{ color: `${step.color}80` }}
              >
                {step.detail}
              </span>
            </div>

            <div className="flex flex-col gap-3 z-10">
              <h3
                className="font-grotesk font-bold text-white leading-[1.2]"
                style={{ fontSize: "1.15rem", letterSpacing: "-0.02em" }}
              >
                {step.title}
              </h3>
              <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[0.3px] leading-[1.8]">
                {step.description}
              </p>
            </div>

            <div
              className="absolute bottom-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(to right, transparent, ${step.color}60, transparent)`,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
