import { describe, it, expect } from "vitest";
import {
  InfographicSchema,
  RectSchema,
  TextSchema,
} from "@/types/infographic";
import { GROQ_MODELS, getGroqModel } from "@/lib/groq";
import { PLANS, getPlanById } from "@/config/plans";
import designTokens from "@/lib/design-tokens.json";

describe("Infographic Schemas", () => {
  describe("RectSchema", () => {
    it("should validate a valid rect", () => {
      const result = RectSchema.safeParse({
        type: "rect",
        id: "bg-1",
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        fill: "#ffffff",
        rx: 0,
        opacity: 1,
        stroke: null,
        strokeWidth: null,
        zIndex: 0,
      });
      expect(result.success).toBe(true);
    });

    it("should reject missing required fields", () => {
      const result = RectSchema.safeParse({ type: "rect" });
      expect(result.success).toBe(false);
    });
  });

  describe("TextSchema", () => {
    it("should validate a valid text element", () => {
      const result = TextSchema.safeParse({
        type: "text",
        id: "title-1",
        x: 48,
        y: 36,
        text: "Hello World",
        fontSize: 44,
        fontWeight: "900",
        fontFamily: "Arial",
        fill: "#000000",
        textAlign: "left",
        width: 700,
        opacity: 1,
        zIndex: 10,
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid fontFamily", () => {
      const result = TextSchema.safeParse({
        type: "text",
        id: "t1",
        x: 0,
        y: 0,
        text: "test",
        fontSize: 16,
        fontWeight: "normal",
        fontFamily: "Comic Sans",
        fill: "#000",
        textAlign: "left",
        width: 100,
        opacity: 1,
        zIndex: 1,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("InfographicSchema", () => {
    it("should validate a complete infographic", () => {
      const result = InfographicSchema.safeParse({
        canvasWidth: 800,
        canvasHeight: 1100,
        background: "#ffffff",
        elements: [
          {
            type: "rect",
            id: "bg",
            x: 0,
            y: 0,
            width: 800,
            height: 1100,
            fill: "#ffffff",
            rx: 0,
            opacity: 1,
            stroke: null,
            strokeWidth: null,
            zIndex: 0,
          },
          {
            type: "text",
            id: "title",
            x: 48,
            y: 36,
            text: "Test Title",
            fontSize: 44,
            fontWeight: "900",
            fontFamily: "Arial",
            fill: "#000000",
            textAlign: "left",
            width: 700,
            opacity: 1,
            zIndex: 10,
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty elements", () => {
      const result = InfographicSchema.safeParse({
        canvasWidth: 800,
        canvasHeight: 1100,
        background: "#ffffff",
        elements: [],
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid element type", () => {
      const result = InfographicSchema.safeParse({
        canvasWidth: 800,
        canvasHeight: 1100,
        background: "#ffffff",
        elements: [{ type: "invalid", id: "x" }],
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("Groq Model Routing", () => {
  it("should return the default reasoning model", () => {
    const model = getGroqModel("reasoning");
    expect(model).toBeDefined();
    expect(typeof model).toBe("string");
    expect(model.length).toBeGreaterThan(0);
  });

  it("should route to vision and fast models properly", () => {
    expect(getGroqModel("vision")).toBe(GROQ_MODELS.vision);
    expect(getGroqModel("fast")).toBe(GROQ_MODELS.fast);
  });
});

describe("Plans and Monetization", () => {
  it("should define Free, Pro, and Team plan tiers", () => {
    expect(PLANS.free).toBeDefined();
    expect(PLANS.pro).toBeDefined();
    expect(PLANS.team).toBeDefined();
  });

  it("should return plan details by id", () => {
    const pro = getPlanById("pro");
    expect(pro.name).toBe("Pro");
    expect(pro.limits.aiCreditsMonthly).toBe(3000);
  });
});

describe("W3C Design Tokens", () => {
  it("should contain standard token categories", () => {
    expect(designTokens.color).toBeDefined();
    expect(designTokens.spacing).toBeDefined();
    expect(designTokens.typography).toBeDefined();
    expect(designTokens.radius).toBeDefined();
    expect(designTokens.elevation).toBeDefined();
    expect(designTokens.motion).toBeDefined();
  });
});
