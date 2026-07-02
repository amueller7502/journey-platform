"use client";

import { useEffect, useState } from "react";
import { Gift, PackageCheck } from "lucide-react";
import { RewardCard } from "@/components/dashboard/RewardCard";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { isArchived } from "@/lib/archive";
import {
  replaceJourneyStateFromServer,
  useJourneyState,
  type JourneyOperatingState,
} from "@/lib/journey-state";
import { formatShortDateTime, formatXp } from "@/lib/utils";

const liteRewardIds = new Set([
  "reward-c-cash-5",
  "reward-c-cash-10",
  "reward-c-cash-20",
  "reward-movie-ticket",
  "reward-imax-upgrade",
]);

export function TradingPostClient() {
  const { state, updateState } = useJourneyState();
  const [accountId, setAccountId] = useState("");
  const [message, setMessage] = useState("");
  const [requestingRewardId, setRequestingRewardId] = useState("");

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
    ) ?? state.employees[0];
  const currentRedemptions = state.redemptions.filter(
    (redemption) => redemption.employeeId === currentEmployee?.id,
  );
  const openRedemptions = currentRedemptions.filter(
    (redemption) =>
      redemption.status === "Requested" ||
      redemption.status === "Approved" ||
      redemption.status === "Pending" ||
      redemption.status === "Ready",
  );

  async function requestReward(rewardId: string) {
    const reward = state.rewards.find((item) => item.id === rewardId);
    if (!currentEmployee || !reward) {
      return;
    }

    if (currentEmployee.miles < reward.milesCost) {
      setMessage("Not enough XP for that reward yet.");
      return;
    }

    if (reward.comingSoon) {
      setMessage("That reward is coming soon.");
      return;
    }

    if (reward.inventoryCount <= 0) {
      setMessage("That reward is currently out of stock.");
      return;
    }

    setRequestingRewardId(rewardId);
    setMessage("");
    const requestedAt = new Date().toISOString();
    const fallbackRedemption = {
      id: `redemption-${currentEmployee.id}-${reward.id}-${requestedAt.replace(/[^0-9]/g, "")}`,
      employeeId: currentEmployee.id,
      rewardId: reward.id,
      status: "Requested" as const,
      requestedAt,
    };

    try {
      const response = await fetch("/api/experience/reward-redemptions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          employeeId: currentEmployee.id,
          rewardId: reward.id,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        mode?: "local" | "supabase";
        state?: JourneyOperatingState;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Reward request could not be submitted.");
      }

      if (payload.mode === "supabase" && payload.state) {
        replaceJourneyStateFromServer(payload.state);
      } else {
        updateState((current) => ({
          ...current,
          redemptions: [fallbackRedemption, ...current.redemptions],
        }));
      }
      setMessage(`${reward.name} requested. A manager can approve it from Rewards Approvals.`);
    } catch (error) {
      updateState((current) => ({
        ...current,
        redemptions: [fallbackRedemption, ...current.redemptions],
      }));
      setMessage(
        error instanceof Error
          ? `${error.message} Saved locally as fallback.`
          : "Saved locally as fallback.",
      );
    } finally {
      setRequestingRewardId("");
    }
  }

  const enabledRewards = state.rewards
    .filter((reward) => reward.enabled && !isArchived(reward) && liteRewardIds.has(reward.id))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const collections = [
    "Featured Rewards",
    "Everyday Rewards",
  ];
  const collectionCopy: Record<string, string> = {
    "Featured Rewards": "A few rewards worth noticing first.",
    "Everyday Rewards": "C Cash and simple wins for great shifts.",
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
      <div className="grid gap-5">
        <MetricCard
          label="Available XP"
          value={`${formatXp(currentEmployee?.miles ?? 0)}`}
          detail="Redeemable Employee Experience balance"
          icon={Gift}
        />
        <Panel>
          <PanelHeader title="My Redemptions" eyebrow="Status" />
          {message ? (
            <p className="mb-3 rounded-md border border-journey-line bg-journey-mist p-3 text-sm font-black text-journey-red">
              {message}
            </p>
          ) : null}
          <div className="grid gap-3">
            {currentRedemptions.length ? (
              currentRedemptions.map((redemption) => {
                const reward = state.rewards.find((item) => item.id === redemption.rewardId);
                return (
                  <div
                    key={redemption.id}
                    className="rounded-lg border border-journey-line p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-journey-black">{reward?.name}</h3>
                        <p className="mt-1 text-sm text-journey-steel">
                          {formatShortDateTime(redemption.requestedAt)}
                        </p>
                      </div>
                      <span className="rounded-sm bg-journey-mist px-2 py-1 text-xs font-black uppercase text-journey-black">
                        {redemption.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm font-bold text-journey-steel">
                No reward requests for this employee yet.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="Rewards"
          eyebrow="Curated Employee Experience"
          action={<PackageCheck className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="cinema-doodle-card mb-5 rounded-lg border border-journey-line bg-journey-mist p-4">
          <p className="text-xs font-black uppercase text-journey-red">
            More Than A Movie energy
          </p>
          <h3 className="mt-1 text-xl font-black text-journey-black">
            Pick a reward you actually want.
          </h3>
          <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
            C Cash handles quick wins. Tickets and IMAX upgrades make the next
            movie night feel a little more special.
          </p>
        </div>
        <div className="grid gap-6">
          {collections.map((collection) => {
            const collectionRewards = enabledRewards.filter(
              (reward) => (reward.collection ?? "Everyday Rewards") === collection,
            );

            if (!collectionRewards.length) {
              return null;
            }

            return (
              <section key={collection}>
                <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-xs font-black uppercase text-journey-red">
                      {collection}
                    </p>
                    <h3 className="text-xl font-black text-journey-black">
                      {collection === "Coming Soon"
                        ? "Preview what is next"
                        : "Choose a reward"}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-journey-steel">
                      {collectionCopy[collection]}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {collectionRewards.map((reward) => {
                    const alreadyOpen = openRedemptions.some(
                      (redemption) => redemption.rewardId === reward.id,
                    );
                    const canAfford = (currentEmployee?.miles ?? 0) >= reward.milesCost;
                    const inStock = reward.inventoryCount > 0;
                    const comingSoon = Boolean(reward.comingSoon);

                    return (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                        canAfford={canAfford}
                        footerNote={
                          alreadyOpen
                            ? "Request pending"
                            : comingSoon
                              ? "Coming soon"
                              : !inStock
                                ? "Out of stock"
                                : !canAfford
                                  ? "Keep earning XP"
                                  : undefined
                        }
                        action={
                          <Button
                            type="button"
                            className="w-full"
                            disabled={
                              requestingRewardId === reward.id ||
                              alreadyOpen ||
                              !canAfford ||
                              !inStock ||
                              comingSoon
                            }
                            onClick={() => void requestReward(reward.id)}
                          >
                            {requestingRewardId === reward.id
                              ? "Requesting..."
                              : alreadyOpen
                                ? "Requested"
                                : "Request Reward"}
                          </Button>
                        }
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
