import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  appRoleForPlatformRole,
  platformRoleRank,
  requiredRoleForPath,
  roleCanAccess,
  routeForRole,
} from "@/lib/access-control";
import type { PlatformRole, Role } from "@/lib/types";

const publicPathPrefixes = [
  "/",
  "/tv",
  "/manage",
  "/points",
  "/_next",
  "/favicon.ico",
  "/brand",
  "/screenshots",
];

function isPublicPath(pathname: string) {
  if (pathname === "/") {
    return true;
  }

  return publicPathPrefixes.some((prefix) => prefix !== "/" && pathname.startsWith(prefix));
}

function shouldEnforceAuth() {
  return (
    process.env.NEXT_PUBLIC_EXPERIENCE_AUTH_REQUIRED === "true" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export async function proxy(request: NextRequest) {
  if (!shouldEnforceAuth()) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const requiredRole = requiredRoleForPath(pathname);

  if (!requiredRole || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  let actualRole: Role | undefined;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
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
      actualRole = appRoleForPlatformRole(platformRole);
    }
  }

  const { data: employeeProfile } = await supabase
    .from("employees")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  actualRole = actualRole ?? (employeeProfile?.role as Role | undefined);
  if (!actualRole || !roleCanAccess(actualRole, requiredRole)) {
    const url = request.nextUrl.clone();
    url.pathname = actualRole ? routeForRole(actualRole) : "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
