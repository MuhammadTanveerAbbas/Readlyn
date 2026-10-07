import { describe, it, expect } from "vitest";
import { computeLayout } from "@/lib/archetypeLayouts";
import { buildColorMap, remapColor } from "@/lib/themeColors";
import { THEME_COLORS } from "@/types/infographic";

const STYLES = [
  "steps",
  "stats",
  "timeline",
  "compare",
  "list",
  "pyramid",
  "funnel",
  "cycle",
] as const;

describe("Archetype layouts", () => {
  it.each(STYLES)("returns slots for %s", (style) => {
    const slots = computeLayout(style, 800, 1100);
    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((slot) => slot.id.length > 0)).toBe(true);
    expect(slots.every((slot) => slot.role.length > 0)).toBe(true);
  });

  it("keeps slot ids unique inside one style", () => {
    for (const style of STYLES) {
      const slots = computeLayout(style, 800, 1100);
      const ids = slots.map((slot) => slot.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("returns no slots for auto so the model decides", () => {
    expect(computeLayout("auto", 800, 1100)).toEqual([]);
  });

  it("adapts slot sizes to the canvas size", () => {
    const small = computeLayout("steps", 800, 1100);
    const wide = computeLayout("steps", 1920, 600);
    const smallBg = small.find((slot) => slot.id === "bg");
    const wideBg = wide.find((slot) => slot.id === "bg");
    expect(smallBg?.width).toBe(800);
    expect(smallBg?.height).toBe(1100);
    expect(wideBg?.width).toBe(1920);
    expect(wideBg?.height).toBe(600);
  });
});

describe("Auto theme color mapping", () => {
  it("maps every palette color onto the target palette", () => {
    const map = buildColorMap("ember");
    const target = new Set(Object.values(THEME_COLORS.ember));
    for (const value of map.values()) {
      expect(target.has(value)).toBe(true);
    }
  });

  it("maps ocean primary to ember primary", () => {
    expect(buildColorMap("ember").get("#0284c7")).toBe("#ea580c");
  });

  it("matches colors case insensitively", () => {
    const map = buildColorMap("slate");
    expect(remapColor("#0284c7", map)).toBe("#475569");
    expect(remapColor("#0EA5E9", map)).toBe("#64748b");
  });

  it("leaves custom colors untouched", () => {
    const map = buildColorMap("ocean");
    expect(remapColor("#123456", map)).toBeNull();
    expect(remapColor(42, map)).toBeNull();
  });
});
