/**
 * Environment variable validation.
 * Called at module load time — the app will throw a clear error at startup
 * rather than failing silently at runtime when a required variable is missing.
 */

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "GROQ_API_KEY",
] as const;

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

// Only validate on the server side (not in browser bundles)
if (typeof window === "undefined") {
  validateEnv();
}
