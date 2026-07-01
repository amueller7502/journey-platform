import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { PassportEntryForm } from "@/components/forms/PassportEntryForm";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { getDepartment, getEmployeeByPassport } from "@/lib/data";

export default async function PassportEntryPage({
  params,
}: {
  params: Promise<{ passport_id: string }>;
}) {
  const { passport_id } = await params;
  const employee = getEmployeeByPassport(passport_id);

  if (!employee) {
    notFound();
  }

  const department = getDepartment(employee.department);

  return (
    <AppShell role="manager" title="Journey Card Entry" eyebrow={employee.passportId}>
      <Panel className="mb-5 bg-journey-black text-journey-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">Employee</p>
            <h2 className="mt-2 text-3xl font-black">{employee.name}</h2>
            <p className="mt-2 font-bold text-journey-line">
              {employee.title} - {department?.name}
            </p>
          </div>
          <div className="rounded-md border border-journey-steel px-4 py-3 text-right">
            <p className="text-xs font-black uppercase text-journey-line">
              Journey Card ID
            </p>
            <p className="mt-1 text-xl font-black text-journey-white">
              {employee.passportId}
            </p>
          </div>
        </div>
      </Panel>
      <PassportEntryForm employee={employee} />
    </AppShell>
  );
}
