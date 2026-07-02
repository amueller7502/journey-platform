"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, Trophy, Users } from "lucide-react";
import { ChapterProgress } from "@/components/dashboard/ChapterProgress";
import { LinkButton } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { type JourneyMoment, getJourneyMoments, subscribeToJourneyMoments } from "@/lib/demo-moments";
import { recognitions } from "@/lib/data";
import { useJourneyState } from "@/lib/journey-state";
import { formatMiles } from "@/lib/utils";

export function CommunitySnapshot() {
  const { state } = useJourneyState();
  const [moments, setMoments] = useState<JourneyMoment[]>([]);

  useEffect(() => {
    const load = () => setMoments(getJourneyMoments());
    load();
    return subscribeToJourneyMoments(load);
  }, []);

  const recentMoments = useMemo(() => {
    const liveRows = moments.map((moment) => ({
      id: moment.id,
      employeeName: moment.employeeName,
      title: moment.recognitionTypeName,
      note: moment.note,
      miles: moment.miles,
    }));
    const seededRows = recognitions.slice(0, 4).map((recognition) => {
      const employee = state.employees.find((item) => item.id === recognition.employeeId);
      const type = state.recognitionTypes.find(
        (item) => item.id === recognition.recognitionTypeId,
      );
      return {
        id: recognition.id,
        employeeName: employee?.name ?? "Crew Member",
        title: type?.name ?? "Journey Moment",
        note: recognition.note,
        miles: recognition.miles,
      };
    });

    return [...liveRows, ...seededRows].slice(0, 4);
  }, [moments, state.employees, state.recognitionTypes]);

  const activeCrew = state.employees.filter(
    (employee) => employee.role === "employee" && employee.active !== false,
  ).length;
  const weeklyMiles = state.employees.reduce(
    (total, employee) => total + (employee.role === "employee" ? employee.weeklyMiles : 0),
    0,
  );

  return (
    <>
      <Panel className="bg-journey-black text-journey-white">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <ChapterProgress inverse />
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/leaderboard" icon={Trophy} variant="secondary">
              View Leaderboard
            </LinkButton>
          </div>
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Community Goal"
          value={formatMiles(state.chapter.communityGoalMiles)}
          detail={state.chapter.phrase}
          icon={Sparkles}
        />
        <MetricCard
          label="Active Crew"
          value={`${activeCrew}`}
          detail="employees in Journey"
          icon={Users}
        />
        <MetricCard
          label="Weekly Miles"
          value={formatMiles(weeklyMiles)}
          detail="earned by recognition"
          icon={Trophy}
        />
        <MetricCard
          label="Chapter"
          value={state.chapter.chapterNumber}
          detail={state.chapter.chapterTitle}
          icon={ArrowRight}
        />
      </div>

      <Panel className="mt-5">
        <PanelHeader
          title="Recent Journey Moments"
          eyebrow="Simple community view"
          action={<Sparkles className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="grid gap-3 md:grid-cols-2">
          {recentMoments.map((moment) => (
            <article
              key={moment.id}
              className="rounded-lg border border-journey-line p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black text-journey-black">{moment.employeeName}</p>
                  <p className="mt-1 text-sm font-bold text-journey-red">
                    {moment.title}
                  </p>
                </div>
                <p className="font-black text-journey-red">+{moment.miles}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-journey-steel">{moment.note}</p>
            </article>
          ))}
        </div>
      </Panel>
    </>
  );
}
