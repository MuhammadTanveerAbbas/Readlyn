"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

const faqs = [
  {
    question: "Is Readlyn really free to start?",
    answer:
      "Yes. The free plan requires no credit card. You can generate infographics, edit them on the canvas, and export PNG, SVG, or JSON right away.",
  },
  {
    question: "What AI model powers the generation?",
    answer:
      "Readlyn calls Groq through a centralized model config. The default is openai/gpt-oss-120b, with automatic fallback when a model is unavailable or rate limited.",
  },
  {
    question: "What can I export?",
    answer:
      "PNG, SVG, and JSON. Multi-format ZIP export renders A4, square, wide, story, and LinkedIn frames. Developer Mode also gives you CSS, React, SVG, and JSON snippets for any selected element.",
  },
  {
    question: "What layout types are available?",
    answer:
      "There are 9 layout archetypes: Steps, Stats, Timeline, Compare, List, Pyramid, Funnel, Cycle, and Auto. Each has pre-computed element positions so the AI output is always structured.",
  },
  {
    question: "Can I edit the generated infographic?",
    answer:
      "Yes. Every element is editable on the Fabric.js canvas. Drag, resize, rotate, recolor, change typography, adjust opacity, and more. The Layers panel and the Properties panel give you full control.",
  },
  {
    question: "Is there team collaboration?",
    answer:
      "Not yet. Readlyn is currently a single-user tool. Real-time collaboration is on the roadmap but not available today.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="faq"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[var(--surface-sunken)] py-20 px-6 md:py-[120px] md:px-[120px]"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        {/* Left */}
        <div className="flex flex-col gap-6 w-full max-w-[520px]">
          <div className="flex flex-col gap-4">
              <span className="font-sans text-[11px] font-semibold text-[var(--accent-text)] tracking-[0.2em] uppercase">
                FAQ
              </span>
            <h2
              className="font-display font-bold text-[var(--text-primary)] leading-[1.05] whitespace-pre-line"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                letterSpacing: "-0.03em",
              }}
            >
              {"Got\nquestions?"}
            </h2>
            <p className="font-sans text-[13px] text-[var(--text-body)] tracking-[0.3px] leading-[1.8]">
              Honest answers about what Readlyn does today, and what it doesn&apos;t.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--surface-base)] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zm0 9.5v-1m0-5.5v4"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-sans text-[13px] font-semibold text-[var(--text-primary)]">
                Something missing?
              </span>
            </div>
            <p className="font-sans text-[12px] text-[var(--text-muted)] leading-[1.7] tracking-[0.3px]">
              Open a GitHub issue or reach out directly. Early users shape what
              gets built next.
            </p>
            <a
              href="https://github.com/MuhammadTanveerAbbas/Readlyn/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.15em] text-[var(--accent-text)] uppercase hover:underline"
            >
              Open an issue
            </a>
          </div>
        </div>

        {/* Right: accordion */}
        <div className="flex flex-col w-full rounded-2xl border border-[var(--line-subtle)] bg-[var(--surface-base)] overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border-b border-[var(--line-subtle)] last:border-none"
              >
                <button
                  className="flex items-center justify-between w-full px-6 py-5 text-left gap-4 group hover:bg-[var(--fill-subtle)] transition-colors"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span
                    className="font-sans text-[14px] font-medium transition-colors duration-200 leading-[1.4]"
                    style={{ color: isOpen ? "var(--text-primary)" : "var(--text-secondary)" }}
                  >
                    {faq.question}
                  </span>
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: isOpen
                        ? "rgba(245,197,24,0.12)"
                        : "rgba(16,17,19,0.04)",
                      border: isOpen
                        ? "1px solid rgba(245,197,24,0.3)"
                        : "1px solid rgba(16,17,19,0.07)",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <path
                        d="M5 1v8M1 5h8"
                        stroke={isOpen ? "var(--accent)" : "var(--text-muted)"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "200px" : "0px" }}
                >
                  <div className="px-6 pb-5">
                    <p className="font-sans text-[12px] text-[var(--text-body)] tracking-[0.3px] leading-[1.8]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
