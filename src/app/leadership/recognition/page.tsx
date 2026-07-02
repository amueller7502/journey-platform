import { AppShell } from "@/components/AppShell";
import { LeadershipExperienceView } from "@/components/leadership/LeadershipExperienceView";

export default function LeadershipRecognitionPage() {
  return (
    <AppShell role="manager" title="Leadership Recognition" eyebrow="Leadership Experience">
      <LeadershipExperienceView view="recognition" />
    </AppShell>
  );
}

