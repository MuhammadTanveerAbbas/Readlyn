"use client";

import GlitchText from "@/components/landing/GlitchText";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
  titleWidth?: string;
  subtitleWidth?: string;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  titleWidth = "w-full max-w-[700px]",
  subtitleWidth = "w-full max-w-[600px]",
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-[14px] w-full">
      {label && (
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-[1px] bg-[#F5C518]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[#F5C518] tracking-[0.2em] uppercase">
            <GlitchText text={label} speed={30} />
          </span>
        </div>
      )}
      <h2
        className={`font-grotesk font-bold text-white leading-[1.05] whitespace-pre-line ${titleWidth}`}
        style={{
          fontSize: "clamp(2rem, 3.5vw, 3rem)",
          letterSpacing: "-0.03em",
        }}
      >
        <GlitchText text={title} speed={40} delay={150} />
      </h2>
      {subtitle && (
        <p
          className={`font-ibm-mono text-[13px] text-[#666666] tracking-[0.3px] leading-[1.8] text-pretty ${subtitleWidth}`}
        >
          <GlitchText text={subtitle} speed={20} delay={350} />
        </p>
      )}
    </div>
  );
}
