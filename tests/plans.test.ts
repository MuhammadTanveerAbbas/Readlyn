import { describe, it, expect } from "vitest";
import {
  PLANS,
  FAIR_USE_DAILY_GENERATIONS,
  getPlanById,
} from "@/config/plans";

describe("Plan Configuration", () => {
  it("shares one fair use cap across every plan", () => {
    expect(PLANS.free.limits.generationsPerDay).toBe(
      FAIR_USE_DAILY_GENERATIONS,
    );
    expect(PLANS.pro.limits.generationsPerDay).toBe(
      FAIR_USE_DAILY_GENERATIONS,
    );
  });

  it("does not gate the project count for anyone", () => {
    expect(PLANS.free.limits.projects).toBeGreaterThanOrEqual(9999);
    expect(PLANS.free.limits.exports).toBeGreaterThanOrEqual(9999);
  });

  it("falls back to the free plan for unknown ids", () => {
    expect(getPlanById("nope" as never).id).toBe("free");
  });

  it("labels unreleased paid features as coming soon", () => {
    const unreleased = [...PLANS.pro.features, ...PLANS.team.features].filter(
      (feature) => !feature.startsWith("Everything in"),
    );
    expect(unreleased.length).toBeGreaterThan(0);
    expect(unreleased.every((feature) => feature.includes("(coming soon)"))).toBe(
      true,
    );
  });

  it("keeps plan copy free of banned characters", () => {
    const copy = Object.values(PLANS).flatMap((plan) => [
      plan.name,
      plan.description,
      ...plan.features,
    ]);
    for (const text of copy) {
      expect(text).not.toMatch(/[—–;]/);
      expect(text).not.toMatch(/\band\b/);
    }
  });
});
