import { BadgeCheck, CalendarCheck, Clock, Gift } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RecognitionCard } from "@/components/dashboard/RecognitionCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { employees, recognitions, rewards } from "@/lib/data";
import { formatXp } from "@/lib/utils";

const currentEmployee = employees[0];
const personalRecognitions = recognitions.filter(
  (recognition) => recognition.employeeId === currentEmployee.id,
);
const nextReward =
  rewards
    .filter((reward) => reward.enabled && !reward.comingSoon)
    .sort((a, b) => a.milesCost - b.milesCost)
    .find((reward) => reward.milesCost > currentEmployee.miles) ??
  rewards.find((reward) => reward.enabled)!;

export default function MyJourneyPage() {
  return (
    <AppShell role="employee" title="My Experience" eyebrow={currentEmployee.name}>
      <div className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          label="Current XP"
          value={formatXp(currentEmployee.miles)}
          detail="Manager-captured XP"
          icon={BadgeCheck}
        />
        <MetricCard
          label="Reliability Streak"
          value={`${currentEmployee.reliabilityStreak} weeks`}
          detail="Attendance and punctuality"
          icon={CalendarCheck}
        />
        <MetricCard
          label="Shift Focus"
          value={currentEmployee.shift}
          detail="Current schedule pattern"
          icon={Clock}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <PanelHeader title="Next Reward" eyebrow="Rewards" />
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-journey-black text-journey-white">
              <Gift className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-black text-journey-black">{nextReward.name}</h2>
              <p className="mt-2 text-sm leading-6 text-journey-steel">
                {nextReward.description}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <ProgressBar
              label={`${formatXp(Math.max(0, nextReward.milesCost - currentEmployee.miles))} XP to go`}
              value={currentEmployee.miles}
              max={nextReward.milesCost}
            />
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Experience Journal" eyebrow="This Season" />
          <div className="grid gap-4">
            {personalRecognitions.map((recognition) => (
              <RecognitionCard key={recognition.id} recognition={recognition} />
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
