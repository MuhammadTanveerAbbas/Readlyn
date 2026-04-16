"use client";

import { useReveal } from "@/hooks/use-reveal";

interface FeatureCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  index: number;
}

function FeatureCard({
  icon,
  iconColor,
  title,
  description,
  tag,
  tagColor,
  index,
}: FeatureCardProps) {
  return (
    <div
      className="group relative flex flex-col gap-6 p-8 w-full md:flex-1 overflow-hidden
                 border border-white/[0.07] bg-[#0c0c0c]
                 hover:border-white/[0.14]
                 transition-all duration-500 cursor-default
                 hover:-translate-y-1 rounded-2xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${tagColor}08 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${tagColor}80, transparent)`,
        }}
      />

      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{
          backgroundColor: `${iconColor}12`,
          border: `1px solid ${iconColor}25`,
          boxShadow: `0 0 20px ${iconColor}10`,
        }}
      >
        <div style={{ color: iconColor }}>{icon}</div>
      </div>

      <div className="flex flex-col gap-3">
        <h3
          className="font-grotesk font-bold text-white leading-[1.2] whitespace-pre-line"
          style={{ fontSize: "1.15rem", letterSpacing: "-0.02em" }}
        >
          {title}
        </h3>
        <p className="font-ibm-mono text-[12px] text-[#777777] tracking-[0.3px] leading-[1.8]">
          {description}
        </p>
      </div>

      <div className="mt-auto">
        <div
          className="inline-flex items-center gap-1.5 h-[26px] px-3 rounded-full"
          style={{
            backgroundColor: `${tagColor}10`,
            border: `1px solid ${tagColor}25`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: tagColor }}
          />
          <span
            className="font-ibm-mono text-[10px] tracking-[0.12em] uppercase font-semibold"
            style={{ color: tagColor }}
          >
            {tag}
          </span>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconColor: "#F5C518",
    title: "AI generation\nwith Groq",
    description:
      "Describe any topic and Llama 3.3 70B generates a complete, structured infographic with real layout positions  not just placeholder text.",
    tag: "Groq AI",
    tagColor: "#F5C518",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="2"
          y="2"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="2"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="2"
          y="11"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect
          x="11"
          y="11"
          width="7"
          height="7"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    iconColor: "#FF6B35",
    title: "9 layout\narchetypes",
    description:
      "Steps, Stats, Timeline, Compare, List, Pyramid, Funnel, Cycle, or Auto  each with pre-computed element positions so the layout is always structured.",
    tag: "Layouts",
    tagColor: "#FF6B35",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 6v4l3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    iconColor: "#A78BFA",
    title: "Interactive\ncanvas editor",
    description:
      "Drag, resize, rotate, and edit any element on the Fabric.js canvas. Layers panel, properties panel, undo/redo, zoom, and pan all included.",
    tag: "Editor",
    tagColor: "#A78BFA",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 10h14M10 3l7 7-7 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconColor: "#4ADE80",
    title: "Export PNG\nor JSON",
    description:
      "Download your infographic as a high-res PNG or save the raw JSON schema to reload and continue editing later.",
    tag: "Export",
    tagColor: "#4ADE80",
  },
];

export default function Features() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="features"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[#060606] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-px bg-[#F5C518]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[#F5C518] tracking-[0.2em] uppercase">
            Features
          </span>
        </div>
        <h2
          className="font-grotesk font-bold text-white leading-[1.05] whitespace-pre-line"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {"Everything you need.\nNothing you don't."}
        </h2>
        <p className="font-ibm-mono text-[13px] text-[#666666] tracking-[0.3px] leading-[1.8]">
          From prompt to polished infographic AI generation, a full canvas
          editor, and PNG export in one tool.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} index={i} />
        ))}
      </div>
    </section>
  );
}
