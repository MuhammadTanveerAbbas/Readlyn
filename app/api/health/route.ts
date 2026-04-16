export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};

  // Verify required environment variables are present
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

  const status = allEnvPresent ? "ok" : "degraded";
  const httpStatus = allEnvPresent ? 200 : 503;

  return Response.json(
    {
      status,
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: httpStatus },
  );
}
