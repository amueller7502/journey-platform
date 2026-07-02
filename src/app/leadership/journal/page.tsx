import { AppShell } from "@/components/AppShell";
import { LeadershipExperienceView } from "@/components/leadership/LeadershipExperienceView";

export default function LeadershipJournalPage() {
  return (
    <AppShell role="manager" title="Leadership Journal" eyebrow="Leadership Experience">
      <LeadershipExperienceView view="journal" />
    </AppShell>
  );
}

