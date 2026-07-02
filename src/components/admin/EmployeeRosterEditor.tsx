"use client";

import { KeyRound, Plus, Save, ToggleLeft, ToggleRight, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  buildJourneyCardUrl,
  getJourneyCardAreaForEmployee,
  makeInitials,
  nextJourneyCardId,
  useJourneyState,
} from "@/lib/journey-state";
import type { DepartmentId, Employee, Role } from "@/lib/types";
import { formatMiles } from "@/lib/utils";

const roleOptions: Role[] = ["employee", "manager", "admin"];
const accountStatusOptions = ["invited", "active", "disabled"] as const;

type AccountStatus = (typeof accountStatusOptions)[number];

function makeAccessCode(name: string) {
  const initials = makeInitials(name || "Crew Member").slice(0, 2);
  return `${initials}1570`;
}

export function EmployeeRosterEditor() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");
  const firstArea = state.journeyCardAreas.find((area) => area.enabled);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "employee" as Role,
    department: "floor" as DepartmentId,
    title: "Crew Member",
    shift: "Unassigned",
    journeyCardAreaId: "floor_lobby",
    accountStatus: "invited" as AccountStatus,
    accessCode: "",
  });

  const employees = state.employees;
  const departments = state.departments;
  const cardAreas = state.journeyCardAreas
    .filter((area) => area.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const filteredEmployees = useMemo(
    () =>
      employees.filter((employee) =>
        `${employee.name} ${employee.title} ${employee.passportId} ${employee.role} ${employee.email ?? ""} ${employee.accessCode ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [employees, search],
  );

  const activeCrewCount = employees.filter(
    (employee) => employee.role === "employee" && employee.active !== false,
    ).length;

  function suggestedAreaId(department: DepartmentId) {
    return (
      cardAreas.find((area) => area.departmentIds.includes(department))?.id ??
      firstArea?.id ??
      "floor_lobby"
    );
  }

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
    setSearch("");
    updateState((current) => {
      const passportId = nextJourneyCardId(current.employees);
      const employeeNumber = current.employees.length + 1;
      const name = newEmployee.name.trim() || `New Crew Member ${employeeNumber}`;
      const status = newEmployee.accountStatus;
      const createdEmployee: Employee = {
        id: `emp-new-${Date.now()}`,
        name,
        role: newEmployee.role,
        department: newEmployee.department,
        title: newEmployee.title.trim() || "Crew Member",
        initials: makeInitials(name),
        passportId,
        passportQrUrl: buildJourneyCardUrl(passportId),
        journeyCardAreaId: newEmployee.journeyCardAreaId || suggestedAreaId(newEmployee.department),
        email: newEmployee.email.trim() || undefined,
        accessCode: newEmployee.accessCode.trim() || makeAccessCode(name),
        accountStatus: status,
        active: status !== "disabled",
        miles: 0,
        weeklyMiles: 0,
        reliabilityStreak: 0,
        shift: newEmployee.shift.trim() || "Unassigned",
      };

      return {
        ...current,
        employees: [...current.employees, createdEmployee],
      };
    });
    setNewEmployee((current) => ({
      ...current,
      name: "",
      email: "",
      role: "employee",
      department: "floor",
      title: "Crew Member",
      shift: "Unassigned",
      journeyCardAreaId: suggestedAreaId("floor"),
      accountStatus: "invited",
      accessCode: "",
    }));
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
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Roster
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-journey-line bg-journey-mist p-4">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-journey-black text-journey-white">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              Create Account
            </p>
            <h3 className="text-lg font-black text-journey-black">
              Add a person, assign a role, and issue a Journey Card.
            </h3>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Name
            <input
              value={newEmployee.name}
              onChange={(event) =>
                setNewEmployee((current) => ({
                  ...current,
                  name: event.target.value,
                  accessCode: current.accessCode || makeAccessCode(event.target.value),
                }))
              }
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
              placeholder="Crew member name"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Email / Login
            <input
              value={newEmployee.email}
              onChange={(event) =>
                setNewEmployee((current) => ({ ...current, email: event.target.value }))
              }
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
              placeholder="optional for preview"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Role
            <select
              value={newEmployee.role}
              onChange={(event) =>
                setNewEmployee((current) => ({
                  ...current,
                  role: event.target.value as Role,
                }))
              }
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Department
            <select
              value={newEmployee.department}
              onChange={(event) => {
                const department = event.target.value as DepartmentId;
                setNewEmployee((current) => ({
                  ...current,
                  department,
                  journeyCardAreaId: suggestedAreaId(department),
                }));
              }}
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
            >
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Title
            <input
              value={newEmployee.title}
              onChange={(event) =>
                setNewEmployee((current) => ({ ...current, title: event.target.value }))
              }
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Journey Card Area
            <select
              value={newEmployee.journeyCardAreaId}
              onChange={(event) =>
                setNewEmployee((current) => ({
                  ...current,
                  journeyCardAreaId: event.target.value,
                }))
              }
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
            >
              {cardAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Access Code
            <input
              value={newEmployee.accessCode}
              onChange={(event) =>
                setNewEmployee((current) => ({
                  ...current,
                  accessCode: event.target.value,
                }))
              }
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3 font-mono font-black"
              placeholder={makeAccessCode(newEmployee.name)}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Status
            <select
              value={newEmployee.accountStatus}
              onChange={(event) =>
                setNewEmployee((current) => ({
                  ...current,
                  accountStatus: event.target.value as AccountStatus,
                }))
              }
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
            >
              {accountStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button type="button" icon={Plus} className="mt-4" onClick={addEmployee}>
          Create Account
        </Button>
      </div>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
        placeholder="Search name, role, title, or Journey Card ID"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1580px] border-collapse text-left">
          <thead>
            <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
              <th className="py-3 pr-3">Status</th>
              <th className="py-3 pr-3">Account</th>
              <th className="py-3 pr-3">Name</th>
              <th className="py-3 pr-3">Role</th>
              <th className="py-3 pr-3">Department</th>
              <th className="py-3 pr-3">Card Area</th>
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
              const area = getJourneyCardAreaForEmployee(employee, cardAreas);
              return (
                <tr key={employee.id} className="border-b border-journey-line align-top">
                  <td className="py-3 pr-3">
                    <Button
                      type="button"
                      variant={active ? "dark" : "secondary"}
                      icon={active ? ToggleRight : ToggleLeft}
                      onClick={() =>
                        updateEmployee(employee.id, {
                          active: !active,
                          accountStatus: active ? "disabled" : "active",
                        })
                      }
                    >
                      {active ? "Active" : "Disabled"}
                    </Button>
                  </td>
                  <td className="py-3 pr-3">
                    <select
                      value={employee.accountStatus ?? (active ? "invited" : "disabled")}
                      onChange={(event) => {
                        const status = event.target.value as AccountStatus;
                        updateEmployee(employee.id, {
                          accountStatus: status,
                          active: status !== "disabled",
                        });
                      }}
                      className="focus-ring min-h-10 rounded-md border border-journey-line px-3 font-bold"
                    >
                      {accountStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <input
                      value={employee.email ?? ""}
                      onChange={(event) =>
                        updateEmployee(employee.id, { email: event.target.value })
                      }
                      className="focus-ring mt-2 min-h-10 w-full min-w-56 rounded-md border border-journey-line px-3"
                      placeholder="email / login"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-journey-red" aria-hidden="true" />
                      <input
                        value={employee.accessCode ?? ""}
                        onChange={(event) =>
                          updateEmployee(employee.id, { accessCode: event.target.value })
                        }
                        className="focus-ring min-h-10 w-32 rounded-md border border-journey-line px-3 font-mono font-black"
                        placeholder="code"
                      />
                    </div>
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
                          journeyCardAreaId: suggestedAreaId(
                            event.target.value as DepartmentId,
                          ),
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
                    <select
                      value={employee.journeyCardAreaId ?? area?.id ?? ""}
                      onChange={(event) =>
                        updateEmployee(employee.id, {
                          journeyCardAreaId: event.target.value,
                        })
                      }
                      className="focus-ring min-h-10 rounded-md border border-journey-line px-3 font-bold"
                    >
                      {cardAreas.map((cardArea) => (
                        <option key={cardArea.id} value={cardArea.id}>
                          {cardArea.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs font-bold text-journey-steel">
                      Controls available Journey Card tasks.
                    </p>
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
