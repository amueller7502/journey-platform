import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { WorkspaceLoginPanel } from "@/components/WorkspaceLoginPanel";

export const metadata: Metadata = {
  title: "Staff Access | Experience",
  robots: { index: false, follow: false },
};

export default function StaffAccessPage() {
  return (
    <main className="cinema-surface film-grain relative min-h-screen text-journey-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <BrandLockup size="md" />
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-journey-steel px-4 font-bold">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Points page
          </Link>
        </header>
        <section className="grid flex-1 items-center py-10">
          <WorkspaceLoginPanel />
        </section>
      </div>
    </main>
  );
}
