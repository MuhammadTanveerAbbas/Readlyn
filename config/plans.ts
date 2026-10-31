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
    description: "Everything you need to evaluate Readlyn and ship visuals fast",
    features: [
      "Unlimited active projects",
      "All 9 layout archetypes and 5 themes",
      "PNG, SVG, JSON, and multi-size ZIP export",
      "Canvas editing, layers, and generation history",
      "Design tokens, brand kit, and developer mode",
    ],
    limits: {
      projects: 9999,
      exports: 9999,
      aiCreditsMonthly: 3000,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "$10",
    period: "per month",
    description: "Early access tier while we build the collaboration toolkit",
    features: [
      "Everything in Free",
      "Priority Groq AI routing (coming soon)",
      "Version history with named checkpoints (coming soon)",
      "Advanced brand kits and font presets (coming soon)",
    ],
    limits: {
      projects: 9999,
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
      "Shared team libraries and brand kits (coming soon)",
      "Real time multi cursor collaboration (coming soon)",
      "Role based access with Owner, Editor, Commenter (coming soon)",
      "Audit log and version restore (coming soon)",
      "Dedicated priority support (coming soon)",
    ],
    limits: {
      projects: 99999,
      exports: 99999,
      aiCreditsMonthly: 10000,
    },
  },
};

export const FREE_PLAN: Plan = PLANS.free;

export function getPlanById(id: PlanId): Plan {
  return PLANS[id] || PLANS.free;
}
