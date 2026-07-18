"use client";

import { Gift, LoaderCircle, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  ManagerConsolePerson,
  ManagerConsoleRedemption,
  ManagerConsoleReward,
} from "@/lib/manager-console-types";

type RedemptionStatus =
  | { kind: "idle" }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function OdysseyRedemptionManager({
  submissionCredential,
  people,
  rewards,
  redemptions,
  managerId,
  persistenceReady,
  onChange,
}: {
  submissionCredential: string;
  people: ManagerConsolePerson[];
  rewards: ManagerConsoleReward[];
  redemptions: ManagerConsoleRedemption[];
  managerId: string;
  persistenceReady: boolean;
  onChange: (
    people: ManagerConsolePerson[],
    rewards: ManagerConsoleReward[],
    redemptions: ManagerConsoleRedemption[],
  ) => void;
}) {
  const crew = useMemo(
    () => people.filter((person) => person.role === "employee"),
    [people],
  );
  const [employeeId, setEmployeeId] = useState(crew[0]?.id ?? "");
  const [rewardId, setRewardId] = useState(rewards[0]?.id ?? "");
  const [status, setStatus] = useState<RedemptionStatus>({ kind: "idle" });
  const employee = crew.find((person) => person.id === employeeId) ?? crew[0];
  const reward = rewards.find((item) => item.id === rewardId) ?? rewards[0];
  const canRedeem = Boolean(
    persistenceReady &&
    employee &&
    reward &&
    managerId &&
    employee.availablePoints >= reward.pointsCost &&
    status.kind !== "working",
  );

  async function redeem() {
    if (!employee || !reward || !canRedeem) {
      return;
    }
    if (!window.confirm(`Redeem ${reward.pointsCost} points from ${employee.name} for ${reward.name}?`)) {
      return;
    }

    setStatus({ kind: "working", message: "Recording the redemption..." });
    try {
      const response = await fetch("/api/experience/manager-redemptions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-experience-manager-key": submissionCredential,
        },
        body: JSON.stringify({ employeeId: employee.id, rewardId: reward.id, managerId }),
      });
      const payload = (await response.json()) as {
        error?: string;
        message?: string;
        people?: ManagerConsolePerson[];
        rewards?: ManagerConsoleReward[];
        redemptions?: ManagerConsoleRedemption[];
      };
      if (!response.ok || !payload.people || !payload.rewards || !payload.redemptions) {
        throw new Error(payload.error ?? "The redemption could not be saved.");
      }

      onChange(payload.people, payload.rewards, payload.redemptions);
      setStatus({ kind: "success", message: payload.message ?? "Redemption saved." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "The redemption could not be saved.",
      });
    }
  }

  async function unredeem(redemption: ManagerConsoleRedemption) {
    if (!persistenceReady || status.kind === "working") {
      return;
    }
    if (!window.confirm(`Reverse ${redemption.employeeName}'s ${redemption.rewardName} redemption and return ${redemption.pointsCost} available points?`)) {
      return;
    }

    setStatus({ kind: "working", message: "Reversing the redemption..." });
    try {
      const response = await fetch("/api/experience/manager-redemptions", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-experience-manager-key": submissionCredential,
        },
        body: JSON.stringify({ redemptionId: redemption.id, managerId }),
      });
      const payload = (await response.json()) as {
        error?: string;
        message?: string;
        people?: ManagerConsolePerson[];
        rewards?: ManagerConsoleReward[];
        redemptions?: ManagerConsoleRedemption[];
      };
      if (!response.ok || !payload.people || !payload.rewards || !payload.redemptions) {
        throw new Error(payload.error ?? "The redemption could not be reversed.");
      }

      onChange(payload.people, payload.rewards, payload.redemptions);
      setStatus({ kind: "success", message: payload.message ?? "Redemption reversed." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "The redemption could not be reversed.",
      });
    }
  }

  return (
    <section className="rounded-xl border border-[#ccb567] bg-[#fffaf0] p-4 text-[#102631] shadow-[0_16px_45px_rgba(8,27,36,.14)] sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b41920]">Rewards</p>
      <h2 className="mt-1 font-serif text-3xl font-bold">Redeem crew points</h2>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#526875]">
        This records the reward as fulfilled immediately. Earned points remain visible for
        the leaderboard, while available points are reduced and redeemed points increase.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-black">
          Crew member
          <select
            value={employee?.id ?? ""}
            onChange={(event) => {
              setEmployeeId(event.target.value);
              setStatus({ kind: "idle" });
            }}
            className="min-h-12 rounded-lg border-2 border-[#d4c27e] bg-white px-3 outline-none focus:border-[#d71920]"
          >
            {crew.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} — {person.availablePoints} available
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black">
          Reward
          <select
            value={reward?.id ?? ""}
            onChange={(event) => {
              setRewardId(event.target.value);
              setStatus({ kind: "idle" });
            }}
            className="min-h-12 rounded-lg border-2 border-[#d4c27e] bg-white px-3 outline-none focus:border-[#d71920]"
          >
            {rewards.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.pointsCost} points
              </option>
            ))}
          </select>
        </label>
      </div>

      {employee ? (
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg bg-[#102631] p-4 text-center text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">Lifetime earned</p>
            <p className="mt-1 text-xl font-black text-[#f3d878]">{employee.points}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">Redeemed</p>
            <p className="mt-1 text-xl font-black text-[#f3d878]">{employee.redeemedPoints}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">Available</p>
            <p className="mt-1 text-xl font-black text-[#f3d878]">{employee.availablePoints}</p>
          </div>
        </div>
      ) : null}

      {status.kind !== "idle" ? (
        <div className={`mt-4 flex items-center gap-2 rounded-lg border p-3 text-sm font-bold ${
          status.kind === "error"
            ? "border-[#d71920]/40 bg-[#fff1ed] text-[#9f1117]"
            : "border-[#d4c27e] bg-white text-[#526875]"
        }`} aria-live="polite">
          {status.kind === "working" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {status.message}
        </div>
      ) : null}

      <button
        type="button"
        disabled={!canRedeem}
        onClick={() => void redeem()}
        className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#d71920] px-5 text-base font-black text-white shadow-[0_12px_28px_rgba(215,25,32,.24)] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {status.kind === "working" ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Gift className="h-5 w-5" aria-hidden="true" />}
        {reward ? `Redeem ${reward.pointsCost} Points` : "Choose a Reward"}
      </button>
      {employee && reward && employee.availablePoints < reward.pointsCost ? (
        <p className="mt-3 text-center text-sm font-bold text-[#b41920]">
          {employee.name} needs {reward.pointsCost - employee.availablePoints} more available points.
        </p>
      ) : null}

      <div className="mt-8 border-t border-[#d7c78d] pt-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b41920]">Corrections</p>
            <h3 className="mt-1 font-serif text-2xl font-bold">Recent redemptions</h3>
          </div>
          <p className="text-xs font-bold text-[#526875]">Unredeem returns the points to Available. Lifetime Earned stays unchanged.</p>
        </div>
        <div className="mt-4 grid gap-3">
          {redemptions.slice(0, 25).map((redemption) => (
            <div key={redemption.id} className="flex flex-col gap-3 rounded-lg border border-[#ded2a7] bg-white p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="font-black text-[#102631]">{redemption.employeeName}</p>
                <p className="mt-1 text-sm font-semibold text-[#526875]">
                  {redemption.rewardName} · {redemption.pointsCost} points · {new Date(redemption.fulfilledAt).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                disabled={!persistenceReady || status.kind === "working"}
                onClick={() => void unredeem(redemption)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-[#d71920] px-4 text-sm font-black text-[#b41920] disabled:opacity-45"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Unredeem
              </button>
            </div>
          ))}
          {!redemptions.length ? (
            <div className="rounded-lg border border-dashed border-[#d4c27e] bg-white p-5 text-center text-sm font-bold text-[#526875]">
              No fulfilled rewards yet.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
