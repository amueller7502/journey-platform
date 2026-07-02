import { AppShell } from "@/components/AppShell";
import { LeadershipExperienceView } from "@/components/leadership/LeadershipExperienceView";

export default function LeadershipRewardsPage() {
  return (
    <AppShell role="manager" title="Leadership Rewards" eyebrow="Leadership Experience">
      <LeadershipExperienceView view="rewards" />
    </AppShell>
  );
}

