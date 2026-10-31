"use client";

import { useReveal } from "@/hooks/use-reveal";

const items = [
  {
    id: "01",
    title: "AI Content\nGeneration",
    description:
      "Groq returns a validated infographic document, streamed element by element onto the canvas. Real positions, real copy, no placeholder blocks.",
    tag: "GROQ AI",
    tagColor: "var(--surface-base)",
    tagBg: "var(--accent)",
    accent: "var(--accent)",
    bg: "var(--accent)",
    dark: false,
    size: "large",
  },
  {
    id: "02",
    title: "Layers\nPanel",
    description:
      "Full layer management with visibility toggle, lock/unlock, reorder, and per-layer deletion. See every element at a glance.",
    tag: "EDITOR",
    tagColor: "var(--accent)",
    tagBg: "transparent",
    accent: "var(--accent)",
    bg: "var(--surface-base)",
    dark: true,
    size: "normal",
  },
  {
    id: "03",
    title: "Properties\nPanel",
    description:
      "Edit X, Y, width, height, rotation, opacity, fill, stroke, stroke width, border radius, line height, letter spacing, and typography per element.",
    tag: "INSPECT",
    tagColor: "var(--orange)",
    tagBg: "transparent",
    accent: "var(--orange)",
    bg: "var(--surface-base)",
    dark: true,
    size: "normal",
  },
  {
    id: "04",
    title: "Export\nPNG, SVG, JSON",
    description:
      "Download a high-res PNG, a clean SVG, or the JSON document. Multi-format ZIP export adds A4, square, wide, story, and LinkedIn frames.",
    tag: "EXPORT",
    tagColor: "var(--accent)",
    tagBg: "transparent",
    accent: "var(--accent)",
    bg: "var(--surface-base)",
    dark: true,
    size: "normal",
  },
  {
    id: "05",
    title: "Command\npalette",
    description:
      "Press Ctrl+K to search every editor command. Right-click a selected element to duplicate it, change its order, or delete it without leaving the canvas.",
    tag: "EDITOR",
    tagColor: "var(--orange)",
    tagBg: "transparent",
    accent: "var(--orange)",
    bg: "var(--surface-base)",
    dark: true,
    size: "featured",
  },
  {
    id: "06",
    title: "Generation\nHistory",
    description:
      "Every generation is saved per project. Browse past versions by thumbnail, restore a previous canvas, or delete entries you no longer need.",
    tag: "HISTORY",
    tagColor: "var(--success)",
    tagBg: "transparent",
    accent: "var(--success)",
    bg: "var(--surface-base)",
    dark: true,
    size: "normal",
  },
];

export default function Bento() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[var(--surface-sunken)] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <span className="font-sans text-[11px] font-semibold text-[var(--accent-text)] tracking-[0.2em] uppercase">
            Capabilities
          </span>
        <h2
          className="font-display font-bold text-[var(--text-primary)] leading-[1.05] whitespace-pre-line"
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
            ? "rgba(16,17,19,0.07)"
            : "transparent",
        minHeight: "260px",
        boxShadow: isFeatured ? "0 20px 60px rgba(17,17,19,0.10)" : undefined,
      }}
    >
      <span
        className="font-sans text-[11px] font-bold tracking-[2px]"
        style={{ color: isYellow ? "rgba(17,17,19,0.55)" : item.accent }}
      >
        [{item.id}]
      </span>

      <h3
        className="font-display font-bold leading-[1.1] whitespace-pre-line"
        style={{
          fontSize: "clamp(1.4rem, 2vw, 1.75rem)",
          letterSpacing: "-0.02em",
          color: isYellow ? "var(--accent-ink)" : "var(--text-primary)",
        }}
      >
        {item.title}
      </h3>

      <p
        className="font-sans text-[12px] tracking-[0.5px] leading-[1.7]"
        style={{ color: isYellow ? "rgba(17,17,19,0.72)" : "var(--text-body)" }}
      >
        {item.description}
      </p>

      <div className="mt-auto">
        <div
          className="inline-flex items-center justify-center h-[26px] px-3 rounded-full"
          style={{
            backgroundColor: isYellow ? "rgba(255,255,255,0.55)" : `${item.accent}12`,
            border: isYellow ? "none" : `1px solid ${item.accent}30`,
          }}
        >
          <span
            className="font-sans text-[10px] font-bold tracking-[2px]"
            style={{ color: isYellow ? "var(--accent-ink)" : item.tagColor }}
          >
            [{item.tag}]
          </span>
        </div>
      </div>
    </div>
  );
}
