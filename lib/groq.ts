import { createGroq } from "@ai-sdk/groq";
import { AI_TASK_CONFIG, getConfiguredModel, getModelFallbacks, type AiTask } from "@/lib/ai/config";

/**
 * Default fallback candidate hierarchy for each task type (July 2026 Spec)
 */
export type GroqTaskType = AiTask | "reasoning";

const TASK_ALIASES: Record<string, AiTask> = {
  reasoning: "general",
};

export function normalizeGroqTask(task: string): AiTask {
  return (TASK_ALIASES[task] || task) as AiTask;
}

export const MODEL_FALLBACK_CANDIDATES = Object.fromEntries(
  (Object.keys(AI_TASK_CONFIG) as AiTask[]).map((task) => [
    task,
    getModelFallbacks(task),
  ]),
) as Record<string, string[]>;

// Backward-compatible aliases
MODEL_FALLBACK_CANDIDATES.reasoning = MODEL_FALLBACK_CANDIDATES.general;

export const GROQ_MODELS = {
  get general(): string {
    return getConfiguredModel("general");
  },
  get design(): string {
    return getConfiguredModel("design");
  },
  get code(): string {
    return getConfiguredModel("code");
  },
  get analysis(): string {
    return getConfiguredModel("analysis");
  },
  get edit(): string {
    return getConfiguredModel("edit");
  },
  get json(): string {
    return getConfiguredModel("json");
  },
  get reasoning(): string {
    return getConfiguredModel("general");
  },
  get vision(): string {
    return getConfiguredModel("vision");
  },
  get fast(): string {
    return getConfiguredModel("fast");
  },
};

export function getGroqModel(task: GroqTaskType = "reasoning"): string {
  const normalized = normalizeGroqTask(String(task));
  return GROQ_MODELS[normalized as keyof typeof GROQ_MODELS] || GROQ_MODELS.general;
}

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured");
  }
  return createGroq({ apiKey });
}

/**
 * In-memory model discovery cache with 60-minute TTL
 */
interface ModelCache {
  models: string[];
  expiresAt: number;
}

let modelCache: ModelCache | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Remove sensitive credentials from error messages, and logs
 */
export function sanitizeLogMessage(message: string): string {
  return message
    .replace(/gsk_[a-zA-Z0-9_-]+/g, "gsk_***")
    .replace(/Bearer\s+[a-zA-Z0-9_\-.]+/gi, "Bearer ***")
    .replace(/key=[a-zA-Z0-9_-]+/gi, "key=***");
}

/**
 * Discover active Groq models via official Groq REST API with server-side caching
 */
export async function discoverGroqModels(forceRefresh = false): Promise<string[]> {
  const now = Date.now();
  if (!forceRefresh && modelCache && now < modelCache.expiresAt) {
    return modelCache.models;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return MODEL_FALLBACK_CANDIDATES.reasoning;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = (await response.json()) as {
        data?: Array<{ id: string; active?: boolean }>;
      };
      if (Array.isArray(data?.data) && data.data.length > 0) {
        const activeModels = data.data
          .filter((m) => m.active !== false && typeof m.id === "string")
          .map((m) => m.id);

        if (activeModels.length > 0) {
          modelCache = {
            models: activeModels,
            expiresAt: now + CACHE_TTL_MS,
          };
          return activeModels;
        }
      }
    }
  } catch (error) {
    const safeError = sanitizeLogMessage(
      error instanceof Error ? error.message : "Unknown error",
    );
    console.warn(`[groq-discovery] Model discovery network warning: ${safeError}. Using cached or default models.`);
  }

  // If fetch failed but we have stale cache, continue using it
  if (modelCache?.models && modelCache.models.length > 0) {
    return modelCache.models;
  }

  // Safe fallback to built-in candidates
  return Array.from(
    new Set([
      ...MODEL_FALLBACK_CANDIDATES.reasoning,
      ...MODEL_FALLBACK_CANDIDATES.vision,
      ...MODEL_FALLBACK_CANDIDATES.fast,
    ]),
  );
}

