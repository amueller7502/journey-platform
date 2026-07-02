import { Clapperboard } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { PasswordResetClient } from "@/components/auth/PasswordResetClient";
import { productLanguage } from "@/lib/product-language";

export default function ResetPasswordPage() {
  return (
    <main className="cinema-surface film-grain relative min-h-screen text-journey-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 film-perf opacity-30" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 film-perf opacity-30" />
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <BrandLockup size="md" />
          <div className="rounded-sm border border-journey-steel px-3 py-2 text-sm font-bold text-journey-line">
            Celebration Cinema North
          </div>
        </header>

        <section className="grid flex-1 items-center py-12">
          <PasswordResetClient />
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-journey-steel pt-5 text-sm font-bold text-journey-line">
          <span>{productLanguage.mission}</span>
          <span className="inline-flex items-center gap-2">
            <Clapperboard className="h-4 w-4 text-journey-red" aria-hidden="true" />
            Experience Platform
          </span>
        </footer>
      </div>
    </main>
  );
}
