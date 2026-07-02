import { AppShell } from "@/components/AppShell";
import { SeasonPlannerStudio } from "@/components/admin/SeasonPlannerStudio";

export default function SeasonsPage() {
  return (
    <AppShell role="admin" title="Seasons" eyebrow="Experience Studio">
      <SeasonPlannerStudio />
    </AppShell>
  );
}
