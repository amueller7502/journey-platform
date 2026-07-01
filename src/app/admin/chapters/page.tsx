import { CalendarDays, Clapperboard, Goal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ChapterProgress } from "@/components/dashboard/ChapterProgress";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { COMMUNITY_GOAL_MILES, chapter } from "@/lib/data";
import { daysRemaining, formatDate, formatMiles } from "@/lib/utils";

export default function ChapterManagementPage() {
  return (
    <AppShell role="admin" title="Chapter Management" eyebrow="The Journey">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel className="bg-journey-black text-journey-white">
          <ChapterProgress inverse />
        </Panel>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <MetricCard
            label="Community Goal"
            value={formatMiles(COMMUNITY_GOAL_MILES)}
            detail="Miles"
            icon={Goal}
          />
          <MetricCard
            label="Days Left"
            value={`${daysRemaining(chapter.endDate)}`}
            detail="Chapter clock"
            icon={CalendarDays}
          />
        </div>
      </div>

      <Panel className="mt-5">
        <PanelHeader title="Current Chapter" eyebrow={chapter.chapterNumber} />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Name", chapter.name],
            ["Subtitle", chapter.subtitle],
            ["Dates", `${formatDate(chapter.startDate)} - ${formatDate(chapter.endDate)}`],
            ["Community Goal", `${formatMiles(chapter.communityGoalMiles)} Miles`],
            ["Visual Tagline", chapter.visualTagline],
            ["Theme Note", chapter.themeNote],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-journey-line p-4">
              <p className="text-xs font-black uppercase text-journey-red">{label}</p>
              <p className="mt-2 text-xl font-black text-journey-black">{value}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-5">
        <PanelHeader
          title="Next Chapter Draft"
          eyebrow="Planning"
          action={<Clapperboard className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="rounded-lg border border-dashed border-journey-line p-5">
          <p className="font-black text-journey-black">Chapter Two</p>
          <p className="mt-2 text-sm font-bold text-journey-steel">
            Draft chapter setup area for the next incentive period, reusing
            recognition types, reward catalogs, Journey Card IDs, and TV display settings.
          </p>
        </div>
      </Panel>
    </AppShell>
  );
}
