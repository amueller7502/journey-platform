import { AppShell } from "@/components/AppShell";
import { ExperienceEventsManager } from "@/components/admin/ExperienceEventsManager";

export default function AdminExperienceEventsPage() {
  return (
    <AppShell role="admin" title="Experience Events" eyebrow="Experience Studio">
      <ExperienceEventsManager />
    </AppShell>
  );
}
