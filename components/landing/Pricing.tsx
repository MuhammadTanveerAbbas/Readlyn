"use client";

import { useReveal } from "@/hooks/use-reveal";
import { PLANS } from "@/config/plans";

export default function Pricing() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="pricing"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[var(--bg-base)] py-20 px-6 md:py-[120px] md:px-[80px] lg:px-[120px] gap-12"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-[1px] bg-[var(--accent)]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[var(--accent)] tracking-[0.2em] uppercase">
            Monetization & Plans
          </span>
        </div>
        <h2
          className="font-grotesk font-bold text-white leading-[1.05]"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          Simple, transparent credit pricing.
        </h2>
        <p className="font-ibm-mono text-[13px] text-[var(--text-muted-val)] tracking-[0.3px] leading-[1.8]">
          Start free with daily AI generation credits. Upgrade anytime for unlimited projects, code exports, and team collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[1200px] mx-auto">
        {Object.values(PLANS).map((plan) => {
          const isPro = plan.id === "pro";
          return (
            <div
              key={plan.id}
              className={`group relative flex flex-col justify-between p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                isPro
                  ? "border border-[var(--accent)]/50 bg-[var(--bg-subtle)] shadow-[0_0_40px_rgba(245,197,24,0.15)]"
                  : "border border-white/[0.08] bg-[var(--bg-subtle)] hover:border-white/[0.2]"
              }`}
            >
              {isPro && (
                <div
                  className="absolute top-4 right-4 inline-flex items-center gap-1.5 h-[22px] px-2.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(245,197,24,0.15)",
                    border: "1px solid rgba(245,197,24,0.3)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="font-ibm-mono text-[9px] tracking-[0.12em] uppercase font-bold text-[var(--accent)]">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <div className="flex flex-col gap-1 mb-4">
                  <span className="font-grotesk text-xl font-bold text-white">
                    {plan.name}
                  </span>
                  <p className="font-ibm-mono text-[11px] text-[var(--text-dim)] leading-[1.6]">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 my-6">
                  <span
                    className="font-grotesk font-black text-white leading-none"
                    style={{ fontSize: "2.8rem", letterSpacing: "-0.04em" }}
                  >
                    {plan.price}
                  </span>
                  <span className="font-ibm-mono text-[11px] text-[var(--text-dim)]">
                    /{plan.period}
                  </span>
                </div>

                <div className="border-t border-white/[0.06] my-6" />

                <div className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div
                        className="flex items-center justify-center w-4 h-4 rounded-full shrink-0"
                        style={{
                          backgroundColor: "rgba(34,197,94,0.12)",
                          border: "1px solid rgba(34,197,94,0.25)",
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <path
                            d="M2 5l2.5 2.5 3.5-4"
                            stroke="var(--success)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="font-ibm-mono text-[11px] text-[var(--text-body)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="/signup"
                  className={`w-full block py-3 rounded-xl font-grotesk text-[13px] font-bold text-center transition-all duration-200 ${
                    isPro
                      ? "bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)] shadow-[0_0_24px_rgba(245,197,24,0.3)]"
                      : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                  }`}
                >
                  {plan.id === "free" ? "Start Free" : `Upgrade to ${plan.name}`}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
