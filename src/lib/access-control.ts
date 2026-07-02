import type { PlatformRole, Role } from "@/lib/types";

export const roleRank: Record<Role, number> = {
  employee: 1,
  manager: 2,
  admin: 3,
};

export function roleCanAccess(actualRole: Role, requiredRole: Role) {
  return roleRank[actualRole] >= roleRank[requiredRole];
}

export function requiredRoleForPath(pathname: string): Role | null {
  if (pathname.startsWith("/admin")) {
    return "admin";
  }

  if (pathname.startsWith("/manager") || pathname.startsWith("/leadership")) {
    return "manager";
  }

  if (
    pathname.startsWith("/home") ||
    pathname.startsWith("/my-journey") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/rewards") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/leaderboard")
  ) {
    return "employee";
  }

  return null;
}

export function routeForRole(role: Role) {
  if (role === "admin") {
    return "/admin/dashboard";
  }

  if (role === "manager") {
    return "/manager/recognize";
  }

  return "/home";
}

export function appRoleForPlatformRole(role: PlatformRole): Role {
  if (role === "experience_designer") {
    return "admin";
  }

  if (role === "leader") {
    return "manager";
  }

  return "employee";
}

export function platformRoleRank(role: PlatformRole) {
  if (role === "experience_designer") {
    return 3;
  }

  if (role === "leader") {
    return 2;
  }

  return 1;
}
