import { NextResponse } from "next/server";
import { routeForRole } from "@/lib/access-control";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

type BootstrapBuilderBody = {
  fullName?: string;
  email?: string;
  password?: string;
  setupKey?: string;
};

const locationName = "Celebration Cinema North";

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .padEnd(2, "X")
    .slice(0, 3);
}

function safeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);
}

async function findAuthUserByEmail(email: string) {
  const supabase = createAdminClient();
  let page = 1;

  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      throw new Error(error.message);
    }

    const match = data.users.find((user) => user.email?.toLowerCase() === email);
    if (match) {
      return match;
    }

    if (data.users.length < 1000) {
      break;
    }
    page += 1;
  }

  return null;
}

async function hasConnectedBuilderLogin() {
  const supabase = createAdminClient();
  const { data: roles, error: roleError } = await supabase
    .from("user_roles")
    .select("profile_id")
    .eq("role", "experience_designer")
    .eq("enabled", true);

  if (roleError) {
    throw new Error(roleError.message);
  }

  const profileIds = roles?.map((role) => role.profile_id as string) ?? [];
  if (!profileIds.length) {
    return false;
  }

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("auth_user_id")
    .in("id", profileIds)
    .not("auth_user_id", "is", null)
    .limit(1);

  if (profileError) {
    throw new Error(profileError.message);
  }

  return Boolean(profiles?.length);
}

async function findOrCreateAuthUser({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}) {
  const supabase = createAdminClient();
  const existingUser = await findAuthUserByEmail(email);

  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password,
        email_confirm: true,
        user_metadata: {
          ...existingUser.user_metadata,
          full_name: fullName,
          experience_role: "admin",
        },
      },
    );

    if (error || !data.user) {
      throw new Error(error?.message ?? "Unable to repair that login.");
    }

    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      experience_role: "admin",
    },
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Unable to create the builder login.");
  }

  return data.user;
}

async function findOrCreateProfile({
  authUserId,
  email,
  fullName,
}: {
  authUserId: string;
  email: string;
  fullName: string;
}) {
  const supabase = createAdminClient();
  const { data: byAuth } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (byAuth?.id) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        email,
        status: "active",
      })
      .eq("id", byAuth.id)
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Unable to repair profile.");
    }

    return data.id as string;
  }

  const { data: byEmail } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (byEmail?.id) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        auth_user_id: authUserId,
        full_name: fullName,
        email,
        status: "active",
      })
      .eq("id", byEmail.id)
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Unable to connect profile to login.");
    }

    return data.id as string;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      auth_user_id: authUserId,
      full_name: fullName,
      email,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create profile.");
  }

  return data.id as string;
}

async function ensureBuilderRole(profileId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("user_roles").upsert(
    {
      profile_id: profileId,
      role: "experience_designer",
      location: locationName,
      enabled: true,
    },
    { onConflict: "profile_id,role,location" },
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function ensureBuilderEmployee({
  authUserId,
  email,
  fullName,
}: {
  authUserId: string;
  email: string;
  fullName: string;
}) {
  const supabase = createAdminClient();
  const { data: department } = await supabase
    .from("departments")
    .select("id")
    .eq("slug", "leadership")
    .maybeSingle();

  const employeePayload = {
    auth_user_id: authUserId,
    department_id: department?.id ?? null,
    department_slug: "leadership",
    full_name: fullName,
    initials: initialsFor(fullName),
    title: "Experience Builder",
    role: "admin",
    journey_card_area_id: "floor_lobby",
    email,
    access_code: null,
    account_status: "active",
    current_xp: 0,
    weekly_xp: 0,
    active: true,
  };

  const { data: byAuth } = await supabase
    .from("employees")
    .select("id, app_id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (byAuth?.id) {
    const { data, error } = await supabase
      .from("employees")
      .update(employeePayload)
      .eq("id", byAuth.id)
      .select("id, app_id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Unable to repair employee account.");
    }

    return (data.app_id as string | null) ?? (data.id as string);
  }

  const { data: byEmail } = await supabase
    .from("employees")
    .select("id, app_id")
    .eq("email", email)
    .maybeSingle();

  if (byEmail?.id) {
    const { data, error } = await supabase
      .from("employees")
      .update(employeePayload)
      .eq("id", byEmail.id)
      .select("id, app_id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Unable to connect employee account.");
    }

    return (data.app_id as string | null) ?? (data.id as string);
  }

  const uniqueSuffix = crypto.randomUUID().slice(0, 8).toUpperCase();
  const appId = `admin-${safeSlug(fullName) || "builder"}-${uniqueSuffix.toLowerCase()}`;
  const passportId = `ADM-${uniqueSuffix}`;
  const { data, error } = await supabase
    .from("employees")
    .insert({
      ...employeePayload,
      app_id: appId,
      passport_id: passportId,
      passport_qr_url: `/manager/passport/${passportId}`,
    })
    .select("id, app_id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create employee account.");
  }

  return (data.app_id as string | null) ?? (data.id as string);
}

export async function POST(request: Request) {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      { error: "Supabase service role is not configured." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as BootstrapBuilderBody;
  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const setupKey = process.env.EXPERIENCE_SETUP_KEY?.trim();
  const setupKeyMatches = Boolean(
    setupKey && body.setupKey?.trim() && body.setupKey.trim() === setupKey,
  );

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  try {
    const connectedBuilderExists = await hasConnectedBuilderLogin();
    if (connectedBuilderExists && !setupKeyMatches) {
      return NextResponse.json(
        {
          error:
            "A connected Builder login already exists. Set EXPERIENCE_SETUP_KEY in Vercel and enter it here to repair access.",
        },
        { status: 403 },
      );
    }

    const user = await findOrCreateAuthUser({ email, password, fullName });
    const profileId = await findOrCreateProfile({
      authUserId: user.id,
      email,
      fullName,
    });
    await ensureBuilderRole(profileId);
    const employeeId = await ensureBuilderEmployee({
      authUserId: user.id,
      email,
      fullName,
    });

    return NextResponse.json({
      ok: true,
      role: "admin",
      route: routeForRole("admin"),
      employeeId,
      message: "Builder access is ready. Sign in with this email and password.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to repair Builder access." },
      { status: 500 },
    );
  }
}
