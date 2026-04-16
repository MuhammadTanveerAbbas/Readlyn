"use client";

import { useReveal } from "@/hooks/use-reveal";

const items = [
  {
    id: "01",
    title: "AI Content\nGeneration",
    description:
      "Groq's Llama 3.3 70B writes real, structured content for your infographic  not filler text. Streamed live to the canvas.",
    tag: "GROQ AI",
    tagColor: "#0A0A0A",
    tagBg: "#F5C518",
    accent: "#F5C518",
    bg: "#F5C518",
    dark: false,
    size: "large",
  },
  {
    id: "02",
    title: "Layers\nPanel",
    description:
      "Full layer management with visibility toggle, lock/unlock, and per-layer deletion. See every element at a glance.",
    tag: "EDITOR",
    tagColor: "#F5C518",
    tagBg: "transparent",
    accent: "#F5C518",
    bg: "#0f0f0f",
    dark: true,
    size: "normal",
  },
  {
    id: "03",
    title: "Properties\nPanel",
    description:
      "Edit X, Y, width, height, rotation, opacity, fill, stroke, border radius, and typography per selected element.",
    tag: "INSPECT",
    tagColor: "#FF6B35",
    tagBg: "transparent",
    accent: "#FF6B35",
    bg: "#0a0a0a",
    dark: true,
    size: "normal",
  },
  {
    id: "04",
    title: "Export\nPNG or JSON",
    description:
      "Download as high-res PNG or save the raw JSON schema to reload and continue editing. Your work stays yours.",
    tag: "EXPORT",
    tagColor: "#A78BFA",
    tagBg: "transparent",
    accent: "#A78BFA",
    bg: "#0f0f0f",
    dark: true,
    size: "normal",
  },
  {
    id: "05",
    title: "AI Context\nActions",
    description:
      "Right-click any element to rewrite text, suggest a layout, pick a theme, or vary the element  all powered by Groq.",
    tag: "AI",
    tagColor: "#FF6B35",
    tagBg: "transparent",
    accent: "#FF6B35",
    bg: "#0c0c0c",
    dark: true,
    size: "featured",
  },
  {
    id: "06",
    title: "Generation\nHistory",
    description:
      "Every generation is saved per project. Browse past versions, restore a previous canvas, or compare iterations.",
    tag: "HISTORY",
    tagColor: "#4ADE80",
    tagBg: "transparent",
    accent: "#4ADE80",
    bg: "#0a0a0a",
    dark: true,
    size: "normal",
  },
];

export default function Bento() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[#060606] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-px bg-[#F5C518]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[#F5C518] tracking-[0.2em] uppercase">
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
          {"What's inside\nthe editor."}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.slice(0, 3).map((item) => (
          <BentoCard key={item.id} item={item} />
        ))}
        {items.slice(3, 6).map((item) => (
          <BentoCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function BentoCard({ item }: { item: (typeof items)[0] }) {
  const isFeatured = item.size === "featured";
  const isYellow = !item.dark;

  return (
    <div
      className={`group relative flex flex-col gap-5 p-8 md:p-10 rounded-2xl overflow-hidden
                  transition-all duration-500 hover:-translate-y-1
                  ${isFeatured ? "border-2" : "border"}
                  ${isYellow ? "" : "hover:border-opacity-30"}`}
      style={{
        backgroundColor: item.bg,
        borderColor: isFeatured
          ? `${item.accent}40`
          : item.dark
            ? "rgba(255,255,255,0.07)"
            : "transparent",
        minHeight: "260px",
        boxShadow: isFeatured
          ? `0 0 0 1px ${item.accent}15, 0 20px 60px rgba(0,0,0,0.5)`
          : undefined,
      }}
    >
      {item.dark && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${item.accent}08 0%, transparent 70%)`,
          }}
        />
      )}
      {item.dark && (
        <div
          className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to right, transparent, ${item.accent}60, transparent)`,
          }}
        />
      )}

      <span
        className="font-ibm-mono text-[11px] font-bold tracking-[2px]"
        style={{ color: isYellow ? "#1A1A1A" : item.accent }}
      >
        [{item.id}]
      </span>

      <h3
        className="font-grotesk font-bold leading-[1.1] whitespace-pre-line"
        style={{
          fontSize: "clamp(1.4rem, 2vw, 1.75rem)",
          letterSpacing: "-0.02em",
          color: isYellow ? "#0A0A0A" : "#F5F5F0",
        }}
      >
        {item.title}
      </h3>

      <p
        className="font-ibm-mono text-[12px] tracking-[0.5px] leading-[1.7]"
        style={{ color: isYellow ? "#1A1A1A" : "#666666" }}
      >
        {item.description}
      </p>

      <div className="mt-auto">
        <div
          className="inline-flex items-center justify-center h-[26px] px-3 rounded-full"
          style={{
            backgroundColor: isYellow ? "#0A0A0A" : `${item.accent}12`,
            border: isYellow ? "none" : `1px solid ${item.accent}30`,
          }}
        >
          <span
            className="font-ibm-mono text-[10px] font-bold tracking-[2px]"
            style={{ color: isYellow ? "#F5C518" : item.tagColor }}
          >
            [{item.tag}]
          </span>
        </div>
      </div>
    </div>
  );
}
