import {
  platformRoleRank,
  roleCanAccess,
} from "@/lib/access-control";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import {
  createClient as createServerClient,
  hasSupabaseServerEnv,
} from "@/lib/supabase/server";
import type { PlatformRole, Role } from "@/lib/types";

export type RequestAuthContext = {
  userId: string;
  role: Role | null;
};

function bearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export async function getRequestAuthContext(
  request: Request,
): Promise<RequestAuthContext | null> {
  let userId: string | null = null;
  const token = bearerToken(request);

  if (token && hasSupabaseAdminEnv()) {
    const supabase = createAdminClient();
    const { data } = await supabase.auth.getUser(token);
    userId = data.user?.id ?? null;
  }

  if (!userId && hasSupabaseServerEnv()) {
    const supabase = await createServerClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  }

  if (!userId || !hasSupabaseAdminEnv()) {
    return userId ? { userId, role: null } : null;
  }

  const supabase = createAdminClient();
  let resolvedRole: Role | null = null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", userId)
    .maybeSingle();

  if (profile?.id) {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("profile_id", profile.id)
      .eq("enabled", true);

    const platformRole = roles
      ?.map((row) => row.role as PlatformRole)
      .sort((a, b) => platformRoleRank(b) - platformRoleRank(a))[0];

    if (platformRole) {
      resolvedRole =
        platformRole === "experience_designer"
          ? "admin"
          : platformRole === "leader"
            ? "manager"
            : "employee";
    }
  }

  if (!resolvedRole) {
    const { data: employeeProfile } = await supabase
      .from("employees")
      .select("role")
      .eq("auth_user_id", userId)
      .maybeSingle();

    resolvedRole = (employeeProfile?.role as Role | undefined) ?? null;
  }

  return { userId, role: resolvedRole };
}

export function requestUserCanAccess(
  context: RequestAuthContext | null,
  requiredRole: Role,
) {
  return Boolean(context?.role && roleCanAccess(context.role, requiredRole));
}
