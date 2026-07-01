import { AppShell } from "@/components/AppShell";
import { TradingPostClient } from "@/components/dashboard/TradingPostClient";

export default function TradingPostPage() {
  return (
    <AppShell role="employee" title="Trading Post" eyebrow="Rewards">
      <TradingPostClient />
    </AppShell>
  );
}
