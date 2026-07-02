import { AppShell } from "@/components/AppShell";
import { LeadershipExperienceView } from "@/components/leadership/LeadershipExperienceView";

export default function LeadershipDashboardPage() {
  return (
    <AppShell role="manager" title="Leadership Dashboard" eyebrow="Leadership Experience">
      <LeadershipExperienceView view="dashboard" />
    </AppShell>
  );
}