/**
 * Select the best available compatible model for a task
 */
export async function resolveGroqModel(
  task: GroqTaskType = "reasoning",
  forceRefresh = false,
  excludedModels: Set<string> = new Set(),
): Promise<string> {
  const normalized = normalizeGroqTask(String(task));
  const availableModels = await discoverGroqModels(forceRefresh);
  const candidates = MODEL_FALLBACK_CANDIDATES[normalized] || MODEL_FALLBACK_CANDIDATES.general;

  // 1. Quality ranked priority candidates that are active right now
  const activeCandidates = candidates
    .filter((candidate) => !excludedModels.has(candidate))
    .filter((candidate) => availableModels.includes(candidate))
    .sort((a, b) => scoreModel(b) - scoreModel(a));
  if (activeCandidates.length > 0) {
    return activeCandidates[0];
  }

  // 2. If no exact candidate is active, use any non excluded candidate from task defaults
  for (const candidate of candidates) {
    if (!excludedModels.has(candidate)) {
      return candidate;
    }
  }

  // 3. Quality ranked available non excluded model from the live catalog
  const rankedCatalog = [...availableModels]
    .filter((model) => !excludedModels.has(model))
    .sort((a, b) => scoreModel(b) - scoreModel(a));
  if (rankedCatalog.length > 0) {
    return rankedCatalog[0];
  }

  return candidates[0] || "openai/gpt-oss-120b";
}

/** Quality tiers used to rank discovered models, higher is better. */
const MODEL_QUALITY_TIERS: Array<{ pattern: RegExp, score: number }> = [
  { pattern: /gpt-oss-120b/i, score: 100 },
  { pattern: /gpt-oss-20b/i, score: 95 },
  { pattern: /qwen3\.8-27b/i, score: 85 },
  { pattern: /llama-3\.3-70b/i, score: 80 },
  { pattern: /llama-3\.1-8b/i, score: 50 },
];

function scoreModel(modelId: string): number {
  const hit = MODEL_QUALITY_TIERS.find((tier) => tier.pattern.test(modelId));
  return hit ? hit.score : 10;
}

/**
 * Pick the single best model from the live active catalog.
 * Preference order: env override, quality ranked candidates, quality ranked catalog.
 * When Groq retires a model it disappears from the catalog, so the next best wins.
 */
export async function getBestGroqModel(
  task: GroqTaskType = "reasoning",
): Promise<string> {
  const normalized = normalizeGroqTask(String(task));
  const availableModels = await discoverGroqModels(false);
  const envOverride = process.env.GROQ_MODEL;
  if (envOverride && availableModels.includes(envOverride)) {
    return envOverride;
  }

  const candidates = MODEL_FALLBACK_CANDIDATES[normalized] || MODEL_FALLBACK_CANDIDATES.general;
  const activeCandidates = candidates.filter((candidate) =>
    availableModels.includes(candidate),
  );
  if (activeCandidates.length > 0) {
    return [...activeCandidates].sort(
      (a, b) => scoreModel(b) - scoreModel(a),
    )[0];
  }

  return [...availableModels].sort((a, b) => scoreModel(b) - scoreModel(a))[0] ||
    candidates[0] ||
    "openai/gpt-oss-120b";
}

/**
 * Determine if an error indicates that the requested model is invalid or unavailable
 */
export function isModelUnavailableError(err: unknown): boolean {
  if (!err) return false;
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("model_not_found") ||
    msg.includes("model not found") ||
    msg.includes("does not exist") ||
    msg.includes("decommissioned") ||
    msg.includes("deprecated") ||
    msg.includes("unsupported_model") ||
    msg.includes("invalid model") ||
    msg.includes("model is not available") ||
    msg.includes("unknown model")
  );
}

/**
 * Determine if an error is a 429 rate limit
 */
export function isRateLimitError(err: unknown): boolean {
  if (!err) return false;
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return msg.includes("429") || msg.includes("rate limit") || msg.includes("quota exceeded");
}

