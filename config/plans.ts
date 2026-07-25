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
    description: "Ideal for evaluating Readlyn and creating quick infographics",
    features: [
      "Up to 3 active projects",
      "5 AI generations per day (150/mo)",
      "All 9 layout archetypes & 5 themes",
      "PNG, SVG, and JSON export",
      "Canvas editing & basic layers",
      "Generation history",
    ],
    limits: {
      projects: 3,
      generationsPerDay: 5,
      exports: 50,
      aiCreditsMonthly: 150,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "$15",
    period: "per month",
    description: "For professionals who need unlimited projects and advanced code export",
    features: [
      "Unlimited active projects",
      "100 AI generations per day (3,000/mo)",
      "React Component & HTML/CSS code export",
      "Dev Mode / CSS inspect panel",
      "Design Tokens JSON export",
      "Version history & named checkpoints",
      "Persistent Brand Memory kit",
      "Priority Groq AI routing",
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
    description: "For teams collaborating on brand graphics and multi-asset systems",
    features: [
      "Everything in Pro",
      "Shared team libraries & brand kits",
      "Real-time multi-cursor collaboration",
      "Role-based access (Owner, Editor, Commenter)",
      "Pooled team AI credit pool (10,000/mo)",
      "Audit log & version restore",
      "Dedicated priority support",
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

export function getPlanById(id: PlanId): Plan {
  return PLANS[id] || PLANS.free;
}
