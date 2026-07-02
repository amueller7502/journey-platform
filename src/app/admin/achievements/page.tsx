import { AppShell } from "@/components/AppShell";
import { AchievementsStudio } from "@/components/admin/AchievementsStudio";

export default function AchievementsPage() {
  return (
    <AppShell role="admin" title="Achievements" eyebrow="Experience Studio">
      <AchievementsStudio />
    </AppShell>
  );
}
