"use client";

import { useReveal } from "@/hooks/use-reveal";
import { FREE_PLAN } from "@/config/plans";

interface PricingCardProps {
  tier: string;
  name: string;
  price: string;
  period?: string;
  btnLabel: string;
  btnHref?: string;
  features: string[];
  description: string;
}

function PricingCard({
  tier,
  name,
  price,
  period = "",
  btnLabel,
  btnHref = "/signup",
  features,
  description,
}: PricingCardProps) {
  return (
    <div
      className="group relative flex flex-col gap-8 p-8 md:p-10 w-full max-w-[480px] mx-auto rounded-2xl overflow-hidden
                  border border-[var(--accent)]/30 bg-[var(--bg-subtle)]
                  shadow-[0_0_0_1px_rgba(245,197,24,0.08),0_24px_80px_rgba(0,0,0,0.7)]
                  transition-all duration-500 hover:-translate-y-1"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,197,24,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="flex items-center justify-between">
        <div
          className="inline-flex items-center gap-1.5 h-[26px] px-3 rounded-full"
          style={{
            backgroundColor: "rgba(245,197,24,0.12)",
            border: "1px solid rgba(245,197,24,0.25)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          <span className="font-ibm-mono text-[10px] tracking-[0.12em] uppercase font-semibold text-[var(--accent)]">
            {tier}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-grotesk text-[1.5rem] font-bold text-white tracking-[-0.02em]">
          {name}
        </span>
        <p className="font-ibm-mono text-[12px] text-[var(--text-dim)] tracking-[0.3px] leading-[1.7]">
          {description}
        </p>
      </div>

      <div className="flex items-end gap-1">
        <span className="font-grotesk text-[var(--text-muted-val)] text-lg align-top mt-2">
          $
        </span>
        <span
          className="font-grotesk font-black text-white leading-none"
          style={{ fontSize: "3.5rem", letterSpacing: "-0.04em" }}
        >
          {price}
        </span>
        {period && (
          <span className="font-ibm-mono text-[12px] text-[var(--text-dim)] tracking-[1px] mb-2">
            {period}
          </span>
        )}
      </div>

      <a
        href={btnHref}
        className="w-full py-3 rounded-xl font-grotesk text-[13px] font-bold text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
          bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)] shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:shadow-[0_0_30px_rgba(245,197,24,0.5)]"
      >
        {btnLabel}
      </a>

      <div className="border-t border-white/[0.06]" />

      <div className="flex flex-col gap-3">
        {features.map((label) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
              style={{
                backgroundColor: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 5l2.5 2.5 3.5-4"
                  stroke="var(--success)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-ibm-mono text-[11px] tracking-[0.3px] text-[var(--text-body)]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Pricing() {
  const ref = useReveal() as React.RefObject<HTMLElement>;
  const plan = FREE_PLAN;

  return (
    <section
      id="pricing"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[var(--bg-base)] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-[1px] bg-[var(--accent)]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[var(--accent)] tracking-[0.2em] uppercase">
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
          {"Free during early access."}
        </h2>
        <p className="font-ibm-mono text-[13px] text-[var(--text-muted-val)] tracking-[0.3px] leading-[1.8]">
          Readlyn is free while we&apos;re in early access. Paid plans may come
          later — for now, everything below is included at no cost.
        </p>
      </div>

      <PricingCard
        tier="Early access"
        name={plan.name}
        price="0"
        btnLabel="Create a free account"
        description={plan.description}
        features={plan.features}
      />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
        {[
          "No credit card required",
          `${plan.limits.generationsPerDay} AI generations per day`,
          `${plan.limits.projects} projects included`,
        ].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7l3.5 3.5 6.5-7"
                stroke="var(--success)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-ibm-mono text-[11px] text-[var(--text-dim)] tracking-[0.1em]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
