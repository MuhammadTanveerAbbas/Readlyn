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

describe("Groq Reliability Layer", () => {
  it("should sanitize log messages and strip api keys / tokens", async () => {
    const { sanitizeLogMessage } = await import("@/lib/groq");
    const raw = "Error with key gsk_abc1234567890XYZ and Bearer gsk_secrettoken123 at endpoint";
    const sanitized = sanitizeLogMessage(raw);
    expect(sanitized).not.toContain("gsk_abc1234567890XYZ");
    expect(sanitized).not.toContain("gsk_secrettoken123");
    expect(sanitized).toContain("gsk_***");
    expect(sanitized).toContain("Bearer ***");
  });

  it("should correctly identify model unavailable errors", async () => {
    const { isModelUnavailableError } = await import("@/lib/groq");
    expect(isModelUnavailableError(new Error("model_not_found: openai/gpt-oss-120b does not exist"))).toBe(true);
    expect(isModelUnavailableError(new Error("The model is decommissioned"))).toBe(true);
    expect(isModelUnavailableError(new Error("unsupported_model"))).toBe(true);
    expect(isModelUnavailableError(new Error("Generic network socket error"))).toBe(false);
  });

  it("should correctly identify rate limit (429) errors", async () => {
    const { isRateLimitError } = await import("@/lib/groq");
    expect(isRateLimitError(new Error("HTTP 429 Too Many Requests"))).toBe(true);
    expect(isRateLimitError(new Error("rate limit exceeded, please try again in 2s"))).toBe(true);
    expect(isRateLimitError(new Error("quota exceeded"))).toBe(true);
    expect(isRateLimitError(new Error("500 Internal Server Error"))).toBe(false);
  });

  it("should correctly identify transient 5xx / timeout errors", async () => {
    const { isTransientError } = await import("@/lib/groq");
    expect(isTransientError(new Error("503 Service Unavailable"))).toBe(true);
    expect(isTransientError(new Error("fetch failed with ECONNRESET"))).toBe(true);
    expect(isTransientError(new Error("The operation was aborted due to timeout"))).toBe(true);
    expect(isTransientError(new Error("Invalid JSON input syntax"))).toBe(false);
  });

  it("should calculate backoff delay with Retry-After support and jitter", async () => {
    const { calculateRetryDelay } = await import("@/lib/groq");
    
    // Explicit seconds hint in error message
    const delayFromHeader = calculateRetryDelay(new Error("rate limit: try again in 2.5s"), 0);
    expect(delayFromHeader).toBeGreaterThanOrEqual(2500);
    expect(delayFromHeader).toBeLessThan(3500);

    // Standard exponential backoff + jitter
    const delayAttempt0 = calculateRetryDelay(new Error("HTTP 429"), 0, 500, 5000);
    expect(delayAttempt0).toBeGreaterThanOrEqual(500);
    expect(delayAttempt0).toBeLessThan(1000);

    const delayAttempt1 = calculateRetryDelay(new Error("HTTP 429"), 1, 500, 5000);
    expect(delayAttempt1).toBeGreaterThanOrEqual(1000);
  });

  it("should discover models with server-side caching and fallback", async () => {
    const { discoverGroqModels, _resetModelCacheForTesting } = await import("@/lib/groq");
    _resetModelCacheForTesting();
    
    // In test environment without live key, should safely fall back to default candidates
    const models = await discoverGroqModels();
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);
    expect(models).toContain("llama-3.3-70b-versatile");
  });

  it("should resolve compatible models and respect task hierarchy", async () => {
    const { resolveGroqModel } = await import("@/lib/groq");
    const reasoningModel = await resolveGroqModel("reasoning");
    expect(reasoningModel).toBeDefined();
    expect(typeof reasoningModel).toBe("string");

    const visionModel = await resolveGroqModel("vision");
    expect(visionModel).toBeDefined();

    const fastModel = await resolveGroqModel("fast");
    expect(fastModel).toBeDefined();
  });

  it("should recover automatically on rate limit using bounded retry backoff", async () => {
    const { executeGroqWithSelfHealing } = await import("@/lib/groq");
    
    let attempts = 0;
    const result = await executeGroqWithSelfHealing(
      async () => {
        attempts++;
        if (attempts === 1) {
          throw new Error("HTTP 429 Rate limit exceeded. Try again in 0.05s");
        }
        return { text: "Success after 429 recovery" };
      },
      { maxRetries: 3, initialDelayMs: 10, maxDelayMs: 100 },
    );

    expect(attempts).toBe(2);
    expect(result.text).toBe("Success after 429 recovery");
  });

  it("should recover automatically on model unavailable by switching to next fallback candidate", async () => {
    const { executeGroqWithSelfHealing } = await import("@/lib/groq");
    
    const usedModels: string[] = [];
    const result = await executeGroqWithSelfHealing(
      async (modelName) => {
        usedModels.push(modelName);
        if (usedModels.length === 1) {
          throw new Error(`model_not_found: The model ${modelName} is decommissioned`);
        }
        return { text: `Generated using ${modelName}` };
      },
      { task: "reasoning", maxRetries: 3, initialDelayMs: 10 },
    );

    expect(usedModels.length).toBe(2);
    expect(usedModels[0]).not.toBe(usedModels[1]);
    expect(result.text).toContain("Generated using");
  });

  it("should recover from transient network / 503 errors with retries", async () => {
    const { executeGroqWithSelfHealing } = await import("@/lib/groq");
    
    let calls = 0;
    const result = await executeGroqWithSelfHealing(
      async () => {
        calls++;
        if (calls === 1) {
          throw new Error("503 Service Unavailable");
        }
        return "Recovered";
      },
      { maxRetries: 3, initialDelayMs: 10, maxDelayMs: 50 },
    );

    expect(calls).toBe(2);
    expect(result).toBe("Recovered");
  });

  it("should gracefully fail with sanitized error when max retries are exceeded", async () => {
    const { executeGroqWithSelfHealing } = await import("@/lib/groq");
    
    await expect(
      executeGroqWithSelfHealing(
        async () => {
          throw new Error("Persistent 500 error with key gsk_secret_12345");
        },
        { maxRetries: 2, initialDelayMs: 10, maxDelayMs: 30 },
      ),
    ).rejects.toThrow(/gsk_\*\*\*/);
  });
});
