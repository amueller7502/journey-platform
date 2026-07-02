import { NextResponse } from "next/server";
import { routeForRole } from "@/lib/access-control";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import type { PlatformRole, Role } from "@/lib/types";

type CreateAccountBody = {
  fullName?: string;
  email?: string;
  password?: string;
  role?: Role;
};

const roleConfig: Record<
  Role,
  {
    platformRole: PlatformRole;
    departmentSlug: string;
    title: string;
    passportPrefix: string;
    journeyCardAreaId: string;
  }
> = {
  employee: {
    platformRole: "employee",
    departmentSlug: "floor",
    title: "Crew Member",
    passportPrefix: "EMP",
    journeyCardAreaId: "floor_lobby",
  },
  manager: {
    platformRole: "leader",
    departmentSlug: "leadership",
    title: "Leader",
    passportPrefix: "MGR",
    journeyCardAreaId: "floor_lobby",
  },
  admin: {
    platformRole: "experience_designer",
    departmentSlug: "leadership",
    title: "Experience Builder",
    passportPrefix: "ADM",
    journeyCardAreaId: "floor_lobby",
  },
};

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

export async function POST(request: Request) {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      { error: "Supabase service role is not configured for account creation." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as CreateAccountBody;
  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const role = body.role && roleConfig[body.role] ? body.role : "employee";
  const config = roleConfig[role];

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

  const supabase = createAdminClient();
  const { data: existingEmployee } = await supabase
    .from("employees")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingEmployee) {
    return NextResponse.json(
      { error: "An Experience account already exists for this email. Sign in instead." },
      { status: 409 },
    );
  }

  const { data: createdUser, error: createUserError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        experience_role: role,
      },
    });

  if (createUserError || !createdUser.user) {
    return NextResponse.json(
      { error: createUserError?.message ?? "Unable to create auth user." },
      { status: 400 },
    );
  }

  const authUserId = createdUser.user.id;
  const rollbackAuthUser = async () => {
    await supabase.auth.admin.deleteUser(authUserId);
  };

  const { data: department, error: departmentError } = await supabase
    .from("departments")
    .select("id")
    .eq("slug", config.departmentSlug)
    .maybeSingle();

  if (departmentError || !department) {
    await rollbackAuthUser();
    return NextResponse.json(
      { error: "Unable to find the default department for this account." },
      { status: 500 },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      auth_user_id: authUserId,
      full_name: fullName,
      email,
      status: "active",
    })
    .select("id")
    .single();

  if (profileError || !profile) {
    await rollbackAuthUser();
    return NextResponse.json(
      { error: profileError?.message ?? "Unable to create profile." },
      { status: 500 },
    );
  }

  const { error: roleError } = await supabase.from("user_roles").insert({
    profile_id: profile.id,
    role: config.platformRole,
    location: "Celebration Cinema North",
    enabled: true,
  });

  if (roleError) {
    await rollbackAuthUser();
    return NextResponse.json({ error: roleError.message }, { status: 500 });
  }

  const uniqueSuffix = crypto.randomUUID().slice(0, 8).toUpperCase();
  const appId = `${role}-${safeSlug(fullName) || "account"}-${uniqueSuffix.toLowerCase()}`;
  const passportId = `${config.passportPrefix}-${uniqueSuffix}`;

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .insert({
      auth_user_id: authUserId,
      app_id: appId,
      department_id: department.id,
      department_slug: config.departmentSlug,
      full_name: fullName,
      initials: initialsFor(fullName),
      title: config.title,
      role,
      passport_id: passportId,
      passport_qr_url: `/manager/passport/${passportId}`,
      journey_card_area_id: config.journeyCardAreaId,
      email,
      access_code: null,
      account_status: "active",
      current_xp: 0,
      weekly_xp: 0,
      active: true,
    })
    .select("id, app_id, role")
    .single();

  if (employeeError || !employee) {
    await rollbackAuthUser();
    return NextResponse.json(
      { error: employeeError?.message ?? "Unable to create Experience account." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    role,
    route: routeForRole(role),
    employeeId: employee.app_id ?? employee.id,
  });
}
