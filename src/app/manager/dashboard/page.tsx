import { AppShell } from "@/components/AppShell";
import { ManagerShiftDashboard } from "@/components/manager/ManagerShiftDashboard";

export default function ManagerDashboardPage() {
  return (
    <AppShell role="manager" title="Shift Dashboard" eyebrow="Daily operations">
      <ManagerShiftDashboard />
    </AppShell>
  );
}
