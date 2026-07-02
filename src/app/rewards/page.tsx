import { Gift } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TradingPostClient } from "@/components/dashboard/TradingPostClient";
import { LinkButton } from "@/components/ui/Button";

export default function RewardsPage() {
  return (
    <AppShell
      role="employee"
      title="Rewards"
      eyebrow="Employee Experience"
      actions={<LinkButton href="/my-journey" icon={Gift}>My Experience</LinkButton>}
    >
      <TradingPostClient />
    </AppShell>
  );
}
