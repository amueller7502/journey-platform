"use client";

import { Gift, PackageCheck } from "lucide-react";
import { RewardCard } from "@/components/dashboard/RewardCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { redemptions } from "@/lib/data";
import { useJourneyState } from "@/lib/journey-state";
import { formatShortDateTime } from "@/lib/utils";

export function TradingPostClient() {
  const { state } = useJourneyState();
  const currentEmployee =
    state.employees.find(
      (employee) => employee.role === "employee" && employee.active !== false,
    ) ?? state.employees[0];
  const currentRedemptions = redemptions.filter(
    (redemption) => redemption.employeeId === currentEmployee?.id,
  );

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
            .map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
        </div>
      </Panel>
    </div>
  );
}
