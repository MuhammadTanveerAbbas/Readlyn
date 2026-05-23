import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    const { error: deleteError } = await admin.auth.admin.deleteUser(
      user.id,
    );

    if (deleteError) {
      console.error("[delete-account] admin.deleteUser error:", deleteError.message);
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 },
      );
    }

    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[delete-account] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
