import type { Metadata } from "next";
import { Anchor, Coins, FileSpreadsheet, Gift, Users } from "lucide-react";
import { OdysseyMasthead } from "@/components/public/OdysseyMasthead";
import { readExperienceState } from "@/lib/server/experience-state";
import { crewLeaderboardRows } from "@/lib/server/leaderboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Odyssey Crew Leaderboard | Celebration Cinema North",
  description: "Current Odyssey incentive points and reward redemptions.",
  robots: { index: false, follow: false },
};

export default async function LeaderboardPage() {
  const { state } = await readExperienceState();
  const rows = crewLeaderboardRows(state);

  const totalEarned = rows.reduce((total, row) => total + row.earned, 0);
  const totalRedeemed = rows.reduce((total, row) => total + row.redeemed, 0);

  return (
    <main className="odyssey-public-shell min-h-screen px-3 py-3 text-[#fff8e7] sm:px-6 sm:py-6">
      <div className="odyssey-public-frame mx-auto max-w-6xl p-4 sm:p-7">
        <OdysseyMasthead />

        <section className="relative z-10 py-8 text-center sm:py-12">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d71920]">
            The Odyssey Incentive
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl font-serif text-4xl font-bold text-[#f3d878] sm:text-6xl">
            Crew Leaderboard
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-semibold leading-7 text-[#fff8e7]/70">
            Follow everyone&apos;s progress, see points used for rewards, and chart the
            voyage together. No account or special link is needed.
          </p>
        </section>

        <section className="relative z-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[#c8a958]/70 bg-[#fffaf0] p-5 text-[#102631] shadow-[0_16px_40px_rgba(0,0,0,.18)]">
            <Users className="h-6 w-6 text-[#d71920]" aria-hidden="true" />
            <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-[#9a7f39]">
              Crew Members
            </p>
            <p className="mt-1 text-3xl font-black">{rows.length}</p>
          </div>
          <div className="rounded-xl border border-[#c8a958]/70 bg-[#fffaf0] p-5 text-[#102631] shadow-[0_16px_40px_rgba(0,0,0,.18)]">
            <Coins className="h-6 w-6 text-[#d71920]" aria-hidden="true" />
            <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-[#9a7f39]">
              Lifetime Points Earned
            </p>
            <p className="mt-1 text-3xl font-black">{totalEarned.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-[#c8a958]/70 bg-[#fffaf0] p-5 text-[#102631] shadow-[0_16px_40px_rgba(0,0,0,.18)]">
            <Gift className="h-6 w-6 text-[#d71920]" aria-hidden="true" />
            <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-[#9a7f39]">
              Points Redeemed
            </p>
            <p className="mt-1 text-3xl font-black">{totalRedeemed.toLocaleString()}</p>
          </div>
        </section>

        <div className="relative z-10 mt-4 flex justify-end">
          <a
            href="/api/experience/leaderboard-export"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#f3d878] px-5 text-sm font-black text-[#102631] shadow-[0_12px_30px_rgba(0,0,0,.2)]"
          >
            <FileSpreadsheet className="h-5 w-5 text-[#b41920]" aria-hidden="true" />
            Export Leaderboard to Excel
          </a>
        </div>

        <section className="relative z-10 mt-5 overflow-hidden rounded-xl border border-[#c8a958]/70 bg-[#fffaf0] text-[#102631] shadow-[0_22px_60px_rgba(0,0,0,.25)]">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#d7c78d] p-5 sm:p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d71920]">
                Live Crew Standings
              </p>
              <h2 className="mt-1 font-serif text-3xl font-bold">Every point matters.</h2>
            </div>
            <p className="max-w-sm text-xs font-bold leading-5 text-[#526875] sm:text-right">
              Lifetime Earned never drops when a reward is redeemed. Available points are
              what remain after pending and fulfilled redemptions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                Odyssey crew points earned, pending, redeemed, and available
              </caption>
              <thead className="bg-[#102631] text-[#f3d878]">
                <tr className="text-xs font-black uppercase tracking-[0.14em]">
                  <th scope="col" className="px-4 py-4 text-center sm:px-6">Rank</th>
                  <th scope="col" className="px-4 py-4 sm:px-6">Crew Member</th>
                  <th scope="col" className="px-4 py-4 text-right sm:px-6">Lifetime Earned</th>
                  <th scope="col" className="px-4 py-4 text-right sm:px-6">Pending</th>
                  <th scope="col" className="px-4 py-4 text-right sm:px-6">Redeemed</th>
                  <th scope="col" className="px-4 py-4 text-right sm:px-6">Available</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-[#e1d6ae] last:border-b-0 ${
                      index < 3 ? "bg-[#fff5cf]" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-4 text-center sm:px-6">
                      <span className={`inline-grid h-9 w-9 place-items-center rounded-full font-black ${
                        index < 3
                          ? "bg-[#d71920] text-white"
                          : "bg-[#eee5c8] text-[#725e2b]"
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <th scope="row" className="px-4 py-4 font-black sm:px-6">{row.name}</th>
                    <td className="px-4 py-4 text-right font-black sm:px-6">{row.earned}</td>
                    <td className="px-4 py-4 text-right font-bold text-[#8b712f] sm:px-6">{row.pending}</td>
                    <td className="px-4 py-4 text-right font-bold text-[#526875] sm:px-6">{row.redeemed}</td>
                    <td className="px-4 py-4 text-right text-lg font-black text-[#b41920] sm:px-6">{row.available}</td>
                  </tr>
                ))}
                {!rows.length ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center font-bold text-[#526875]">
                      No active crew members have been added yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="relative z-10 mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#c8a958]/45 pt-5 text-sm font-bold text-[#fff8e7]/65">
          <span className="inline-flex items-center gap-2">
            <Anchor className="h-4 w-4 text-[#d71920]" aria-hidden="true" />
            Points update as managers submit Experience Moments.
          </span>
          <span className="font-serif italic text-[#f3d878]">
            The higher the sea, the greater the treasure.
          </span>
        </footer>
      </div>
    </main>
  );
}
