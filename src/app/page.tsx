import { Anchor, KeyRound, Ship } from "lucide-react";
import { OdysseyMasthead } from "@/components/public/OdysseyMasthead";
import { PointsLookupForm } from "@/components/public/PointsLookupForm";

export default function WelcomePage() {
  return (
    <main className="odyssey-public-shell min-h-screen px-4 py-5 text-[#fff8e7] sm:px-7 sm:py-7">
      <div className="odyssey-public-frame mx-auto min-h-[calc(100vh-2.5rem)] max-w-5xl p-4 sm:min-h-[calc(100vh-3.5rem)] sm:p-7">
        <OdysseyMasthead />

        <section className="relative z-10 grid items-center gap-9 py-10 lg:grid-cols-[1.08fr_.92fr] lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#d71920]">
              The Odyssey Incentive
            </p>
            <h1 className="mt-4 font-serif text-5xl font-bold leading-[.92] text-[#f3d878] sm:text-7xl">
              How far has your crew journeyed?
            </h1>
            <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-[#fff8e7]/75">
              Use the private code or link your manager shared with you. Your page shows only
              your own point total—never a browsable crew list.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-black uppercase tracking-[0.12em] text-[#f3d878]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c8a958]/55 px-4 py-2">
                <Anchor className="h-4 w-4 text-[#d71920]" aria-hidden="true" />
                Earn points
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c8a958]/55 px-4 py-2">
                <Ship className="h-4 w-4 text-[#d71920]" aria-hidden="true" />
                Claim rewards
              </span>
            </div>
          </div>

          <div className="rounded-xl border-2 border-[#c8a958] bg-[#fffaf0] p-5 text-[#102631] shadow-[0_22px_60px_rgba(0,0,0,.3)] sm:p-7">
            <KeyRound className="h-9 w-9 text-[#d71920]" aria-hidden="true" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-[#a0802f]">
              Private crew access
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold">Check my points</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#526875]">
              You can paste the whole link or just the unique code at the end.
            </p>
            <div className="mt-6">
              <PointsLookupForm />
            </div>
          </div>
        </section>

        <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#c8a958]/45 pt-5 text-sm font-bold text-[#fff8e7]/65">
          <span>July 17 – August 12</span>
          <span className="font-serif italic text-[#f3d878]">The higher the sea, the greater the treasure.</span>
        </footer>
      </div>
    </main>
  );
}
