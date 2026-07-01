import { UserPlus, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmployeeRosterEditor } from "@/components/admin/EmployeeRosterEditor";
import { LinkButton } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { employees } from "@/lib/data";

export default function EmployeesPage() {
  const crew = employees.filter((employee) => employee.role === "employee");

  return (
    <AppShell
      role="admin"
      title="Employees"
      eyebrow="Roster"
      actions={<LinkButton href="/admin/settings" icon={UserPlus}>Role Settings</LinkButton>}
    >
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <MetricCard
          label="Crew"
          value={`${crew.length}`}
          detail="Employee profiles"
          icon={Users}
        />
        <Panel>
          <PanelHeader title="Employee Roster" eyebrow="Configurable" />
          <EmployeeRosterEditor />
        </Panel>
      </div>
    </AppShell>
  );
}
