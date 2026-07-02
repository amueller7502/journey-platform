import { AppShell } from "@/components/AppShell";
import { LeadershipStudio } from "@/components/admin/LeadershipStudio";

export default function LeadershipStudioPage() {
  return (
    <AppShell role="admin" title="Leadership" eyebrow="Experience Studio">
      <LeadershipStudio />
    </AppShell>
  );
}
