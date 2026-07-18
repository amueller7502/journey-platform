"use client";

import { LoaderCircle, MinusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  ManagerConsolePerson,
  ManagerConsolePointHistory,
} from "@/lib/manager-console-types";

type RemovalStatus =
  | { kind: "idle" }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function OdysseyPointRemovalManager({
  submissionCredential,
  people,
  managerId,
  persistenceReady,
  onPeopleChange,
  onHistoryAdd,
}: {
  submissionCredential: string;
  people: ManagerConsolePerson[];
  managerId: string;
  persistenceReady: boolean;
  onPeopleChange: (people: ManagerConsolePerson[]) => void;
  onHistoryAdd: (entry: ManagerConsolePointHistory) => void;
}) {
  const crew = useMemo(
    () => people.filter((person) => person.role === "employee"),
    [people],
  );
  const [employeeId, setEmployeeId] = useState(crew[0]?.id ?? "");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<RemovalStatus>({ kind: "idle" });
  const employee = crew.find((person) => person.id === employeeId) ?? crew[0];
  const amount = Math.trunc(Number(points));
  const canRemove = Boolean(
    persistenceReady &&
      managerId &&
      employee &&
      Number.isFinite(amount) &&
      amount > 0 &&
      amount <= employee.availablePoints &&
      reason.trim() &&
      status.kind !== "working",
  );

  async function removePoints() {
    if (!employee || !canRemove) {
      return;
    }
    if (!window.confirm(`Remove ${amount} points from ${employee.name}?`)) {
      return;
    }

    setStatus({ kind: "working", message: "Removing the points..." });
    try {
      const response = await fetch("/api/experience/point-adjustments", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-experience-manager-key": submissionCredential,
        },
        body: JSON.stringify({
          employeeId: employee.id,
          managerId,
          points: amount,
          reason: reason.trim(),
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        message?: string;
        people?: ManagerConsolePerson[];
        historyEntry?: ManagerConsolePointHistory;
      };
      if (!response.ok || !payload.people) {
        throw new Error(payload.error ?? "The points could not be removed.");
      }

      onPeopleChange(payload.people);
      if (payload.historyEntry) {
        onHistoryAdd(payload.historyEntry);
      }
      setPoints("");
      setReason("");
      setStatus({ kind: "success", message: payload.message ?? "Points removed." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "The points could not be removed.",
      });
    }
  }

  return (
    <section className="rounded-xl border border-[#ccb567] bg-[#fffaf0] p-4 text-[#102631] shadow-[0_16px_45px_rgba(8,27,36,.14)] sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b41920]">Corrections</p>
      <h2 className="mt-1 font-serif text-3xl font-bold">Remove points</h2>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#526875]">
        Use this only to correct points added by mistake. A reason is kept for the audit
        trail. Points already committed to a reward must be unredeemed first.
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
                {person.name} — {person.availablePoints} removable
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-black">
          Points to remove
          <input
            type="number"
            min={1}
            max={employee?.availablePoints ?? 0}
            inputMode="numeric"
            value={points}
            onChange={(event) => setPoints(event.target.value)}
            className="min-h-12 rounded-lg border-2 border-[#d4c27e] bg-white px-3 outline-none focus:border-[#d71920]"
            placeholder="Enter amount"
          />
        </label>
      </div>

      {employee ? (
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-[#102631] p-4 text-center text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">Lifetime earned</p>
            <p className="mt-1 text-xl font-black text-[#f3d878]">{employee.points}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">Redeemed</p>
            <p className="mt-1 text-xl font-black text-[#f3d878]">{employee.redeemedPoints}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">Removable</p>
            <p className="mt-1 text-xl font-black text-[#f3d878]">{employee.availablePoints}</p>
          </div>
        </div>
      ) : null}

      <label className="mt-4 grid gap-2 text-sm font-black">
        Reason for correction
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          className="resize-none rounded-lg border-2 border-[#d4c27e] bg-white p-3 outline-none focus:border-[#d71920]"
          placeholder="Example: Duplicate Crew Quest entry"
        />
      </label>

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
        disabled={!canRemove}
        onClick={() => void removePoints()}
        className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#102631] px-5 text-base font-black text-[#f3d878] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {status.kind === "working" ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <MinusCircle className="h-5 w-5" aria-hidden="true" />}
        Remove {amount > 0 ? amount : 0} Points
      </button>
    </section>
  );
}
