import { Gift, Package, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RewardInventoryEditor } from "@/components/admin/RewardInventoryEditor";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { rewards } from "@/lib/data";

export default function RewardsPage() {
  const lowInventory = rewards.filter(
    (reward) => reward.enabled && reward.inventoryCount <= 6,
  ).length;

  return (
    <AppShell role="admin" title="Rewards Builder" eyebrow="Experience Builder">
      <div className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          label="Rewards"
          value={`${rewards.length}`}
          detail="Available catalog items"
          icon={Gift}
        />
        <MetricCard
          label="Low Stock"
          value={`${lowInventory}`}
          detail="Inventory watch"
          icon={TriangleAlert}
        />
        <MetricCard
          label="Total Units"
          value={`${rewards.reduce((total, reward) => total + reward.inventoryCount, 0)}`}
          detail="Current stock"
          icon={Package}
        />
      </div>

      <Panel className="mt-5">
        <PanelHeader title="Lite Rewards Catalog" eyebrow="Visual builder" />
        <RewardInventoryEditor initialRewards={rewards} />
      </Panel>
    </AppShell>
  );
}
