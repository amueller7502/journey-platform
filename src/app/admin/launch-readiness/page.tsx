import { AppShell } from "@/components/AppShell";
import { LaunchReadinessStudio } from "@/components/admin/LaunchReadinessStudio";

export default function LaunchReadinessPage() {
  return (
    <AppShell role="admin" title="Launch Readiness" eyebrow="Experience Studio">
      <LaunchReadinessStudio />
    </AppShell>
  );
}
