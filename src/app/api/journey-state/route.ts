import { NextResponse } from "next/server";
import {
  normalizeExperienceState,
  readExperienceState,
  writeExperienceState,
  type ExperienceOperatingState,
} from "@/lib/server/experience-state";
import { hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import { getRequestAuthContext, requestUserCanAccess } from "@/lib/server/request-auth";

export async function GET(request: Request) {
  const context = await getRequestAuthContext(request);
  if (!requestUserCanAccess(context, "manager")) {
    return NextResponse.json({ error: "Manager access is required." }, { status: 401 });
  }

  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ state: null, mode: "local" });
  }

  try {
    const { state, mode } = await readExperienceState();
    return NextResponse.json({ state, mode });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load Experience state" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const context = await getRequestAuthContext(request);
  if (!requestUserCanAccess(context, "admin")) {
    return NextResponse.json({ error: "Experience Designer access is required." }, { status: 401 });
  }

  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ ok: true, mode: "local" });
  }

  const body = (await request.json()) as {
    state?: Partial<ExperienceOperatingState>;
    syncConfig?: boolean;
  };
  if (!body.state || typeof body.state !== "object") {
    return NextResponse.json({ error: "Missing state payload" }, { status: 400 });
  }

  const result = await writeExperienceState(normalizeExperienceState(body.state), {
    syncConfig: body.syncConfig ?? true,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
