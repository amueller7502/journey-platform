import { BarChart3, CalendarDays, CheckCircle2, Gift, Goal, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ChapterProgress } from "@/components/dashboard/ChapterProgress";
import { DepartmentProgress } from "@/components/dashboard/DepartmentProgress";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  COMMUNITY_GOAL_MILES,
  chapterStats,
  employeesNotRecognizedThisWeek,
  recognitionOfTheDay,
  getEmployee,
  getRecognitionType,
  launchReadinessChecklist,
} from "@/lib/data";
import { productLanguage } from "@/lib/product-language";
import { daysRemaining, formatXp } from "@/lib/utils";

export default function AdminDashboardPage() {
  const experienceScore = 86;
  const presentationScore = 91;
  const managerLeadershipHealth = 83;
  const inventoryWarnings = 3;

  return (
    <AppShell role="admin" title="Command Center" eyebrow="Admin/GM">
      <div className="grid gap-5 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Panel className="odyssey-frame h-full bg-journey-black text-journey-white">
            <ChapterProgress inverse />
          </Panel>
        </div>
        <MetricCard
          label={productLanguage.experienceScore}
          value={`${experienceScore}`}
          detail="Composite recognition, coverage, presentation"
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
          label={productLanguage.communityGoal}
          value={formatXp(chapterStats.communityMiles)}
          detail={`${formatXp(COMMUNITY_GOAL_MILES - chapterStats.communityMiles)} XP remaining`}
          icon={Users}
        />
        <MetricCard
          label="Presentation Score"
          value={`${presentationScore}`}
          detail="Readiness checks and space standards"
          icon={BarChart3}
        />
        <MetricCard
          label="Pending Rewards"
          value={`${chapterStats.pendingRedemptions}`}
          detail="Needs manager review"
          icon={Gift}
        />
        <MetricCard
          label={productLanguage.leadershipHealth}
          value={`${managerLeadershipHealth}%`}
          detail="Coverage, coaching, handoffs"
          icon={Goal}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <PanelHeader title="Department Progress" eyebrow="Community XP" />
          <DepartmentProgress />
        </Panel>
        <Panel>
          <PanelHeader title="Pace Snapshot" eyebrow="GM View" />
          <div className="grid gap-3">
            {[
              ["Goal pace", "560 XP per day"],
              ["Current pace", `${formatXp(chapterStats.averageDailyMiles)} XP per day`],
              ["Recognition density", "4.6 entries per active crew member"],
              ["Reward liability", "2,190 XP in pending and ready rewards"],
              ["Inventory warnings", `${inventoryWarnings} rewards near threshold`],
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
            {getRecognitionType(recognitionOfTheDay.recognitionTypeId)?.name} +{recognitionOfTheDay.miles} XP
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
