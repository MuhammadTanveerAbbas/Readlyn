import { createClient } from "@/lib/supabase/server";
import { discoverGroqModels, sanitizeLogMessage } from "@/lib/groq";

export const dynamic = "force-dynamic";

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "GROQ_API_KEY",
] as const;

const PRODUCTION_ENV_VARS = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "NEXT_PUBLIC_APP_URL",
] as const;

export async function GET() {
  const checks: Record<string, string> = {};

  let requiredOk = true;
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      checks[key] = "missing";
      requiredOk = false;
    } else {
      checks[key] = "ok";
    }
  }

  for (const key of PRODUCTION_ENV_VARS) {
    checks[key] = process.env[key] ? "ok" : "missing";
  }

  let dbConnected = false;
  try {
    const supabase = await createClient();
    
    // Bounded 4-second timeout for database health check
    const dbPromise = supabase
      .from("projects")
      .select("id", { count: "exact", head: true });

    const timeoutPromise = new Promise<{ error: { message: string } }>((_, reject) =>
      setTimeout(() => reject(new Error("Database health check timed out")), 4000),
    );

    const { error } = await Promise.race([dbPromise, timeoutPromise]);

    if (!error) {
      dbConnected = true;
      checks.database = "ok";
    } else {
      checks.database = `error: ${sanitizeLogMessage(error.message)}`;
    }
  } catch (err) {
    checks.database = `unreachable: ${sanitizeLogMessage(err instanceof Error ? err.message : "timed out")}`;
  }

  // Check Groq models availability without consuming token generation quota
  let aiConnected = false;
  if (process.env.GROQ_API_KEY) {
    try {
      const models = await discoverGroqModels(false);
      if (models.length > 0) {
        aiConnected = true;
        checks.ai = `ok (${models.length} models)`;
      } else {
        checks.ai = "no models discovered";
      }
    } catch (err) {
      checks.ai = `degraded: ${sanitizeLogMessage(err instanceof Error ? err.message : "unavailable")}`;
    }
  } else {
    checks.ai = "missing api key";
  }

  const productionReady =
    requiredOk &&
    dbConnected &&
    aiConnected &&
    PRODUCTION_ENV_VARS.every((key) => process.env[key]);

  const status = requiredOk && dbConnected ? "ok" : "degraded";
  const httpStatus = requiredOk && dbConnected ? 200 : 503;

  return Response.json(
    {
      status,
      productionReady,
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: httpStatus },
  );
}
