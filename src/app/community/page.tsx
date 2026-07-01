import { BarChart3, Goal, Sparkles, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ChapterProgress } from "@/components/dashboard/ChapterProgress";
import { DepartmentProgress } from "@/components/dashboard/DepartmentProgress";
import { RecognitionCard } from "@/components/dashboard/RecognitionCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  COMMUNITY_GOAL_MILES,
  chapter,
  chapterStats,
  employees,
  recognitions,
} from "@/lib/data";
import { formatMiles } from "@/lib/utils";

export default function CommunityPage() {
  return (
    <AppShell role="employee" title="Community" eyebrow={chapter.subtitle}>
      <Panel className="odyssey-frame mb-5 bg-journey-black text-journey-white projection-sweep">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              {chapter.themeNote}
            </p>
            <h2 className="mt-2 text-3xl font-black">{chapter.phrase}</h2>
          </div>
          <p className="text-xl font-black text-journey-white">15,700 Miles</p>
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Panel className="odyssey-frame h-full bg-journey-black text-journey-white">
            <ChapterProgress inverse />
          </Panel>
        </div>
        <MetricCard
          label="Goal"
          value={formatMiles(COMMUNITY_GOAL_MILES)}
          detail="Community miles"
          icon={Goal}
        />
        <MetricCard
          label="Active Crew"
          value={`${employees.filter((employee) => employee.role === "employee").length}`}
          detail="Employees recognized"
          icon={Users}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <PanelHeader title="Department Progress" eyebrow="Miles" />
          <DepartmentProgress />
        </Panel>
        <Panel>
          <PanelHeader
            title="Recognition Wall"
            eyebrow={`${formatMiles(chapterStats.todayMiles)} miles today`}
            action={<Sparkles className="h-5 w-5 text-journey-red" aria-hidden="true" />}
          />
          <div className="grid gap-4">
            {recognitions.slice(0, 5).map((recognition) => (
              <RecognitionCard key={recognition.id} recognition={recognition} />
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
