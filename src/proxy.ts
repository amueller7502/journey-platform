import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { requiredRoleForPath, roleCanAccess, routeForRole } from "@/lib/access-control";
import type { Role } from "@/lib/types";

const publicPathPrefixes = [
  "/",
  "/tv",
  "/api/journey-state",
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

  const { data: profile } = await supabase
    .from("employees")
    .select("role")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const actualRole = profile?.role as Role | undefined;
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
