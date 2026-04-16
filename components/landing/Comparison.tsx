"use client";

import { useReveal } from "@/hooks/use-reveal";

// Honest comparison: Readlyn vs other infographic/visual tools
const rows = [
  {
    feature: "AI generates full layout",
    readlyn: true,
    canva: false,
    piktochart: false,
    visme: false,
  },
  {
    feature: "Streams elements live",
    readlyn: true,
    canva: false,
    piktochart: false,
    visme: false,
  },
  {
    feature: "9 layout archetypes",
    readlyn: true,
    canva: false,
    piktochart: false,
    visme: false,
  },
  {
    feature: "Fabric.js canvas editor",
    readlyn: true,
    canva: false,
    piktochart: false,
    visme: false,
  },
  {
    feature: "Export JSON schema",
    readlyn: true,
    canva: false,
    piktochart: false,
    visme: false,
  },
  {
    feature: "Free plan available",
    readlyn: true,
    canva: true,
    piktochart: "Limited",
    visme: "Limited",
  },
];

function Cell({ val }: { val: boolean | string }) {
  if (val === true)
    return (
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l3 3 5-5"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  if (val === false)
    return (
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.03] border border-white/[0.06]">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 2l6 6M8 2l-6 6"
            stroke="#444444"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  return (
    <span className="font-ibm-mono text-[10px] text-[#F5C518] tracking-[1px] bg-[#F5C518]/10 border border-[#F5C518]/20 px-2 py-0.5 rounded-full">
      {val}
    </span>
  );
}

export default function Comparison() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="comparison"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[#080808] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-px bg-[#F5C518]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[#F5C518] tracking-[0.2em] uppercase">
            Comparison
          </span>
        </div>
        <h2
          className="font-grotesk font-bold text-white leading-[1.05] whitespace-pre-line"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {"How Readlyn\nstacks up."}
        </h2>
        <p className="font-ibm-mono text-[13px] text-[#666666] tracking-[0.3px] leading-[1.8]">
          Compared to other infographic tools. No spin just what each tool
          actually does.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block w-full rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-[#0c0c0c] border-b border-white/[0.08]">
          <div className="flex items-center px-8 py-4">
            <span className="font-ibm-mono text-[10px] font-medium text-[#555555] tracking-[0.2em] uppercase">
              Feature
            </span>
          </div>
          <div className="flex items-center justify-center px-6 py-4 bg-[#F5C518]/[0.04] border-l border-white/[0.07]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518]" />
              <span className="font-grotesk text-[12px] font-bold text-[#F5C518] tracking-[1.5px]">
                READLYN
              </span>
            </div>
          </div>
          {["Canva", "Piktochart", "Visme"].map((tool) => (
            <div
              key={tool}
              className="flex items-center justify-center px-6 py-4 border-l border-white/[0.07]"
            >
              <span className="font-ibm-mono text-[10px] font-medium text-[#555555] tracking-[0.15em] uppercase">
                {tool}
              </span>
            </div>
          ))}
        </div>

        {rows.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] hover:bg-white/[0.02] transition-colors ${i < rows.length - 1 ? "border-b border-white/[0.05]" : ""}`}
          >
            <div className="flex items-center px-8 py-5 border-r border-white/[0.05]">
              <span className="font-ibm-mono text-[12px] text-[#C0C0C0] tracking-[0.3px]">
                {row.feature}
              </span>
            </div>
            <div className="flex items-center justify-center px-6 py-5 bg-[#F5C518]/[0.02] border-r border-white/[0.05]">
              <Cell val={row.readlyn} />
            </div>
            <div className="flex items-center justify-center px-6 py-5 border-r border-white/[0.05]">
              <Cell val={row.canva} />
            </div>
            <div className="flex items-center justify-center px-6 py-5 border-r border-white/[0.05]">
              <Cell val={row.piktochart} />
            </div>
            <div className="flex items-center justify-center px-6 py-5">
              <Cell val={row.visme} />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="flex flex-col md:hidden w-full rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-[#0c0c0c] border-b border-white/[0.08]">
          <div className="px-4 py-3">
            <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[0.2em] uppercase">
              Feature
            </span>
          </div>
          <div className="flex items-center justify-center px-2 py-3 bg-[#F5C518]/[0.04]">
            <span className="font-grotesk text-[9px] font-bold text-[#F5C518] tracking-[1px]">
              US
            </span>
          </div>
          <div className="flex items-center justify-center px-2 py-3">
            <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[0.1em] uppercase">
              Canva
            </span>
          </div>
          <div className="flex items-center justify-center px-2 py-3">
            <span className="font-ibm-mono text-[9px] text-[#555555] tracking-[0.1em] uppercase">
              Pikto
            </span>
          </div>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-[2fr_1fr_1fr_1fr] ${i < rows.length - 1 ? "border-b border-white/[0.05]" : ""} hover:bg-white/[0.02] transition-colors`}
          >
            <div className="flex items-center px-4 py-4">
              <span className="font-ibm-mono text-[10px] text-[#C0C0C0] tracking-[0.3px] leading-[1.4]">
                {row.feature}
              </span>
            </div>
            <div className="flex items-center justify-center px-2 py-4 bg-[#F5C518]/[0.02]">
              <Cell val={row.readlyn} />
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <Cell val={row.canva} />
            </div>
            <div className="flex items-center justify-center px-2 py-4">
              <Cell val={row.piktochart} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
