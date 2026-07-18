import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Gift, LockKeyhole, Ship } from "lucide-react";
import { OdysseyMasthead } from "@/components/public/OdysseyMasthead";
import { isArchived } from "@/lib/archive";
import { ODYSSEY_REWARD_IDS } from "@/lib/odyssey-config";
import { readExperienceState } from "@/lib/server/experience-state";
import { findEmployeePointsByToken } from "@/lib/server/points-lookup";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Odyssey Points | Celebration Cinema North",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function EmployeePointsPage({
  params,
}: {
  params: Promise<{ lookup_token: string }>;
}) {
  const { lookup_token } = await params;
  const employee = await findEmployeePointsByToken(lookup_token);

  if (!employee) {
    return (
      <main className="odyssey-public-shell flex min-h-screen items-center px-4 py-8 text-[#fff8e7]">
        <div className="odyssey-public-frame mx-auto w-full max-w-2xl p-5 sm:p-8">
          <OdysseyMasthead compact />
          <section className="relative z-10 py-12 text-center">
            <LockKeyhole className="mx-auto h-10 w-10 text-[#d71920]" aria-hidden="true" />
            <h1 className="mt-5 font-serif text-4xl font-bold text-[#f3d878]">This private link is not available.</h1>
            <p className="mx-auto mt-4 max-w-lg font-semibold leading-7 text-[#fff8e7]/70">
              Ask a manager for a fresh points link. No employee names or totals are shown from
              an incomplete, expired, or incorrect code.
            </p>
            <Link href="/" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-lg border border-[#c8a958] px-5 font-black text-[#f3d878]">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              Try another code
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const { state } = await readExperienceState();
  const rewardIds = new Set<string>(ODYSSEY_REWARD_IDS);
  const rewards = state.rewards
    .filter((reward) => rewardIds.has(reward.id) && reward.enabled && !isArchived(reward))
    .sort((a, b) => a.milesCost - b.milesCost || a.sortOrder - b.sortOrder);
  const nextReward = rewards.find((reward) => reward.milesCost > employee.points);
  const availableRewards = rewards.filter((reward) => reward.milesCost <= employee.points);

  return (
    <main className="odyssey-public-shell min-h-screen px-3 py-3 text-[#fff8e7] sm:px-6 sm:py-6">
      <div className="odyssey-public-frame mx-auto max-w-4xl p-4 sm:p-7">
        <OdysseyMasthead compact />

        <section className="relative z-10 py-8 text-center sm:py-12">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d71920]">Private crew total</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-[#f3d878] sm:text-6xl">
            {employee.displayName}&apos;s Odyssey
          </h1>
          <div className="mx-auto mt-7 max-w-xl rounded-2xl border-2 border-[#c8a958] bg-[#fffaf0] p-7 text-[#102631] shadow-[0_24px_65px_rgba(0,0,0,.32)] sm:p-10">
            <Ship className="mx-auto h-9 w-9 text-[#d71920]" aria-hidden="true" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-[#9a7f39]">Current point total</p>
            <p className="mt-2 text-7xl font-black leading-none text-[#102631] sm:text-8xl">{employee.points}</p>
            <p className="mt-3 font-serif text-xl italic text-[#8b712f]">points charted</p>
            {nextReward ? (
              <div className="mt-7 rounded-lg border border-[#d7c78d] bg-white p-4 text-left">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d71920]">Next reward</p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="font-black">{nextReward.name}</p>
                  <p className="shrink-0 font-black text-[#9a7f39]">{nextReward.milesCost - employee.points} to go</p>
                </div>
              </div>
            ) : rewards.length ? (
              <p className="mt-7 rounded-lg bg-[#102631] p-4 font-black text-[#f3d878]">
                You have reached every reward level on the current chart.
              </p>
            ) : null}
          </div>
        </section>

        <section className="relative z-10 rounded-xl border border-[#c8a958]/65 bg-[#fffaf0] p-5 text-[#102631] sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d71920]">Prize list · opens week two</p>
              <h2 className="mt-2 font-serif text-3xl font-bold">Treasure on the horizon</h2>
            </div>
            <p className="text-sm font-black text-[#8b712f]">{availableRewards.length} level{availableRewards.length === 1 ? "" : "s"} reached</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {rewards.map((reward) => {
              const reached = employee.points >= reward.milesCost;
              return (
                <div
                  key={reward.id}
                  className={`flex min-h-16 items-center justify-between gap-4 rounded-lg border p-4 ${
                    reached ? "border-[#b99a45] bg-[#fff5cf]" : "border-[#ded2a7] bg-white"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${reached ? "bg-[#d71920] text-white" : "bg-[#102631] text-[#f3d878]"}`}>
                      {reached ? <Check className="h-5 w-5" aria-hidden="true" /> : <Gift className="h-5 w-5" aria-hidden="true" />}
                    </span>
                    <p className="font-black leading-tight">{reward.name}</p>
                  </div>
                  <p className="shrink-0 font-black text-[#9a7f39]">{reward.milesCost}</p>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="relative z-10 mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#c8a958]/45 pt-5 text-sm font-bold text-[#fff8e7]/65">
          <span>Your link is private. Do not post it in public chats.</span>
          <span className="font-serif italic text-[#f3d878]">The higher the sea, the greater the treasure.</span>
        </footer>
      </div>
    </main>
  );
}
