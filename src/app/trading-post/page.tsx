import { Gift, PackageCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RewardCard } from "@/components/dashboard/RewardCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { employees, getReward, redemptions, rewards } from "@/lib/data";
import { formatShortDateTime } from "@/lib/utils";

const currentEmployee = employees[0];
const currentRedemptions = redemptions.filter(
  (redemption) => redemption.employeeId === currentEmployee.id,
);

export default function TradingPostPage() {
  return (
    <AppShell role="employee" title="Trading Post" eyebrow="Rewards">
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="grid gap-5">
          <MetricCard
            label="Available Miles"
            value={`${currentEmployee.miles}`}
            detail="Redeemable chapter balance"
            icon={Gift}
          />
          <Panel>
            <PanelHeader title="My Redemptions" eyebrow="Status" />
            <div className="grid gap-3">
              {currentRedemptions.map((redemption) => {
                const reward = getReward(redemption.rewardId);
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
              })}
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
            {rewards.filter((reward) => reward.enabled).map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
