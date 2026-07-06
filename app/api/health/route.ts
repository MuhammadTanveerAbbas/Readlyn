import { createClient } from "@/lib/supabase/server";

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
    const { error } = await supabase
      .from("projects")
      .select("id", { count: "exact", head: true });

    if (!error) {
      dbConnected = true;
      checks.database = "ok";
    } else {
      checks.database = `error: ${error.message}`;
    }
  } catch {
    checks.database = "unreachable";
  }

  const productionReady =
    requiredOk &&
    dbConnected &&
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
