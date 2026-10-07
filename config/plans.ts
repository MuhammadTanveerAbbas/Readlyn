export type PlanId = "free" | "pro" | "team";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limits: {
    projects: number;
    generationsPerDay: number;
    exports: number;
    aiCreditsMonthly: number;
  };
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to evaluate Readlyn plus ship visuals fast",
    features: [
      "Unlimited active projects",
      "100 AI generations per day (fair use)",
      "All 9 layout archetypes plus 5 themes",
      "PNG, JSON plus multi size ZIP export",
      "Canvas editing, layers plus generation history",
      "Design tokens, brand kit plus dev mode inspect",
    ],
    limits: {
      projects: 9999,
      generationsPerDay: 100,
      exports: 9999,
      aiCreditsMonthly: 3000,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "$15",
    period: "per month",
    description: "Early access tier while we build the collaboration toolkit",
    features: [
      "Everything in Free",
      "Priority Groq AI routing (coming soon)",
      "Version history with named checkpoints (coming soon)",
      "React component plus HTML/CSS code export (coming soon)",
      "Advanced brand kits plus font presets (coming soon)",
    ],
    limits: {
      projects: 9999,
      generationsPerDay: 100,
      exports: 9999,
      aiCreditsMonthly: 3000,
    },
  },
  team: {
    id: "team",
    name: "Team",
    price: "$35",
    period: "per user / month",
    description: "Reserved for teams. Nothing here ships today, we label it honestly",
    features: [
      "Everything in Pro",
      "Shared team libraries plus brand kits (coming soon)",
      "Real time multi cursor collaboration (coming soon)",
      "Role based access with Owner, Editor, Commenter (coming soon)",
      "Audit log plus version restore (coming soon)",
      "Dedicated priority support (coming soon)",
    ],
    limits: {
      projects: 99999,
      generationsPerDay: 500,
      exports: 99999,
      aiCreditsMonthly: 10000,
    },
  },
};

export const FREE_PLAN: Plan = PLANS.free;

/**
 * Fair use safety net shared by every account. Not a plan gate, it only stops
 * one account from exhausting the AI provider quota for everyone else.
 */
export const FAIR_USE_DAILY_GENERATIONS = 100;

export function getPlanById(id: PlanId): Plan {
  return PLANS[id] || PLANS.free;
}
