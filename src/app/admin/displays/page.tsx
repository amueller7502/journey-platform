import { AppShell } from "@/components/AppShell";
import { DisplaysStudio } from "@/components/admin/DisplaysStudio";

export default function DisplaysPage() {
  return (
    <AppShell role="admin" title="Displays" eyebrow="Experience Studio">
      <DisplaysStudio />
    </AppShell>
  );
}
