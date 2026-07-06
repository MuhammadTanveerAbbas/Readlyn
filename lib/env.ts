const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "GROQ_API_KEY",
] as const;

export const OPTIONAL_ENV_VARS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "CRON_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
] as const;

export type OptionalEnvVar = (typeof OPTIONAL_ENV_VARS)[number];

function validateEnv() {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[startup] Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join("\n")}\n\nSee .env.example for documentation.`,
    );
  }
}

if (typeof window === "undefined") {
  validateEnv();
}
