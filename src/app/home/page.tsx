import { Award, CalendarCheck, Coins, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ChapterProgress } from "@/components/dashboard/ChapterProgress";
import { DepartmentProgress } from "@/components/dashboard/DepartmentProgress";
import { RecentMomentsFeed } from "@/components/dashboard/RecentMomentsFeed";
import { StandardGrid } from "@/components/dashboard/StandardGrid";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { LinkButton } from "@/components/ui/Button";
import { chapter, chapterStats, employees, recognitionOfTheDay, recognitions } from "@/lib/data";
import { formatMiles } from "@/lib/utils";

const currentEmployee = employees[0];

export default function EmployeeHomePage() {
  return (
    <AppShell
      role="employee"
      title="Home"
      eyebrow={chapter.subtitle}
      actions={<LinkButton href="/trading-post" icon={Coins}>Trading Post</LinkButton>}
    >
      <Panel className="odyssey-frame mb-5 bg-journey-black text-journey-white projection-sweep">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              {chapter.themeNote}
            </p>
            <h2 className="mt-2 text-3xl font-black">{chapter.phrase}</h2>
            <p className="mt-2 max-w-2xl text-sm font-bold text-journey-line">
              Journey makes recognizing great work easier than overlooking it.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-black uppercase text-journey-line">Community Goal</p>
            <p className="mt-1 text-3xl font-black text-journey-white">15,700 Miles</p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel className="odyssey-frame bg-journey-black text-journey-white">
          <ChapterProgress inverse />
        </Panel>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <MetricCard
            label="My Miles"
            value={formatMiles(currentEmployee.miles)}
            detail={`${currentEmployee.weeklyMiles} Miles this week`}
            icon={Award}
          />
          <MetricCard
            label="Today"
            value={`+${chapterStats.todayMiles}`}
            detail="Community Miles recognized"
            icon={Sparkles}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <PanelHeader title="Department Progress" eyebrow="Community" />
          <DepartmentProgress />
        </Panel>
        <Panel>
          <PanelHeader title="Recent Journey Moments" eyebrow="Feed" />
          <RecentMomentsFeed initialRecognitions={recognitions} />
        </Panel>
      </div>

      <Panel className="mt-5">
        <PanelHeader title="Moment of the Day" eyebrow="Chapter One" />
        <p className="text-lg font-black text-journey-black">
          {recognitionOfTheDay.note}
        </p>
      </Panel>

      <div className="mt-5">
        <StandardGrid />
      </div>
    </AppShell>
  );
}
