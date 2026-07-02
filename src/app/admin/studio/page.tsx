import { AppShell } from "@/components/AppShell";
import { ExperienceStudioOverview } from "@/components/admin/ExperienceStudioOverview";

export default function ExperienceStudioPage() {
  return (
    <AppShell role="admin" title="Experience Studio" eyebrow="Culture CMS">
      <ExperienceStudioOverview />
    </AppShell>
  );
}
