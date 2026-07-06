export type PlanId = "free";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  features: string[];
  limits: {
    projects: number;
    generationsPerDay: number;
    exports: number;
  };
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "Get started with AI-powered infographic creation",
    features: [
      "Up to 5 projects",
      "10 AI generations per day",
      "All 9 layout archetypes",
      "All 5 color themes",
      "PNG and JSON export",
      "Multi-format ZIP export (PNG sizes)",
      "Generation history",
      "Parallax Studio",
    ],
    limits: {
      projects: 5,
      generationsPerDay: 10,
      exports: 50,
    },
  },
};

export const FREE_PLAN: Plan = PLANS.free;

export function getPlanById(id: PlanId): Plan {
  return PLANS[id];
}
