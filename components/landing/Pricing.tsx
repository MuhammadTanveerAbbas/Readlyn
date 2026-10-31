"use client";

import { useReveal } from "@/hooks/use-reveal";
import { PLANS } from "@/config/plans";

const VISIBLE_PLANS = ["free", "pro"] as const;

export default function Pricing() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="pricing"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[var(--surface-sunken)] py-20 px-6 md:py-[120px] md:px-[80px] lg:px-[120px] gap-12"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <span className="font-sans text-[11px] font-semibold text-[var(--accent-text)] tracking-[0.2em] uppercase">
          Pricing
        </span>
        <h2
          className="font-display font-bold text-[var(--text-primary)] leading-[1.05]"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          Simple, honest pricing.
        </h2>
        <p className="font-sans text-[13px] text-[var(--text-body)] tracking-[0.3px] leading-[1.8]">
          Every feature is unlocked for everyone during early access. Paid tiers
          arrive with the collaboration features marked coming soon.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[800px] mx-auto">
        {VISIBLE_PLANS.map((planId) => {
          const plan = PLANS[planId];
          const isFeatured = plan.id === "free";
          const isPro = plan.id === "pro";

          return (
            <div
              key={plan.id}
              className={`group relative flex flex-col justify-between p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                isFeatured
                  ? "border border-[var(--accent)]/50 bg-[var(--surface-base)]"
                  : "border border-[var(--line-default)] bg-[var(--surface-base)] hover:border-[var(--line-strong)]"
              }`}
            >
              {/* Coming Soon badge for Pro */}
              {isPro && (
                <div className="absolute top-5 right-5">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans text-[9px] font-semibold tracking-[0.15em] uppercase"
                    style={{
                      backgroundColor: "var(--info-soft)",
                      border: "1px solid var(--info)",
                      color: "var(--info)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--info)] animate-pulse" />
                    Coming soon
                  </span>
                </div>
              )}

              <div>
                <div className="flex flex-col gap-1 mb-4">
                  <span className="font-sans text-xl font-bold text-[var(--text-primary)]">
                    {plan.name}
                  </span>
                  <p className="font-sans text-[11px] text-[var(--text-muted)] leading-[1.6]">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 my-6">
                  <span
                    className="font-sans font-black text-[var(--text-primary)] leading-none"
                    style={{ fontSize: "2.8rem", letterSpacing: "-0.04em" }}
                  >
                    {plan.price}
                  </span>
                  <span className="font-sans text-[11px] text-[var(--text-muted)]">
                    /{plan.period}
                  </span>
                </div>

                <div className="border-t border-[var(--line-subtle)] my-6" />

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
                      <span className="font-sans text-[11px] text-[var(--text-body)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                {isPro ? (
                  <div
                    className="w-full flex items-center justify-center py-3 rounded-xl font-sans text-[13px] font-bold text-center cursor-not-allowed select-none"
                    style={{
                      backgroundColor: "rgba(99,102,241,0.08)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      color: "rgba(99,102,241,0.5)",
                    }}
                  >
                    Coming Soon
                  </div>
                ) : (
                  <a
                    href="/signup"
                    className="w-full block py-3 rounded-xl font-sans text-[13px] font-bold text-center transition-all duration-200 bg-[var(--accent)] text-[var(--accent-ink)] hover:bg-[var(--accent-hover)]"
                  >
                    Start Free
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
