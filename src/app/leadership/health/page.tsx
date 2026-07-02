import { AppShell } from "@/components/AppShell";
import { LeadershipExperienceView } from "@/components/leadership/LeadershipExperienceView";

export default function LeadershipHealthPage() {
  return (
    <AppShell role="manager" title="Leadership Health" eyebrow="Leadership Experience">
      <LeadershipExperienceView view="health" />
    </AppShell>
  );
}

