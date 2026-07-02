import { AppShell } from "@/components/AppShell";
import { LeadershipExperienceView } from "@/components/leadership/LeadershipExperienceView";

export default function CoachingInsightsPage() {
  return (
    <AppShell role="manager" title="Coaching Insights" eyebrow="Leadership Experience">
      <LeadershipExperienceView view="coaching" />
    </AppShell>
  );
}

