import { AppShell } from "@/components/AppShell";
import { StandardsStudio } from "@/components/admin/StandardsStudio";

export default function StandardsPage() {
  return (
    <AppShell role="admin" title="Standards" eyebrow="Experience Studio">
      <StandardsStudio />
    </AppShell>
  );
}
