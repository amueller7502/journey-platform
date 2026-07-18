"use client";

import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  ManagerConsolePerson,
  ManagerConsolePointHistory,
} from "@/lib/manager-console-types";

export function OdysseyPointHistory({
  people,
  history,
}: {
  people: ManagerConsolePerson[];
  history: ManagerConsolePointHistory[];
}) {
  const crew = useMemo(
    () => people.filter((person) => person.role === "employee"),
    [people],
  );
  const [employeeId, setEmployeeId] = useState(crew[0]?.id ?? "");
  const employee = crew.find((person) => person.id === employeeId) ?? crew[0];
  const entries = history.filter((entry) => entry.employeeId === employee?.id);

  return (
    <section className="rounded-xl border border-[#ccb567] bg-[#fffaf0] p-4 text-[#102631] shadow-[0_16px_45px_rgba(8,27,36,.14)] sm:p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b41920]">Point ledger</p>
      <h2 className="mt-1 font-serif text-3xl font-bold">What each person earned</h2>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#526875]">
        Choose a crew member to see every saved Experience Moment, Crew Quest item, and
        point correction with its manager note.
      </p>

      <label className="mt-5 grid gap-2 text-sm font-black">
        Crew member
        <select
          value={employee?.id ?? ""}
          onChange={(event) => setEmployeeId(event.target.value)}
          className="min-h-12 rounded-lg border-2 border-[#d4c27e] bg-white px-3 outline-none focus:border-[#d71920]"
        >
          {crew.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name} — {person.points} lifetime points
            </option>
          ))}
        </select>
      </label>

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
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/55">Available</p>
            <p className="mt-1 text-xl font-black text-[#f3d878]">{employee.availablePoints}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-lg border border-[#ded2a7] bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-black text-[#102631]">{entry.label}</p>
                <p className="mt-1 text-xs font-bold text-[#8b712f]">
                  {new Date(entry.createdAt).toLocaleString()} · {entry.managerName}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-black ${
                entry.points < 0
                  ? "bg-[#fff1ed] text-[#b41920]"
                  : "bg-[#102631] text-[#f3d878]"
              }`}>
                {entry.points > 0 ? "+" : ""}{entry.points}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#526875]">{entry.note}</p>
          </article>
        ))}
        {!entries.length ? (
          <div className="grid place-items-center rounded-lg border border-dashed border-[#d4c27e] bg-white p-8 text-center">
            <ClipboardList className="h-7 w-7 text-[#b41920]" aria-hidden="true" />
            <p className="mt-3 font-black">No saved point history yet.</p>
            <p className="mt-1 text-sm font-semibold text-[#526875]">
              New Experience Moments and Crew Quest entries will appear here after Supabase is connected.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
