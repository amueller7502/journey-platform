import {
  Clapperboard,
} from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { PreviewModeBadge } from "@/components/PreviewModeBadge";
import { WorkspaceLoginPanel } from "@/components/WorkspaceLoginPanel";
import { chapter, filmFacts } from "@/lib/data";
import { productLanguage } from "@/lib/product-language";
import { formatDate } from "@/lib/utils";

export default function WelcomePage() {
  return (
    <main className="cinema-surface film-grain relative min-h-screen text-journey-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 film-perf opacity-30" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 film-perf opacity-30" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <BrandLockup size="md" />
          <div className="flex flex-wrap items-center gap-2">
            <PreviewModeBadge />
            <div className="rounded-sm border border-journey-steel px-3 py-2 text-sm font-bold text-journey-line">
              Celebration Cinema North
            </div>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-black uppercase text-journey-red">
              {productLanguage.platformName}
            </p>
            <h1 className="mt-3 max-w-3xl text-5xl font-black leading-none text-journey-white sm:text-7xl">
              {productLanguage.productName}
            </h1>
            <p className="mt-5 text-2xl font-black text-journey-white">
              Celebration Cinema North
            </p>
            <p className="mt-3 max-w-2xl text-lg font-bold text-journey-line">
              {productLanguage.mission}
            </p>
            <p className="mt-4 max-w-xl text-lg font-bold text-journey-line">
              {formatDate(chapter.startDate)} - {formatDate(chapter.endDate)}
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              <div className="projection-sweep rounded-lg border border-journey-steel bg-journey-coal p-5">
                <p className="text-xs font-black uppercase text-journey-red">Community Goal</p>
                <p className="mt-2 text-4xl font-black text-journey-white">15,700 Miles</p>
              </div>
              <div className="rounded-lg border border-journey-steel bg-journey-coal p-5">
                <p className="text-xs font-black uppercase text-journey-red">Theme Note</p>
                <p className="mt-2 text-xl font-black text-journey-white">
                  {chapter.themeNote}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {filmFacts.map((fact) => (
                <span
                  key={fact}
                  className="rounded-sm border border-journey-steel px-2 py-1 text-xs font-black uppercase text-journey-line"
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>

          <WorkspaceLoginPanel />
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-journey-steel pt-5 text-sm font-bold text-journey-line">
          <span>{chapter.imaxReference}</span>
          <span className="inline-flex items-center gap-2">
            <Clapperboard className="h-4 w-4 text-journey-red" aria-hidden="true" />
            {productLanguage.productName} Platform
          </span>
        </footer>
      </div>
    </main>
  );
}
