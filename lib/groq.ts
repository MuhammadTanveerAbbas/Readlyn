import { createGroq } from "@ai-sdk/groq";

/**
 * Groq Model Configuration Routing (July 2026 Spec)
 */
export const GROQ_MODELS = {
  // Default reasoning, copy generation, layout suggestions, design chat
  reasoning: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  // Vision tasks (mockup understanding, style matching)
  vision: process.env.GROQ_VISION_MODEL || "qwen/qwen3.6-27b",
  // High-volume, low-latency micro-interactions
  fast: process.env.GROQ_FAST_MODEL || "llama-3.1-8b-instant",
} as const;

export type GroqTaskType = keyof typeof GROQ_MODELS;

export function getGroqModel(task: GroqTaskType = "reasoning"): string {
  return GROQ_MODELS[task] || GROQ_MODELS.reasoning;
}

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured");
  }
  return createGroq({ apiKey });
}

/**
 * Execute AI generation with exponential backoff on 429 rate limits
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 1000
): Promise<T> {
  let delay = initialDelayMs;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isRateLimit =
        err instanceof Error &&
        (err.message.includes("429") || err.message.toLowerCase().includes("rate limit"));

      if (isRateLimit && attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}
