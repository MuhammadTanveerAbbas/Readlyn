import { createClient } from "@/lib/supabase/server";
import { checkCsrfOrigin } from "@/lib/csrf";

export async function POST(req: Request) {
  try {
    const csrf = checkCsrfOrigin(req);
    if (!csrf.valid) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json(
      {
        ok: true,
        message:
          "Multi-format export is handled client-side via offscreen Fabric canvas.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[export-multi] error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
