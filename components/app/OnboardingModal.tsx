"use client";

import { useState } from "react";
import { Sparkles, Layout, Palette, Zap } from "lucide-react";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onStartPrompt?: () => void;
}

export default function OnboardingModal({ open, onClose, onStartPrompt }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const steps = [
    {
      title: "Welcome to Readlyn Studio",
      subtitle: "AI Infographic plus Visual Creation Engine",
      icon: Sparkles,
      content:
        "Describe any topic or paste raw text. Readlyn generates beautifully balanced, structured infographics in seconds.",
    },
    {
      title: "Archetypes & Smart Re-Flow",
      subtitle: "Mathematically Pre-computed Layouts",
      icon: Layout,
      content:
        "Choose from Pyramid, Funnel, Cycle, Steps, Timeline, Compare, Stats, or List archetypes with smart auto-spacing.",
    },
    {
      title: "Design Tokens & Brand Memory",
      subtitle: "Production-Grade Styling",
      icon: Palette,
      content:
        "Export W3C design tokens JSON, set persistent brand colors, plus inspect production CSS/React code directly.",
    },
  ];

  const current = steps[step];
  const IconComponent = current.icon;

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      onClose();
      onStartPrompt?.();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-6 shadow-2xl flex flex-col items-center text-center">
        <button
          onClick={() => {
            onClose();
            onStartPrompt?.();
          }}
          className="absolute top-4 right-4 text-xs font-sans text-white/40 hover:text-white"
        >
          Skip tour
        </button>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 mb-5">
          <IconComponent className="h-7 w-7 text-[var(--accent)]" />
        </div>

        <h3 className="font-sans text-xl font-bold text-white mb-1">
          {current.title}
        </h3>
        <p className="font-sans text-xs font-semibold text-[var(--accent)] mb-4 uppercase tracking-wider">
          {current.subtitle}
        </p>
        <p className="font-sans text-xs text-[var(--text-body)] leading-relaxed mb-6">
          {current.content}
        </p>

        {/* Step dots */}
        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-[var(--accent)]" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>

        <div className="w-full flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-2.5 rounded-xl border border-white/10 font-sans text-xs font-semibold text-white hover:bg-white/10"
            >
              Back
            </button>
          )}
          <button
            onClick={nextStep}
            className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] font-sans text-xs font-bold text-black hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(245,197,24,0.25)]"
          >
            {step === steps.length - 1 ? (
              <>
                <Zap className="h-3.5 w-3.5" />
                Start Creating
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
