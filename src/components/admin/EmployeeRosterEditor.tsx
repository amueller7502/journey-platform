"use client";

import { Plus, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  buildJourneyCardUrl,
  makeInitials,
  nextJourneyCardId,
  useJourneyState,
} from "@/lib/journey-state";
import type { DepartmentId, Employee, Role } from "@/lib/types";
import { formatMiles } from "@/lib/utils";

const roleOptions: Role[] = ["employee", "manager", "admin"];

export function EmployeeRosterEditor() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  const employees = state.employees;
  const departments = state.departments;
  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) =>
        `${employee.name} ${employee.title} ${employee.passportId} ${employee.role}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [employees, search],
  );

  const activeCrewCount = employees.filter(
    (employee) => employee.role === "employee" && employee.active !== false,
  ).length;

  function updateEmployee(id: string, patch: Partial<Employee>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === id ? { ...employee, ...patch } : employee,
      ),
    }));
  }

  function addEmployee() {
    setSaved(false);
    updateState((current) => {
      const passportId = nextJourneyCardId(current.employees);
      const employeeNumber = current.employees.length + 1;
      const newEmployee: Employee = {
        id: `emp-new-${Date.now()}`,
        name: `New Crew Member ${employeeNumber}`,
        role: "employee",
        department: "floor",
        title: "Crew Member",
        initials: "NC",
        passportId,
        passportQrUrl: buildJourneyCardUrl(passportId),
        active: true,
        miles: 0,
        weeklyMiles: 0,
        reliabilityStreak: 0,
        shift: "Unassigned",
      };

      return {
        ...current,
        employees: [...current.employees, newEmployee],
      };
    });
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-bold text-journey-steel">
            Roster changes are saved to this configurable build immediately and are
            used by manager search, Journey Card lookup, and recognition tools.
          </p>
          <p className="mt-2 text-sm font-black text-journey-black">
            {activeCrewCount} active crew profiles
          </p>
          {saved ? (
            <p className="mt-2 text-sm font-black text-journey-red">
              Roster saved.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="secondary" icon={Plus} onClick={addEmployee}>
            Add Employee
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Roster
          </Button>
        </div>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
        placeholder="Search name, role, title, or Journey Card ID"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1240px] border-collapse text-left">
          <thead>
            <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
              <th className="py-3 pr-3">Status</th>
              <th className="py-3 pr-3">Name</th>
              <th className="py-3 pr-3">Role</th>
              <th className="py-3 pr-3">Department</th>
              <th className="py-3 pr-3">Title</th>
              <th className="py-3 pr-3">Journey Card ID</th>
              <th className="py-3 pr-3">Shift</th>
              <th className="py-3 pr-3">Miles</th>
              <th className="py-3 pr-3">Weekly</th>
              <th className="py-3 pr-3">Streak</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const active = employee.active !== false;
              return (
                <tr key={employee.id} className="border-b border-journey-line align-top">
                  <td className="py-3 pr-3">
                    <Button
                      type="button"
                      variant={active ? "dark" : "secondary"}
                      icon={active ? ToggleRight : ToggleLeft}
                      onClick={() => updateEmployee(employee.id, { active: !active })}
                    >
                      {active ? "Active" : "Disabled"}
                    </Button>
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      value={employee.name}
                      onChange={(event) =>
                        updateEmployee(employee.id, {
                          name: event.target.value,
                          initials: makeInitials(event.target.value),
                        })
                      }
                      className="focus-ring min-h-10 w-full min-w-56 rounded-md border border-journey-line px-3 font-bold"
                    />
                    <p className="mt-2 text-xs font-black uppercase text-journey-red">
                      {employee.initials}
                    </p>
                  </td>
                  <td className="py-3 pr-3">
                    <select
                      value={employee.role}
                      onChange={(event) =>
                        updateEmployee(employee.id, { role: event.target.value as Role })
                      }
                      className="focus-ring min-h-10 rounded-md border border-journey-line px-3 font-bold"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-3">
                    <select
                      value={employee.department}
                      onChange={(event) =>
                        updateEmployee(employee.id, {
                          department: event.target.value as DepartmentId,
                        })
                      }
                      className="focus-ring min-h-10 rounded-md border border-journey-line px-3 font-bold"
                    >
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      value={employee.title}
                      onChange={(event) =>
                        updateEmployee(employee.id, { title: event.target.value })
                      }
                      className="focus-ring min-h-10 w-full min-w-48 rounded-md border border-journey-line px-3"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      value={employee.passportId}
                      onChange={(event) =>
                        updateEmployee(employee.id, {
                          passportId: event.target.value,
                          passportQrUrl: buildJourneyCardUrl(event.target.value),
                        })
                      }
                      className="focus-ring min-h-10 w-full min-w-44 rounded-md border border-journey-line px-3 font-black"
                    />
                    <p className="mt-2 text-xs font-bold text-journey-steel">
                      QR opens manager Journey Card entry.
                    </p>
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      value={employee.shift}
                      onChange={(event) =>
                        updateEmployee(employee.id, { shift: event.target.value })
                      }
                      className="focus-ring min-h-10 w-full min-w-36 rounded-md border border-journey-line px-3"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      type="number"
                      min="0"
                      value={employee.miles}
                      onChange={(event) =>
                        updateEmployee(employee.id, {
                          miles: Math.max(0, Number(event.target.value)),
                        })
                      }
                      className="focus-ring min-h-10 w-24 rounded-md border border-journey-line px-3 font-black"
                    />
                    <p className="mt-2 text-xs font-bold text-journey-steel">
                      {formatMiles(employee.miles)}
                    </p>
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      type="number"
                      min="0"
                      value={employee.weeklyMiles}
                      onChange={(event) =>
                        updateEmployee(employee.id, {
                          weeklyMiles: Math.max(0, Number(event.target.value)),
                        })
                      }
                      className="focus-ring min-h-10 w-24 rounded-md border border-journey-line px-3 font-black"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      type="number"
                      min="0"
                      value={employee.reliabilityStreak}
                      onChange={(event) =>
                        updateEmployee(employee.id, {
                          reliabilityStreak: Math.max(0, Number(event.target.value)),
                        })
                      }
                      className="focus-ring min-h-10 w-24 rounded-md border border-journey-line px-3 font-black"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