/**
 * Determine if an error is transient (network drop, timeout, 5xx server error)
 */
export function isTransientError(err: unknown): boolean {
  if (!err) return false;
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("500") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("504") ||
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("fetch failed") ||
    msg.includes("timeout") ||
    msg.includes("aborted") ||
    msg.includes("network error")
  );
}

/**
 * Parse retry delay from error or headers with safety bounds (max 10 seconds)
 */
export function calculateRetryDelay(
  err: unknown,
  attempt: number,
  initialDelayMs = 1000,
  maxDelayMs = 10000,
): number {
  // Check for Retry-After hints in error message (e.g. "try again in 2.5s" or "retry after 3")
  if (err instanceof Error) {
    const match = err.message.match(/try again in ([\d.]+)\s*s/i) ||
                  err.message.match(/retry-after:\s*([\d.]+)/i);
    if (match?.[1]) {
      const parsedSec = parseFloat(match[1]);
      if (!isNaN(parsedSec) && parsedSec > 0) {
        return Math.min(Math.ceil(parsedSec * 1000) + Math.floor(Math.random() * 200), maxDelayMs);
      }
    }
  }

  // Bounded exponential backoff + jitter
  const backoff = initialDelayMs * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 250);
  return Math.min(backoff + jitter, maxDelayMs);
}

export interface SelfHealingOptions {
  task?: GroqTaskType;
  preferredModel?: string;
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
}

/**
 * Execute Groq operation with automatic model discovery, fallback, rate limit backoff, and transient failure recovery
 */
export async function executeGroqWithSelfHealing<T>(
  fn: (modelName: string) => Promise<T>,
  options: SelfHealingOptions = {},
): Promise<T> {
  const {
    task = "reasoning",
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
  } = options;

  const excludedModels = new Set<string>();
  let currentModel = options.preferredModel || (await resolveGroqModel(task, false, excludedModels));
  let lastError: unknown = null;
  let modelFallbackCount = 0;
  const maxModelFallbacks = 8;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn(currentModel);
    } catch (err: unknown) {
      lastError = err;
      const safeErrorMsg = sanitizeLogMessage(
        err instanceof Error ? err.message : String(err),
      );

      // 1. Model unavailable / deprecated -> fallback to next best catalog model
      if (isModelUnavailableError(err) && modelFallbackCount < maxModelFallbacks) {
        modelFallbackCount++;
        excludedModels.add(currentModel);
        console.warn(
          `[groq-self-heal] Model "${currentModel}" unavailable (${safeErrorMsg}). Refreshing catalog and falling back...`,
        );
        currentModel = await resolveGroqModel(task, true, excludedModels);
        continue;
      }

      // 2. Rate limit (429) -> exponential backoff + jitter
      if (isRateLimitError(err) && attempt < maxRetries - 1) {
        const delay = calculateRetryDelay(err, attempt, initialDelayMs, maxDelayMs);
        console.warn(
          `[groq-self-heal] Rate limit encountered. Backing off for ${delay}ms (attempt ${attempt + 1}/${maxRetries}).`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // 3. Transient network / 5xx error -> retry with backoff
      if (isTransientError(err) && attempt < maxRetries - 1) {
        const delay = calculateRetryDelay(err, attempt, initialDelayMs, maxDelayMs);
        console.warn(
          `[groq-self-heal] Transient provider error (${safeErrorMsg}). Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries}).`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Non-retryable error
      throw new Error(safeErrorMsg);
    }
  }

  const finalMsg = sanitizeLogMessage(
    lastError instanceof Error ? lastError.message : "Max retries exceeded",
  );
  throw new Error(`[groq-self-heal] AI operation failed after retries: ${finalMsg}`);
}

/**
 * Backward-compatible executeWithRetry wrapper
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 1000,
): Promise<T> {
  return executeGroqWithSelfHealing(() => fn(), {
    maxRetries,
    initialDelayMs,
  });
}

/**
 * Helper to reset in-memory cache (useful for testing)
 */
export function _resetModelCacheForTesting(): void {
  modelCache = null;
}
