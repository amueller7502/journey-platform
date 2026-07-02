import Link from "next/link";
import type { ReactNode } from "react";
import { ActiveAccountBadge } from "@/components/ActiveAccountBadge";
import { BrandLockup } from "@/components/BrandLockup";
import { PreviewModeBadge } from "@/components/PreviewModeBadge";
import { SkinRuntimeClass } from "@/components/SkinRuntimeClass";
import { adminNav, employeeNav, managerNav, roleLabels, utilityNav } from "@/lib/data";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const navByRole = {
  employee: employeeNav,
  manager: managerNav,
  admin: adminNav,
};

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
  const navItems = navByRole[role];

  return (
    <div className="experience-shell min-h-screen bg-journey-mist">
      <SkinRuntimeClass />
      <div className="relative z-10 grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="cinema-surface border-b border-journey-steel px-5 py-5 text-journey-white lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <BrandLockup size="sm" />
            <div className="flex flex-wrap items-center gap-2 lg:mt-6">
              <span className="rounded-sm bg-journey-red px-2 py-1 text-xs font-black uppercase text-journey-white">
                {roleLabels[role]}
              </span>
              <PreviewModeBadge />
            </div>
          </div>
          <ActiveAccountBadge />
          <nav className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-xs font-bold text-journey-line transition hover:bg-journey-white hover:text-journey-black sm:text-sm lg:gap-3"
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-journey-steel pt-5">
            <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {utilityNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-xs font-bold text-journey-line transition hover:bg-journey-white hover:text-journey-black sm:text-sm lg:gap-3"
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main className="min-w-0">
          <header className="border-b border-journey-line bg-journey-white px-5 py-6 shadow-line sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                {eyebrow ? (
                  <p className="text-xs font-black uppercase text-journey-red">
                    {eyebrow}
                  </p>
                ) : null}
                <h1 className="mt-1 text-3xl font-black text-journey-black sm:text-4xl">
                  {title}
                </h1>
              </div>
              <div className={cn("flex flex-wrap items-center gap-2")}>{actions}</div>
            </div>
          </header>
          <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
