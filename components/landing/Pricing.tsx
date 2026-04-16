"use client";

import { useReveal } from "@/hooks/use-reveal";

interface PricingCardProps {
  tier: string;
  name: string;
  price: string;
  period?: string;
  btnLabel: string;
  btnHref?: string;
  features: { label: string; included: boolean }[];
  featured?: boolean;
  description: string;
}

function PricingCard({
  tier,
  name,
  price,
  period = "/mo",
  btnLabel,
  btnHref = "/signup",
  features,
  featured = false,
  description,
}: PricingCardProps) {
  return (
    <div
      className={`group relative flex flex-col gap-8 p-8 md:p-10 w-full md:flex-1 rounded-2xl overflow-hidden
                  transition-all duration-500 hover:-translate-y-1
                  ${
                    featured
                      ? "border border-[#F5C518]/30 bg-[#0e0e0e] shadow-[0_0_0_1px_rgba(245,197,24,0.08),0_24px_80px_rgba(0,0,0,0.7)]"
                      : "border border-white/[0.07] bg-[#0c0c0c] hover:border-white/[0.14]"
                  }`}
    >
      {/* Glow */}
      {featured && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,197,24,0.05) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Popular badge */}
      {featured && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-[#F5C518] text-black text-[11px] font-bold font-grotesk tracking-[1px] rounded-b-lg whitespace-nowrap">
          Most Popular
        </div>
      )}

      {/* Tier */}
      <div className="flex items-center justify-between">
        <div
          className="inline-flex items-center gap-1.5 h-[26px] px-3 rounded-full"
          style={{
            backgroundColor: featured
              ? "rgba(245,197,24,0.12)"
              : "rgba(255,255,255,0.05)",
            border: featured
              ? "1px solid rgba(245,197,24,0.25)"
              : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {featured && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518]" />
          )}
          <span
            className="font-ibm-mono text-[10px] tracking-[0.12em] uppercase font-semibold"
            style={{ color: featured ? "#F5C518" : "#666666" }}
          >
            {tier}
          </span>
        </div>
      </div>

      {/* Name + description */}
      <div className="flex flex-col gap-2">
        <span className="font-grotesk text-[1.5rem] font-bold text-white tracking-[-0.02em]">
          {name}
        </span>
        <p className="font-ibm-mono text-[12px] text-[#555555] tracking-[0.3px] leading-[1.7]">
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1">
        <span className="font-grotesk text-[#666666] text-lg align-top mt-2">
          $
        </span>
        <span
          className="font-grotesk font-black text-white leading-none"
          style={{ fontSize: "3.5rem", letterSpacing: "-0.04em" }}
        >
          {price}
        </span>
        <span className="font-ibm-mono text-[12px] text-[#555555] tracking-[1px] mb-2">
          {period}
        </span>
      </div>

      {/* CTA */}
      <a
        href={btnHref}
        className={`w-full py-3 rounded-xl font-grotesk text-[13px] font-bold text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
          ${
            featured
              ? "bg-[#F5C518] text-black hover:bg-[#FFDC40] shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:shadow-[0_0_30px_rgba(245,197,24,0.5)]"
              : "border border-white/10 text-[#A3A3A3] hover:border-white/25 hover:text-white"
          }`}
      >
        {btnLabel}
      </a>

      {/* Divider */}
      <div className="border-t border-white/[0.06]" />

      {/* Feature list */}
      <div className="flex flex-col gap-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
              style={{
                backgroundColor: f.included
                  ? "rgba(34,197,94,0.1)"
                  : "rgba(255,255,255,0.03)",
                border: f.included
                  ? "1px solid rgba(34,197,94,0.2)"
                  : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {f.included ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5 3.5-4"
                    stroke="#22c55e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1.5 1.5l5 5M6.5 1.5l-5 5"
                    stroke="#333333"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
            <span
              className="font-ibm-mono text-[11px] tracking-[0.3px]"
              style={{ color: f.included ? "#A3A3A3" : "#3D3D3D" }}
            >
              {f.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const BUILDER_FEATURES = [
  { label: "Up to 3 projects", included: true },
  { label: "PNG export", included: true },
  { label: "All 9 layout archetypes", included: true },
  { label: "All 5 color themes", included: true },
  { label: "Canvas editor", included: true },
  { label: "Generation history", included: false },
  { label: "Multi-format ZIP export", included: false },
  { label: "Priority support", included: false },
];

const ARCHITECT_FEATURES = [
  { label: "Unlimited projects", included: true },
  { label: "PNG export", included: true },
  { label: "All 9 layout archetypes", included: true },
  { label: "All 5 color themes", included: true },
  { label: "Canvas editor", included: true },
  { label: "Generation history", included: true },
  { label: "Multi-format ZIP export", included: true },
  { label: "Priority support", included: false },
];

const SYSTEM_FEATURES = [
  { label: "Unlimited projects", included: true },
  { label: "PNG export", included: true },
  { label: "All 9 layout archetypes", included: true },
  { label: "All 5 color themes", included: true },
  { label: "Canvas editor", included: true },
  { label: "Generation history", included: true },
  { label: "Multi-format ZIP export", included: true },
  { label: "Priority support", included: true },
];

export default function Pricing() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="pricing"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[#060606] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-[1px] bg-[#F5C518]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[#F5C518] tracking-[0.2em] uppercase">
            Pricing
          </span>
        </div>
        <h2
          className="font-grotesk font-bold text-white leading-[1.05] whitespace-pre-line"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {"Simple pricing.\nScale when ready."}
        </h2>
        <p className="font-ibm-mono text-[13px] text-[#666666] tracking-[0.3px] leading-[1.8]">
          Start free, upgrade only when your team needs advanced collaboration
          and control.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row w-full gap-3 items-start">
        <PricingCard
          tier="Free tier"
          name="Builder"
          price="0"
          btnLabel="Start building free"
          description="Perfect for solo builders and side projects."
          features={BUILDER_FEATURES}
        />
        <PricingCard
          tier="Most popular"
          name="Architect"
          price="49"
          btnLabel="Upgrade to Architect"
          description="For growing teams that need collaboration and scale."
          features={ARCHITECT_FEATURES}
          featured
        />
        <PricingCard
          tier="Enterprise"
          name="System"
          price="149"
          btnLabel="Contact sales"
          btnHref="/contact"
          description="Full power for large teams with custom needs."
          features={SYSTEM_FEATURES}
        />
      </div>

      {/* Trust note */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
        {[
          "No credit card required",
          "Cancel anytime",
          "Early access pricing",
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7l3.5 3.5 6.5-7"
                stroke="#22c55e"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[0.1em]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
