"use client";

import { useReveal } from "@/hooks/use-reveal";

const stats = [
  {
    value: "9",
    suffix: "",
    label: "Layout archetypes",
    description: "Steps, Stats, Timeline, Compare, and more",
  },
  {
    value: "5",
    suffix: "",
    label: "Color themes",
    description: "Violet, Ocean, Ember, Forest, Slate",
  },
  {
    value: "3",
    suffix: "",
    label: "Canvas sizes",
    description: "A4 Portrait, Square, Wide",
  },
  {
    value: "Free",
    suffix: "",
    label: "To start",
    description: "No credit card, no time limit",
  },
];

export default function Stats() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative w-full py-20 md:py-24 bg-[#060606] border-y border-white/[0.06]"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(245,197,24,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative px-6 md:px-[120px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 items-center justify-center py-8 md:py-10
                ${i < stats.length - 1 ? "border-r border-white/[0.06]" : ""}
                ${i >= 2 ? "border-t border-white/[0.06] md:border-t-0" : ""}
              `}
            >
              <span
                className="font-grotesk font-black text-white leading-none"
                style={{
                  fontSize: "clamp(2.8rem, 5vw, 4rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                {stat.value}
                <span className="text-[#F5C518]">{stat.suffix}</span>
              </span>
              <span className="font-grotesk text-[14px] font-semibold text-[#E2E2E2] tracking-[-0.01em]">
                {stat.label}
              </span>
              <span className="font-ibm-mono text-[10px] text-[#555555] tracking-[0.1em] text-center">
                {stat.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
