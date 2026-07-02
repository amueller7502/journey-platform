"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, CalendarClock, Film, Gift, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { FeatureVisible } from "@/components/FeatureVisible";
import { ChapterProgress } from "@/components/dashboard/ChapterProgress";
import { RecentMomentsFeed } from "@/components/dashboard/RecentMomentsFeed";
import { LinkButton } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { chapter, recognitionOfTheDay, recognitions } from "@/lib/data";
import { useJourneyState } from "@/lib/journey-state";
import { productLanguage } from "@/lib/product-language";
import { daysRemaining, formatXp } from "@/lib/utils";

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

export default function EmployeeHomePage() {
  const { state } = useJourneyState();
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    const load = () =>
      setAccountId(window.localStorage.getItem("journey-active-account-id") ?? "");
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
  const primaryFocus =
    state.experienceEvents.find(
      (event) => event.enabled && event.type === "Today's Focus",
    ) ?? state.experienceEvents.find((event) => event.enabled);
  const spotlightEmployee = state.employees.find(
    (employee) => employee.id === recognitionOfTheDay.employeeId,
  );
  const spotlightType = state.recognitionTypes.find(
    (type) => type.id === recognitionOfTheDay.recognitionTypeId,
  );
  const upcomingRewards = useMemo(
    () =>
      state.rewards
        .filter(
          (reward) =>
            reward.enabled &&
            !reward.comingSoon &&
            reward.inventoryCount > 0 &&
            reward.milesCost >= (currentEmployee?.miles ?? 0),
        )
        .slice()
        .sort((a, b) => a.milesCost - b.milesCost)
        .slice(0, 3),
    [currentEmployee?.miles, state.rewards],
  );
  const nextReward = upcomingRewards[0] ?? state.rewards.find((reward) => reward.enabled);
  const xpToNextReward = Math.max(0, (nextReward?.milesCost ?? 0) - (currentEmployee?.miles ?? 0));

  return (
    <AppShell
      role="employee"
      title="Today"
      eyebrow={productLanguage.employeeExperience}
      actions={<LinkButton href="/rewards" icon={Gift}>Rewards</LinkButton>}
    >
      <Panel className="odyssey-frame mb-5 bg-journey-black text-journey-white projection-sweep">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr] xl:items-end">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              {productLanguage.seasonLabel} / {productLanguage.seasonTitle}
            </p>
            <h2 className="mt-2 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
              {productLanguage.productName}
            </h2>
            <p className="mt-4 max-w-3xl text-xl font-black text-journey-white">
              {productLanguage.campaignPhrase}
            </p>
            <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-journey-line">
              Recognizing the people who create extraordinary movie experiences at
              Celebration Cinema North.
            </p>
          </div>
          <div className="rounded-lg border border-journey-steel bg-journey-coal p-5">
            <p className="text-xs font-black uppercase text-journey-red">
              {productLanguage.communityGoal}
            </p>
            <p className="mt-2 text-4xl font-black text-journey-white">
              {formatXp(state.chapter.communityGoalMiles)} XP
            </p>
            <p className="mt-2 text-sm font-bold text-journey-line">
              {daysRemaining(state.chapter.endDate)} days remaining
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          label="Current XP"
          value={formatXp(currentEmployee?.miles ?? 0)}
          detail={`${formatXp(currentEmployee?.weeklyMiles ?? 0)} XP this week`}
          icon={Award}
        />
        <MetricCard
          label="Current Level"
          value={levelForXp(currentEmployee?.miles ?? 0)}
          detail="Based on recognized Experience Moments"
          icon={Sparkles}
        />
        <MetricCard
          label="Countdown"
          value={`${daysRemaining(state.chapter.endDate)} days`}
          detail={`${state.chapter.chapterNumber}: ${state.chapter.chapterTitle}`}
          icon={CalendarClock}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel>
          <PanelHeader title="Today's Focus" eyebrow="Manager-configured" />
          {primaryFocus ? (
            <div>
              <p className="text-2xl font-black text-journey-black">
                {primaryFocus.title}
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-journey-steel">
                {primaryFocus.banner}
              </p>
              <p className="mt-4 rounded-md bg-journey-mist p-3 text-sm font-black text-journey-black">
                {primaryFocus.xpModifier}x XP modifier where eligible
              </p>
            </div>
          ) : (
            <p className="text-sm font-bold text-journey-steel">
              No focus is active right now.
            </p>
          )}
        </Panel>
        <Panel>
          <PanelHeader title="Recognition Spotlight" eyebrow="Moment that mattered" />
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-journey-black text-journey-white">
              <Film className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-black text-journey-black">
                {spotlightEmployee?.name ?? "Crew Member"}
              </p>
              <p className="mt-1 text-sm font-black text-journey-red">
                {spotlightType?.name} +{recognitionOfTheDay.miles} XP
              </p>
              <p className="mt-3 text-sm leading-6 text-journey-steel">
                {recognitionOfTheDay.note}
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <Panel className="odyssey-frame bg-journey-black text-journey-white">
          <ChapterProgress inverse />
        </Panel>
        <Panel>
          <PanelHeader title="Upcoming Rewards" eyebrow="What your XP can unlock" />
          {nextReward ? (
            <div>
              <p className="text-xl font-black text-journey-black">{nextReward.name}</p>
              <p className="mt-2 text-sm leading-6 text-journey-steel">
                {nextReward.description}
              </p>
              <div className="mt-5">
                <ProgressBar
                  label={
                    xpToNextReward
                      ? `${formatXp(xpToNextReward)} XP to go`
                      : "Enough XP to request"
                  }
                  value={currentEmployee?.miles ?? 0}
                  max={nextReward.milesCost}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm font-bold text-journey-steel">
              Rewards will appear here when inventory is enabled.
            </p>
          )}
        </Panel>
      </div>

      <FeatureVisible featureId="moment_history">
        <Panel className="mt-5">
          <PanelHeader title="Recent Experience Moments" eyebrow="Experience Journal" />
          <RecentMomentsFeed initialRecognitions={recognitions} />
        </Panel>
      </FeatureVisible>
    </AppShell>
  );
}
