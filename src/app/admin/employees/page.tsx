import { UserPlus, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { employees, getDepartment } from "@/lib/data";
import { formatMiles } from "@/lib/utils";

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
          <PanelHeader title="Employee Roster" eyebrow="Chapter One" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Department</th>
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Miles</th>
                  <th className="py-3 pr-4">Weekly</th>
                  <th className="py-3 pr-4">Streak</th>
                </tr>
              </thead>
              <tbody>
                {crew.map((employee) => (
                  <tr key={employee.id} className="border-b border-journey-line">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-journey-black text-xs font-black text-journey-white">
                          {employee.initials}
                        </div>
                        <span className="font-black text-journey-black">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm font-bold text-journey-steel">
                      {getDepartment(employee.department)?.name}
                    </td>
                    <td className="py-4 pr-4 text-sm font-bold text-journey-steel">
                      {employee.title}
                    </td>
                    <td className="py-4 pr-4 font-black text-journey-black">
                      {formatMiles(employee.miles)}
                    </td>
                    <td className="py-4 pr-4 text-sm font-bold text-journey-steel">
                      {employee.weeklyMiles}
                    </td>
                    <td className="py-4 pr-4 text-sm font-bold text-journey-steel">
                      {employee.reliabilityStreak} weeks
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
