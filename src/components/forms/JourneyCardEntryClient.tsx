"use client";

import { ClipboardCheck } from "lucide-react";
import { PassportEntryForm } from "@/components/forms/PassportEntryForm";
import { LinkButton } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { getJourneyCardAreaForEmployee, useJourneyState } from "@/lib/journey-state";

export function JourneyCardEntryClient({
  passportId,
  areaId,
}: {
  passportId: string;
  areaId?: string;
}) {
  const { state } = useJourneyState();
  const employee = state.employees.find(
    (item) => item.passportId.toLowerCase() === passportId.toLowerCase(),
  );
  const department = state.departments.find(
    (item) => item.id === employee?.department,
  );
  const cardArea = employee
    ? getJourneyCardAreaForEmployee(employee, state.journeyCardAreas)
    : undefined;

  if (!employee || employee.active === false) {
    return (
      <Panel>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-journey-black text-journey-white">
            <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              Journey Card Not Found
            </p>
            <h2 className="mt-2 text-2xl font-black text-journey-black">
              {passportId}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-journey-steel">
              Add or re-enable this employee in Admin / Employees, then return to this
              Journey Card entry screen.
            </p>
            <LinkButton href="/admin/employees" icon={ClipboardCheck} className="mt-4">
              Manage Employees
            </LinkButton>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <>
      <Panel className="mb-5 bg-journey-black text-journey-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">Employee</p>
            <h2 className="mt-2 text-3xl font-black">{employee.name}</h2>
            <p className="mt-2 font-bold text-journey-line">
              {employee.title} - {department?.name}
            </p>
            <p className="mt-1 text-sm font-black text-journey-red">
              {cardArea?.name ?? "Unassigned Journey Card"}
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
      <PassportEntryForm employee={employee} initialAreaId={areaId} />
    </>
  );
}
