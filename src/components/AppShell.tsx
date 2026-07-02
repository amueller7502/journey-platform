"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { ActiveAccountBadge } from "@/components/ActiveAccountBadge";
import { BrandLockup } from "@/components/BrandLockup";
import { FeatureComingSoon } from "@/components/FeatureComingSoon";
import { PreviewModeBadge } from "@/components/PreviewModeBadge";
import { SkinRuntimeClass } from "@/components/SkinRuntimeClass";
import { adminNav, employeeNav, managerNav, roleLabels, utilityNav } from "@/lib/data";
import { roleCanAccess, routeForRole } from "@/lib/access-control";
import {
  canRoleUseFeature,
  featureForPath,
  getFeature,
  isFeatureEnabled,
} from "@/lib/features";
import { useJourneyState } from "@/lib/journey-state";
import { createClient, hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const navByRole = {
  employee: employeeNav,
  manager: managerNav,
  admin: adminNav,
};

const roleHierarchy: Role[] = ["admin", "manager", "employee"];

function storedRole(value: string | null): Role | null {
  if (value === "admin" || value === "manager" || value === "employee") {
    return value;
  }

  return null;
}

export function AppShell({
  role,
  title,
  eyebrow,
  children,
  actions,
}: {
  role: Role;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useJourneyState();
  const flags = state.featureFlags;
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const effectiveRole =
    activeRole && roleCanAccess(activeRole, role) ? activeRole : role;

  useEffect(() => {
    const load = () =>
      setActiveRole(storedRole(window.localStorage.getItem("experience-active-role")));
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const filterNavItems = (items: typeof employeeNav) =>
    items.filter((item) => {
      const featureId = featureForPath(item.href);
      if (!featureId) {
        return true;
      }

      const feature = getFeature(flags, featureId);
      return Boolean(
        feature?.enabled &&
          feature.visibleInNavigation &&
          canRoleUseFeature(effectiveRole, feature.minimumRole),
      );
    });

  const navSections = roleHierarchy
    .filter((sectionRole) => roleCanAccess(effectiveRole, sectionRole))
    .map((sectionRole) => ({
      role: sectionRole,
      label:
        sectionRole === "admin"
          ? "Experience Builder"
          : sectionRole === "manager"
            ? "Manager Tools"
            : "Employee Experience",
      items: filterNavItems(navByRole[sectionRole]),
    }))
    .filter((section) => section.items.length);

  const visibleUtilityNav = utilityNav.filter((item) => {
    const featureId = featureForPath(item.href);
    if (!featureId) {
      return true;
    }

    const feature = getFeature(flags, featureId);
    return Boolean(
      feature?.enabled &&
        feature.visibleInNavigation &&
        canRoleUseFeature(effectiveRole, feature.minimumRole),
    );
  });
  const disabledFeatureId = featureForPath(pathname);
  const disabledFeature =
    disabledFeatureId && !isFeatureEnabled(flags, disabledFeatureId)
      ? getFeature(flags, disabledFeatureId)
      : null;

  async function signOut() {
    setIsSigningOut(true);
    try {
      if (hasSupabaseBrowserEnv()) {
        await createClient().auth.signOut();
      }
    } finally {
      window.localStorage.removeItem("experience-active-role");
      window.localStorage.removeItem("journey-active-account-id");
      setActiveRole(null);
      router.push("/");
      setIsSigningOut(false);
    }
  }

  return (
    <div className="experience-shell min-h-screen bg-journey-mist">
      <SkinRuntimeClass />
      <div className="relative z-10 grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="cinema-surface min-w-0 overflow-hidden border-b border-journey-steel px-5 py-5 text-journey-white lg:border-b-0 lg:border-r">
          <div className="grid gap-4 sm:flex sm:items-center sm:justify-between lg:block">
            <Link
              href={routeForRole(effectiveRole)}
              className="focus-ring block rounded-md"
              aria-label="Go to Experience home"
            >
              <BrandLockup size="sm" className="min-w-0" />
            </Link>
            <div className="flex min-w-0 flex-wrap items-center gap-2 lg:mt-6">
              <span className="rounded-sm bg-journey-red px-2 py-1 text-xs font-black uppercase text-journey-white">
                {roleLabels[effectiveRole]}
              </span>
              <PreviewModeBadge />
            </div>
          </div>
          <ActiveAccountBadge />
          <div className="mt-6 grid gap-5">
            {navSections.map((section) => (
              <div key={section.role}>
                <p className="mb-2 text-[10px] font-black uppercase tracking-normal text-journey-red">
                  {section.label}
                </p>
                <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="focus-ring flex min-h-10 min-w-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-bold text-journey-line transition hover:bg-journey-white hover:text-journey-black sm:text-sm lg:gap-3"
                    >
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0 break-words">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
          {visibleUtilityNav.length ? (
            <div className="mt-6 border-t border-journey-steel pt-5">
              <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {visibleUtilityNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="focus-ring flex min-h-10 min-w-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-bold text-journey-line transition hover:bg-journey-white hover:text-journey-black sm:text-sm lg:gap-3"
                  >
                    <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 break-words">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          ) : null}
          <div className="mt-6 border-t border-journey-steel pt-5">
            <button
              type="button"
              onClick={() => void signOut()}
              disabled={isSigningOut}
              className="focus-ring flex min-h-10 w-full min-w-0 items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-bold text-journey-line transition hover:bg-journey-white hover:text-journey-black disabled:cursor-wait disabled:opacity-70 sm:text-sm lg:gap-3"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{isSigningOut ? "Logging Out..." : "Log Out"}</span>
            </button>
          </div>
        </aside>
        <main className="min-w-0">
          <header className="border-b border-journey-line bg-journey-white px-5 py-6 shadow-line sm:px-8">
            <div className="grid gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
              <div className="min-w-0">
                {eyebrow ? (
                  <p className="text-xs font-black uppercase text-journey-red">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="mt-1 break-words text-3xl font-black text-journey-black sm:text-4xl">
                  {title}
                </h1>
              </div>
              <div className={cn("flex flex-wrap items-center gap-2")}>{actions}</div>
            </div>
          </header>
          <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">
            {disabledFeature ? <FeatureComingSoon feature={disabledFeature} /> : children}
          </div>
        </main>
      </div>
    </div>
  );
}
