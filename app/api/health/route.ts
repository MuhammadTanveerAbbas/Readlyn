import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "GROQ_API_KEY",
  ];

  let allEnvPresent = true;
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      checks[key] = "missing";
      allEnvPresent = false;
    } else {
      checks[key] = "ok";
    }
  }

  let dbConnected = false;
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("projects")
      .select("id")
      .limit(1)
      .single();

    if (!error) {
      dbConnected = true;
      checks["database"] = "ok";
    } else {
      checks["database"] = `error: ${error.message}`;
    }
  } catch {
    checks["database"] = "unreachable";
  }

  const status = allEnvPresent && dbConnected ? "ok" : "degraded";
  const httpStatus = status === "ok" ? 200 : 503;

  return Response.json(
    {
      status,
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: httpStatus },
  );
}
