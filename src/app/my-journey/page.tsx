"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CalendarCheck, Gift, IdCard, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { FeatureVisible } from "@/components/FeatureVisible";
import { RecognitionCard } from "@/components/dashboard/RecognitionCard";
import { LinkButton } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { recognitions } from "@/lib/data";
import { useJourneyState } from "@/lib/journey-state";
import { formatShortDateTime, formatXp } from "@/lib/utils";

const ACTIVE_ACCOUNT_KEY = "journey-active-account-id";

function levelForXp(xp: number) {
  if (xp >= 1500) {
    return "Platinum";
  }
  if (xp >= 1000) {
    return "Gold";
  }
  if (xp >= 500) {
    return "Silver";
  }
  return "Bronze";
}

export default function MyExperiencePage() {
  const { state } = useJourneyState();
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    const load = () =>
      setAccountId(window.localStorage.getItem(ACTIVE_ACCOUNT_KEY) ?? "");
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const currentEmployee =
    state.employees.find((employee) => employee.id === accountId) ??
    state.employees.find(
      (employee) => employee.role === "employee" && employee.active !== false,
    ) ??
    state.employees[0];
  const currentRedemptions = state.redemptions.filter(
    (redemption) => redemption.employeeId === currentEmployee.id,
  );
  const openRedemptions = currentRedemptions.filter(
    (redemption) =>
      redemption.status === "Requested" ||
      redemption.status === "Approved" ||
      redemption.status === "Pending" ||
      redemption.status === "Ready",
  );
  const nextReward = useMemo(
    () =>
      state.rewards
        .filter(
          (reward) =>
            reward.enabled &&
            !reward.comingSoon &&
            reward.inventoryCount > 0 &&
            reward.milesCost > currentEmployee.miles,
        )
        .sort((a, b) => a.milesCost - b.milesCost)[0] ??
      state.rewards.find((reward) => reward.enabled && !reward.comingSoon),
    [currentEmployee.miles, state.rewards],
  );
  const personalRecognitions = recognitions.filter(
    (recognition) => recognition.employeeId === currentEmployee.id,
  );

  return (
    <AppShell
      role="employee"
      title="My Experience"
      eyebrow={currentEmployee.name}
      actions={<LinkButton href="/rewards" icon={Gift}>Rewards</LinkButton>}
    >
      <div className="grid gap-5 lg:grid-cols-4">
        <MetricCard
          label="Current XP"
          value={formatXp(currentEmployee.miles)}
          detail="Manager-captured XP"
          icon={BadgeCheck}
        />
        <MetricCard
          label="This Week"
          value={formatXp(currentEmployee.weeklyMiles)}
          detail="XP earned this week"
          icon={Sparkles}
        />
        <MetricCard
          label="Level"
          value={levelForXp(currentEmployee.miles)}
          detail="Based on total XP"
          icon={CalendarCheck}
        />
        <MetricCard
          label="Card ID"
          value={currentEmployee.passportId}
          detail="For turned-in Experience Cards"
          icon={IdCard}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel className="cinema-doodle-card">
          <PanelHeader title="Next Reward" eyebrow="Rewards" />
          {nextReward ? (
            <>
              <h2 className="text-2xl font-black text-journey-black">
                {nextReward.name}
              </h2>
              <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
                {nextReward.description}
              </p>
              <div className="mt-6">
                <ProgressBar
                  label={`${formatXp(Math.max(0, nextReward.milesCost - currentEmployee.miles))} XP to go`}
                  value={currentEmployee.miles}
                  max={nextReward.milesCost}
                />
              </div>
            </>
          ) : (
            <p className="text-sm font-bold text-journey-steel">
              Rewards will appear when inventory is enabled.
            </p>
          )}
        </Panel>

        <Panel>
          <PanelHeader title="Reward Requests" eyebrow="Status" />
          <div className="grid gap-3">
            {openRedemptions.length ? (
              openRedemptions.map((redemption) => {
                const reward = state.rewards.find((item) => item.id === redemption.rewardId);
                return (
                  <div
                    key={redemption.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-journey-line p-4"
                  >
                    <div>
                      <p className="font-black text-journey-black">
                        {reward?.name ?? "Reward"}
                      </p>
                      <p className="mt-1 text-sm font-bold text-journey-steel">
                        Requested {formatShortDateTime(redemption.requestedAt)}
                      </p>
                    </div>
                    <span className="rounded-sm bg-journey-mist px-2 py-1 text-xs font-black uppercase text-journey-black">
                      {redemption.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="rounded-lg border border-dashed border-journey-line p-4 text-sm font-bold text-journey-steel">
                No open reward requests yet.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <FeatureVisible featureId="moment_history">
        <Panel className="mt-5">
          <PanelHeader title="Experience Journal" eyebrow="Moment History" />
          <div className="grid gap-4">
            {personalRecognitions.map((recognition) => (
              <RecognitionCard key={recognition.id} recognition={recognition} />
            ))}
          </div>
        </Panel>
      </FeatureVisible>
    </AppShell>
  );
}
