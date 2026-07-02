import { AppShell } from "@/components/AppShell";
import { LeadershipExperienceView } from "@/components/leadership/LeadershipExperienceView";

export default function LeadershipAchievementsPage() {
  return (
    <AppShell role="manager" title="Leadership Achievements" eyebrow="Leadership Experience">
      <LeadershipExperienceView view="achievements" />
    </AppShell>
  );
}

