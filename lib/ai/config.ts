/**
 * Centralized AI model configuration.
 *
 * Model IDs are validated against Groq's live catalog at runtime by lib/groq.ts.
 * Environment variables override defaults without code changes.
 */
export type AiTask =
  | "general"
  | "design"
  | "code"
  | "analysis"
  | "edit"
  | "json"
  | "fast"
  | "vision";

export interface AiTaskConfig {
  envKey: string;
  defaultModel: string;
  fallbacks: string[];
}

export const AI_TASK_CONFIG: Record<AiTask, AiTaskConfig> = {
  general: {
    envKey: "GROQ_MODEL_GENERAL",
    defaultModel: "openai/gpt-oss-120b",
    fallbacks: ["openai/gpt-oss-20b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
  },
  design: {
    envKey: "GROQ_MODEL_DESIGN",
    defaultModel: "openai/gpt-oss-120b",
    fallbacks: ["openai/gpt-oss-20b", "llama-3.3-70b-versatile"],
  },
  code: {
    envKey: "GROQ_MODEL_CODE",
    defaultModel: "openai/gpt-oss-120b",
    fallbacks: ["openai/gpt-oss-20b", "llama-3.3-70b-versatile"],
  },
  analysis: {
    envKey: "GROQ_MODEL_ANALYSIS",
    defaultModel: "openai/gpt-oss-120b",
    fallbacks: ["openai/gpt-oss-20b", "llama-3.3-70b-versatile"],
  },
  edit: {
    envKey: "GROQ_MODEL_EDIT",
    defaultModel: "openai/gpt-oss-120b",
    fallbacks: ["openai/gpt-oss-20b", "llama-3.3-70b-versatile"],
  },
  json: {
    envKey: "GROQ_MODEL_JSON",
    defaultModel: "openai/gpt-oss-120b",
    fallbacks: ["openai/gpt-oss-20b", "llama-3.3-70b-versatile"],
  },
  fast: {
    envKey: "GROQ_MODEL_FAST",
    defaultModel: "openai/gpt-oss-20b",
    fallbacks: ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
  },
  vision: {
    envKey: "GROQ_MODEL_VISION",
    defaultModel: "qwen/qwen3.8-27b",
    fallbacks: ["openai/gpt-oss-120b"],
  },
};

export function getConfiguredModel(task: AiTask): string {
  const config = AI_TASK_CONFIG[task];
  const envValue = process.env[config.envKey];
  return envValue && envValue.trim().length > 0 ? envValue.trim() : config.defaultModel;
}

export function getModelFallbacks(task: AiTask): string[] {
  const config = AI_TASK_CONFIG[task];
  return [getConfiguredModel(task), ...config.fallbacks].filter(
    (value, index, array) => array.indexOf(value) === index,
  );
}
