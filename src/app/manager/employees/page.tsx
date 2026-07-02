"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, ClipboardCheck, HandHeart, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  type JourneyMoment,
  getJourneyMoments,
  subscribeToJourneyMoments,
} from "@/lib/demo-moments";
import { recognitions } from "@/lib/data";
import { useJourneyState } from "@/lib/journey-state";
import { formatShortDateTime, formatXp } from "@/lib/utils";

export default function ManagerEmployeeLookupPage() {
  const { state } = useJourneyState();
  const [search, setSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [moments, setMoments] = useState<JourneyMoment[]>([]);
  const crew = useMemo(
    () =>
      state.employees
        .filter((employee) => employee.role === "employee" && employee.active !== false)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [state.employees],
  );

  useEffect(() => {
    const load = () => setMoments(getJourneyMoments());
    load();
    return subscribeToJourneyMoments(load);
  }, []);

  const filteredCrew = crew.filter((employee) =>
    `${employee.name} ${employee.title} ${employee.department} ${employee.passportId}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const selectedEmployee =
    crew.find((employee) => employee.id === selectedEmployeeId) ??
    filteredCrew[0] ??
    crew[0];
  const department = state.departments.find(
    (item) => item.id === selectedEmployee?.department,
  );
  const localMoments = moments.filter(
    (moment) => moment.employeeId === selectedEmployee?.id,
  );
  const seededMoments = recognitions
    .filter((recognition) => recognition.employeeId === selectedEmployee?.id)
    .map((recognition) => {
      const type = state.recognitionTypes.find(
        (item) => item.id === recognition.recognitionTypeId,
      );
      return {
        id: recognition.id,
        recognitionTypeName: type?.name ?? "Experience Moment",
        miles: recognition.miles,
        note: recognition.note,
        createdAt: recognition.createdAt,
      };
    });
  const recentMoments = [...localMoments, ...seededMoments].slice(0, 5);

  return (
    <AppShell role="manager" title="Employee Lookup" eyebrow="Fast crew view">
      <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
        <Panel>
          <PanelHeader title="Search Crew" eyebrow="One-handed friendly" />
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-journey-steel"
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="focus-ring min-h-12 w-full rounded-md border border-journey-line bg-journey-white pl-11 pr-3 text-base font-bold"
              placeholder="Search name, role, or card ID"
            />
          </label>
          <div className="mt-4 grid max-h-[620px] gap-2 overflow-y-auto pr-1">
            {filteredCrew.map((employee) => (
              <button
                key={employee.id}
                type="button"
                onClick={() => setSelectedEmployeeId(employee.id)}
                className={`focus-ring min-h-16 rounded-lg border p-4 text-left transition ${
                  selectedEmployee?.id === employee.id
                    ? "border-journey-red bg-journey-mist"
                    : "border-journey-line bg-journey-white hover:bg-journey-mist"
                }`}
              >
                <span className="block font-black text-journey-black">{employee.name}</span>
                <span className="mt-1 block text-sm font-bold text-journey-steel">
                  {employee.title} / {employee.passportId}
                </span>
              </button>
            ))}
          </div>
        </Panel>

        {selectedEmployee ? (
          <div className="grid gap-5">
            <Panel className="cinema-doodle-card bg-journey-black text-journey-white">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-journey-red">
                    {department?.name ?? "Crew"}
                  </p>
                  <h2 className="mt-1 text-4xl font-black">{selectedEmployee.name}</h2>
                  <p className="mt-2 font-bold text-journey-line">
                    {selectedEmployee.title} / {selectedEmployee.shift}
                  </p>
                </div>
                <div className="rounded-md border border-journey-steel px-3 py-2 text-sm font-black text-journey-line">
                  {selectedEmployee.passportId}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <LinkButton
                  href={`/manager/recognize?employee=${selectedEmployee.id}`}
                  icon={HandHeart}
                >
                  Capture Moment
                </LinkButton>
                <LinkButton
                  href={`/manager/passport/${selectedEmployee.passportId}`}
                  icon={ClipboardCheck}
                  variant="secondary"
                >
                  Enter Card
                </LinkButton>
              </div>
            </Panel>

            <div className="grid gap-5 md:grid-cols-3">
              <MetricCard
                label="Current XP"
                value={formatXp(selectedEmployee.miles)}
                detail="Total employee XP"
                icon={BadgeCheck}
              />
              <MetricCard
                label="This Week"
                value={formatXp(selectedEmployee.weeklyMiles)}
                detail="Recognized this week"
                icon={Sparkles}
              />
              <MetricCard
                label="Reliability"
                value={`${selectedEmployee.reliabilityStreak} weeks`}
                detail="Current streak"
                icon={ClipboardCheck}
              />
            </div>

            <Panel>
              <PanelHeader title="Recent Moments" eyebrow="Quick context" />
              <div className="grid gap-3">
                {recentMoments.length ? (
                  recentMoments.map((moment) => (
                    <article
                      key={moment.id}
                      className="rounded-lg border border-journey-line p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-journey-black">
                            {moment.recognitionTypeName}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-journey-steel">
                            {moment.note}
                          </p>
                        </div>
                        <p className="font-black text-journey-red">+{moment.miles} XP</p>
                      </div>
                      <p className="mt-2 text-xs font-bold uppercase text-journey-steel">
                        {formatShortDateTime(moment.createdAt)}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-lg border border-dashed border-journey-line p-4 text-sm font-bold text-journey-steel">
                    No recent Moments yet. Capture one when you see great work.
                  </p>
                )}
              </div>
            </Panel>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
