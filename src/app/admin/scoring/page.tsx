import { AppShell } from "@/components/AppShell";
import { ScoringStudio } from "@/components/admin/ScoringStudio";

export default function ScoringPage() {
  return (
    <AppShell role="admin" title="Scoring" eyebrow="Experience Studio">
      <ScoringStudio />
    </AppShell>
  );
}
