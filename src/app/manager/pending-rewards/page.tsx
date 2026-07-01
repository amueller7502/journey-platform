import { Gift, PackageCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PendingRewardQueue } from "@/components/forms/PendingRewardQueue";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { chapterStats, redemptions } from "@/lib/data";

export default function PendingRewardsPage() {
  return (
    <AppShell role="manager" title="Pending Reward Redemptions" eyebrow="Approvals">
      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <Panel>
          <PanelHeader title="Redemption Queue" eyebrow="Manager review" />
          <PendingRewardQueue />
        </Panel>
        <div className="grid gap-5">
          <MetricCard
            label="Pending"
            value={`${chapterStats.pendingRedemptions}`}
            detail="Awaiting review"
            icon={Gift}
          />
          <MetricCard
            label="Total"
            value={`${redemptions.length}`}
            detail="Open requests"
            icon={PackageCheck}
          />
        </div>
      </div>
    </AppShell>
  );
}
