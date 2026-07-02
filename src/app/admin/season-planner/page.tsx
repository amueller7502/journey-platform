import { AppShell } from "@/components/AppShell";
import { SeasonPlannerStudio } from "@/components/admin/SeasonPlannerStudio";

export default function SeasonPlannerPage() {
  return (
    <AppShell role="admin" title="Season Planner" eyebrow="Experience Studio">
      <SeasonPlannerStudio />
    </AppShell>
  );
}
