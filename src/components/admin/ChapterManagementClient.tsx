"use client";

import { CalendarDays, Goal, RotateCcw, Save } from "lucide-react";
import { ChapterSettingsEditor } from "@/components/admin/ChapterSettingsEditor";
import { ChapterProgress } from "@/components/dashboard/ChapterProgress";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { chapterSettings } from "@/lib/data";
import { useJourneyState } from "@/lib/journey-state";
import { daysRemaining, formatDate, formatMiles } from "@/lib/utils";

export function ChapterManagementClient() {
  const { state, updateState } = useJourneyState();
  const communityMiles = state.departments.reduce(
    (total, department) => total + department.progressMiles,
    0,
  );

  function resetProgress() {
    updateState((current) => ({
      ...current,
      departments: current.departments.map((department) => ({
        ...department,
        progressMiles: 0,
      })),
      employees: current.employees.map((employee) => ({
        ...employee,
        miles: 0,
        weeklyMiles: 0,
        reliabilityStreak: 0,
      })),
      excellenceLogs: [],
    }));
  }

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel className="bg-journey-black text-journey-white">
          <ChapterProgress inverse />
        </Panel>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <MetricCard
            label="Community Goal"
            value={formatMiles(state.chapter.communityGoalMiles)}
            detail={`${formatMiles(communityMiles)} earned`}
            icon={Goal}
          />
          <MetricCard
            label="Days Left"
            value={`${daysRemaining(state.chapter.endDate)}`}
            detail={`${formatDate(state.chapter.startDate)} - ${formatDate(state.chapter.endDate)}`}
            icon={CalendarDays}
          />
        </div>
      </div>

      <Panel className="mt-5">
        <PanelHeader
          title="Manage Current Activation"
          eyebrow={state.chapter.chapterNumber}
          action={<Save className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <ChapterSettingsEditor settings={chapterSettings} />
      </Panel>

      <Panel className="mt-5">
        <PanelHeader title="Activation Operations" eyebrow="Preview controls" />
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 rounded-lg border border-journey-line p-4 text-sm font-bold text-journey-black">
            Active Status
            <select
              value={state.chapter.active ? "active" : "draft"}
              onChange={(event) =>
                updateState((current) => ({
                  ...current,
                  chapter: {
                    ...current.chapter,
                    active: event.target.value === "active",
                  },
                }))
              }
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
            >
              <option value="active">active</option>
              <option value="draft">draft</option>
            </select>
          </label>
          <div className="rounded-lg border border-journey-line p-4">
            <p className="text-xs font-black uppercase text-journey-red">Current Progress</p>
            <p className="mt-2 text-2xl font-black text-journey-black">
              {formatMiles(communityMiles)}
            </p>
          </div>
          <div className="rounded-lg border border-journey-line p-4">
            <p className="text-xs font-black uppercase text-journey-red">Fresh Activation</p>
            <Button
              type="button"
              variant="secondary"
              icon={RotateCcw}
              className="mt-2"
              onClick={resetProgress}
            >
              Reset Progress
            </Button>
          </div>
        </div>
      </Panel>
    </>
  );
}
