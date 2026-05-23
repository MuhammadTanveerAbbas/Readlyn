import { createClient } from "@/lib/supabase/server";

export async function POST(_req: Request) {
  try {
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
