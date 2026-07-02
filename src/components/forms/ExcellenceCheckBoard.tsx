"use client";

import { useState } from "react";
import { Building2, CheckCircle2, Circle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { logExcellenceCheck, useJourneyState } from "@/lib/journey-state";
import type { DepartmentId } from "@/lib/types";

export function ExcellenceCheckBoard() {
  const { state } = useJourneyState();
  const excellenceCheckTypes = state.recognitionTypes
    .filter((type) => type.enabled && type.type === "excellence_check")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const visibleDepartments = state.departments.filter(
    (department) => department.id !== "leadership",
  );
  const [departmentId, setDepartmentId] = useState<DepartmentId>(
    (visibleDepartments[0]?.id ?? "floor") as DepartmentId,
  );
  const [note, setNote] = useState("");
  const [lastLoggedId, setLastLoggedId] = useState("");
  const recentLogs = state.excellenceLogs.slice(0, 6);

  function handleLogCheck(checkId: string, miles: number, checkName: string) {
    logExcellenceCheck({
      recognitionTypeId: checkId,
      departmentId,
      managerId: "mgr-jordan",
      note:
        note.trim() ||
        `${checkName} logged for ${
          visibleDepartments.find((department) => department.id === departmentId)?.name ??
          "the building"
        }.`,
      communityMiles: miles,
    });
    setLastLoggedId(checkId);
    setNote("");
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-journey-line bg-journey-mist p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              Building Readiness
            </p>
            <h3 className="mt-1 text-xl font-black text-journey-black">
              Excellence Checks add Community XP, not spendable employee XP.
            </h3>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-journey-steel">
              Use this screen for verified spaces and operational standards. To reward
              a specific person for the work behind the check, capture a separate
              Experience Moment.
            </p>
          </div>
          <div className="rounded-md border border-journey-line bg-journey-white p-3">
            <p className="text-xs font-black uppercase text-journey-red">
              Recent readiness logs
            </p>
            <p className="mt-1 text-3xl font-black text-journey-black">
              {state.excellenceLogs.length}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[0.45fr_1fr]">
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Department / Area
            <select
              value={departmentId}
              onChange={(event) => setDepartmentId(event.target.value as DepartmentId)}
              className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
            >
              {visibleDepartments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Optional Readiness Note
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
              placeholder="What was verified?"
            />
          </label>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2">
      {!excellenceCheckTypes.length ? (
        <div className="rounded-lg border border-journey-line bg-journey-white p-4 text-sm font-bold text-journey-steel md:col-span-2">
          No enabled excellence checks are available. Add or enable checks in Admin /
          Recognition Studio.
        </div>
      ) : null}
      {excellenceCheckTypes.map((check) => {
        const isComplete = lastLoggedId === check.id;
        return (
          <article
            key={check.id}
            className="rounded-lg border border-journey-line bg-journey-white p-4 shadow-line"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-black text-journey-black">{check.name}</h3>
                <p className="mt-2 text-sm font-bold text-journey-steel">
                  +{check.milesValue} Community XP per confirmed check
                </p>
                <p className="mt-2 text-sm leading-6 text-journey-steel">
                  {check.description}
                </p>
              </div>
              {isComplete ? (
                <CheckCircle2 className="h-6 w-6 text-journey-red" aria-hidden="true" />
              ) : (
                <Circle className="h-6 w-6 text-journey-steel" aria-hidden="true" />
              )}
            </div>
            <Button
              type="button"
              icon={Plus}
              variant={isComplete ? "secondary" : "primary"}
              className="mt-4 w-full"
              onClick={() => handleLogCheck(check.id, check.milesValue, check.name)}
            >
              {isComplete ? "Logged Just Now" : "Log Readiness Check"}
            </Button>
          </article>
        );
      })}
      </div>

      <section className="rounded-lg border border-journey-line bg-journey-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-journey-red" aria-hidden="true" />
          <h3 className="font-black text-journey-black">Recent Excellence Logs</h3>
        </div>
        <div className="grid gap-3">
          {recentLogs.map((log) => {
            const check = state.recognitionTypes.find(
              (type) => type.id === log.recognitionTypeId,
            );
            const department = state.departments.find(
              (item) => item.id === log.departmentId,
            );
            return (
              <div
                key={log.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-journey-line p-3"
              >
                <div>
                  <p className="font-black text-journey-black">
                    {check?.name ?? "Excellence Check"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-journey-steel">
                    {department?.name} - {log.note}
                  </p>
                </div>
                <p className="text-sm font-black text-journey-red">
                  +{log.communityMiles} Community XP
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
