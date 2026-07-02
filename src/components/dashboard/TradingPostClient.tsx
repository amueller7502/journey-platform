"use client";

import { useEffect, useState } from "react";
import { Gift, PackageCheck } from "lucide-react";
import { RewardCard } from "@/components/dashboard/RewardCard";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { useJourneyState } from "@/lib/journey-state";
import { formatShortDateTime } from "@/lib/utils";

export function TradingPostClient() {
  const { state, updateState } = useJourneyState();
  const [accountId, setAccountId] = useState("");
  const [message, setMessage] = useState("");

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

  function requestReward(rewardId: string) {
    const reward = state.rewards.find((item) => item.id === rewardId);
    if (!currentEmployee || !reward) {
      return;
    }

    if (currentEmployee.miles < reward.milesCost) {
      setMessage("Not enough Miles for that reward yet.");
      return;
    }

    if (reward.inventoryCount <= 0) {
      setMessage("That reward is currently out of stock.");
      return;
    }

    updateState((current) => ({
      ...current,
      redemptions: [
        {
          id: `redemption-${currentEmployee.id}-${reward.id}-${Date.now()}`,
          employeeId: currentEmployee.id,
          rewardId: reward.id,
          status: "Requested",
          requestedAt: new Date().toISOString(),
        },
        ...current.redemptions,
      ],
    }));
    setMessage(`${reward.name} requested. A manager can approve it from Pending Rewards.`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
      <div className="grid gap-5">
        <MetricCard
          label="Available Miles"
          value={`${currentEmployee?.miles ?? 0}`}
          detail="Redeemable chapter balance"
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
                No redemptions for this employee yet.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="Reward Catalog"
          eyebrow="Chapter One"
          action={<PackageCheck className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {state.rewards
            .filter((reward) => reward.enabled)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((reward) => {
              const alreadyOpen = openRedemptions.some(
                (redemption) => redemption.rewardId === reward.id,
              );
              const canAfford = (currentEmployee?.miles ?? 0) >= reward.milesCost;
              const inStock = reward.inventoryCount > 0;

              return (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  footerNote={
                    alreadyOpen
                      ? "Request pending"
                      : !inStock
                        ? "Out of stock"
                        : !canAfford
                          ? "Keep earning"
                          : undefined
                  }
                  action={
                    <Button
                      type="button"
                      className="w-full"
                      disabled={alreadyOpen || !canAfford || !inStock}
                      onClick={() => requestReward(reward.id)}
                    >
                      {alreadyOpen ? "Requested" : "Request Reward"}
                    </Button>
                  }
                />
              );
            })}
        </div>
      </Panel>
    </div>
  );
}
