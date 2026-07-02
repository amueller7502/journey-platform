import { NextResponse } from "next/server";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

const STATE_ID = "default";

export async function GET() {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ state: null, mode: "local" });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("journey_operating_state")
    .select("state")
    .eq("id", STATE_ID)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ state: data?.state ?? null, mode: "supabase" });
}

export async function PUT(request: Request) {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ ok: true, mode: "local" });
  }

  const body = (await request.json()) as { state?: unknown };
  if (!body.state || typeof body.state !== "object") {
    return NextResponse.json({ error: "Missing state payload" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("journey_operating_state").upsert({
    id: STATE_ID,
    state: body.state,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mode: "supabase" });
}
