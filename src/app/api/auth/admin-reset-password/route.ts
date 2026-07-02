import { NextResponse } from "next/server";
import { getRequestAuthContext, requestUserCanAccess } from "@/lib/server/request-auth";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

type AdminResetPasswordBody = {
  employeeId?: string;
  email?: string;
  password?: string;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cleanEmail(value?: string) {
  return value?.trim().toLowerCase() || null;
}

async function findAuthUserId({
  employeeId,
  email,
}: {
  employeeId: string | null;
  email: string | null;
}) {
  const supabase = createAdminClient();
  const employeeColumns = "id, app_id, auth_user_id, email, full_name";
  let employee:
    | {
        id: string;
        app_id: string | null;
        auth_user_id: string | null;
        email: string | null;
        full_name: string;
      }
    | null = null;

  if (employeeId) {
    const { data: byAppId } = await supabase
      .from("employees")
      .select(employeeColumns)
      .eq("app_id", employeeId)
      .maybeSingle();
    employee = byAppId;

    if (!employee && uuidPattern.test(employeeId)) {
      const { data: byId } = await supabase
        .from("employees")
        .select(employeeColumns)
        .eq("id", employeeId)
        .maybeSingle();
      employee = byId;
    }
  }

  if (!employee && email) {
    const { data: byEmail } = await supabase
      .from("employees")
      .select(employeeColumns)
      .eq("email", email)
      .maybeSingle();
    employee = byEmail;
  }

  const employeeEmail = cleanEmail(employee?.email ?? email ?? undefined);
  if (employee?.auth_user_id) {
    return {
      authUserId: employee.auth_user_id,
      employeeId: employee.id,
      email: employeeEmail,
      name: employee.full_name,
    };
  }

  if (!employeeEmail) {
    return {
      authUserId: null,
      employeeId: employee?.id ?? null,
      email: null,
      name: employee?.full_name ?? null,
    };
  }

  let page = 1;
  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      throw new Error(error.message);
    }

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === employeeEmail,
    );

    if (match) {
      return {
        authUserId: match.id,
        employeeId: employee?.id ?? null,
        email: employeeEmail,
        name:
          employee?.full_name ??
          (match.user_metadata.full_name as string | undefined) ??
          employeeEmail,
      };
    }

    if (data.users.length < 1000) {
      break;
    }
    page += 1;
  }

  return {
    authUserId: null,
    employeeId: employee?.id ?? null,
    email: employeeEmail,
    name: employee?.full_name ?? employeeEmail,
  };
}

export async function POST(request: Request) {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      { error: "Supabase service role is required for password administration." },
      { status: 503 },
    );
  }

  const context = await getRequestAuthContext(request);
  if (!context) {
    return NextResponse.json(
      { error: "Sign in as an Experience Builder before resetting passwords." },
      { status: 401 },
    );
  }

  if (!requestUserCanAccess(context, "admin")) {
    return NextResponse.json(
      { error: "Only Experience Builders can reset account passwords." },
      { status: 403 },
    );
  }

  const body = (await request.json()) as AdminResetPasswordBody;
  const password = body.password ?? "";
  const employeeId = body.employeeId?.trim() || null;
  const email = cleanEmail(body.email);

  if (!employeeId && !email) {
    return NextResponse.json(
      { error: "Choose an employee with an email address first." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Temporary password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const target = await findAuthUserId({ employeeId, email });
  if (!target.authUserId) {
    return NextResponse.json(
      {
        error:
          "No Supabase login exists for that employee yet. Have them create an account first, then reset the password here.",
      },
      { status: 404 },
    );
  }

  const supabase = createAdminClient();
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    target.authUserId,
    {
      password,
    },
  );

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (target.employeeId) {
    await supabase
      .from("employees")
      .update({
        account_status: "active",
        active: true,
      })
      .eq("id", target.employeeId);
  }

  await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("auth_user_id", target.authUserId);

  return NextResponse.json({
    ok: true,
    message: `Password reset for ${target.name ?? target.email ?? "that account"}.`,
  });
}
