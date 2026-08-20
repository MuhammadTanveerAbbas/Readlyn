import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeLogMessage } from "@/lib/groq";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    
    // Bounded read-only head check (avoids .single() failure on empty tables)
    const checkPromise = supabase
      .from("projects")
      .select("id", { count: "exact", head: true });

    const timeoutPromise = new Promise<{ error: { message: string } }>((_, reject) =>
      setTimeout(() => reject(new Error("Database keep-alive timed out")), 5000),
    );

    const { error } = await Promise.race([checkPromise, timeoutPromise]);

    if (error) {
      console.error("[keep-alive] Supabase error:", sanitizeLogMessage(error.message));
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("[keep-alive] Unexpected error:", sanitizeLogMessage(err instanceof Error ? err.message : "unknown"));
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
