export type PlanId = "free" | "pro" | "team";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  stripePriceId: string;
  features: string[];
  limits: {
    projects: number;
    generations: number;
    exports: number;
  };
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "Get started with basic infographic creation",
    price: 0,
    currency: "usd",
    interval: "month",
    stripePriceId: "",
    features: [
      "3 projects",
      "5 AI generations/month",
      "Basic templates",
      "PNG export",
    ],
    limits: {
      projects: 3,
      generations: 5,
      exports: 10,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For professionals who need unlimited creation",
    price: 19,
    currency: "usd",
    interval: "month",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    features: [
      "Unlimited projects",
      "Unlimited AI generations",
      "All templates",
      "Multi-format export (PNG, SVG, PDF)",
      "Custom themes",
      "Priority support",
    ],
    limits: {
      projects: 999,
      generations: 999,
      exports: 999,
    },
  },
  team: {
    id: "team",
    name: "Team",
    description: "For teams collaborating on visual content",
    price: 49,
    currency: "usd",
    interval: "month",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID || "",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared templates",
      "Analytics dashboard",
      "Dedicated support",
    ],
    limits: {
      projects: 9999,
      generations: 9999,
      exports: 9999,
    },
  },
};

export const FREE_PLAN: Plan = PLANS.free;
export const PRO_PLAN: Plan = PLANS.pro;
export const TEAM_PLAN: Plan = PLANS.team;

export function getPlanById(id: PlanId): Plan {
  return PLANS[id];
}

export function getPlanByStripePriceId(priceId: string): Plan | null {
  for (const plan of Object.values(PLANS)) {
    if (plan.stripePriceId === priceId) return plan;
  }
  return null;
}
