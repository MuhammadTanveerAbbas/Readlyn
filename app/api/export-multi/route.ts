export async function POST() {
  return Response.json(
    {
      ok: true,
      message:
        "Multi-format export is handled client-side via offscreen Fabric canvas.",
    },
    { status: 200 },
  );
}

