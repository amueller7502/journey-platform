import { BarChart3, CalendarDays, CheckCircle2, Gift, Goal, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ChapterProgress } from "@/components/dashboard/ChapterProgress";
import { DepartmentProgress } from "@/components/dashboard/DepartmentProgress";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  COMMUNITY_GOAL_MILES,
  chapterStats,
  employees,
  employeesNotRecognizedThisWeek,
  enabledRecognitionTypes,
  recognitionOfTheDay,
  getEmployee,
  getRecognitionType,
  launchReadinessChecklist,
} from "@/lib/data";
import { daysRemaining, formatMiles } from "@/lib/utils";

export default function AdminDashboardPage() {
  return (
    <AppShell role="admin" title="Dashboard" eyebrow="Admin/GM">
      <div className="grid gap-5 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Panel className="odyssey-frame h-full bg-journey-black text-journey-white">
            <ChapterProgress inverse />
          </Panel>
        </div>
        <MetricCard
          label="Remaining"
          value={formatMiles(COMMUNITY_GOAL_MILES - chapterStats.communityMiles)}
          detail="Miles to community goal"
          icon={Goal}
        />
        <MetricCard
          label="Days Left"
          value={`${daysRemaining("2026-08-12")}`}
          detail="The Odyssey"
          icon={CalendarDays}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-4">
        <MetricCard
          label="Active Employees"
          value={`${chapterStats.activeEmployees}`}
          detail="Crew profiles"
          icon={Users}
        />
          <MetricCard
          label="Recognition Types"
          value={`${enabledRecognitionTypes.length}`}
          detail="Enabled library items"
          icon={BarChart3}
        />
        <MetricCard
          label="Pending Rewards"
          value={`${chapterStats.pendingRedemptions}`}
          detail="Needs manager review"
          icon={Gift}
        />
        <MetricCard
          label="Average Daily"
          value={formatMiles(chapterStats.averageDailyMiles)}
          detail="Community pace"
          icon={Goal}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <PanelHeader title="Department Progress" eyebrow="Chapter miles" />
          <DepartmentProgress />
        </Panel>
        <Panel>
          <PanelHeader title="Pace Snapshot" eyebrow="GM View" />
          <div className="grid gap-3">
            {[
              ["Goal pace", "560 miles per day"],
              ["Current pace", `${formatMiles(chapterStats.averageDailyMiles)} miles per day`],
              ["Recognition density", "4.6 entries per active crew member"],
              ["Reward liability", "2,190 miles in pending and ready rewards"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-lg border border-journey-line p-4"
              >
                <span className="font-black text-journey-black">{label}</span>
                <span className="text-sm font-bold text-journey-steel">{value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel>
          <PanelHeader title="Moment of the Day" eyebrow="Spotlight" />
          <p className="text-lg font-black text-journey-black">
            {getEmployee(recognitionOfTheDay.employeeId)?.name}
          </p>
          <p className="mt-2 text-sm font-bold text-journey-red">
            {getRecognitionType(recognitionOfTheDay.recognitionTypeId)?.name} +{recognitionOfTheDay.miles} Miles
          </p>
          <p className="mt-3 border-l-4 border-journey-red pl-3 text-sm leading-6 text-journey-steel">
            {recognitionOfTheDay.note}
          </p>
        </Panel>
        <Panel>
          <PanelHeader title="Employees Not Recognized This Week" eyebrow="GM follow-up" />
          <div className="grid gap-3">
            {employeesNotRecognizedThisWeek.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-journey-line p-4"
              >
                <span className="font-black text-journey-black">{employee.name}</span>
                <span className="text-sm font-bold text-journey-steel">{employee.title}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-5">
        <PanelHeader
          title="Launch Readiness Checklist"
          eyebrow="July 9 Management Preview"
          action={<CheckCircle2 className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {launchReadinessChecklist.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-journey-line bg-journey-white p-4"
            >
              <p className="font-black text-journey-black">{item.label}</p>
              <p className="mt-2 text-sm font-bold text-journey-red">{item.status}</p>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
