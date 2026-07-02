"use client";

import Image from "next/image";
import {
  CheckCircle2,
  KeyRound,
  Plus,
  Save,
  ToggleLeft,
  ToggleRight,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ArchiveFilterControls } from "@/components/ui/ArchiveFilterControls";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog, type ConfirmDialogState } from "@/components/ui/ConfirmDialog";
import { StatusToast, type StatusToastState } from "@/components/ui/StatusToast";
import { EmployeeImportTool } from "@/components/admin/EmployeeImportTool";
import {
  isArchived,
  isDraftLikeId,
  matchesArchiveFilter,
  type ArchiveFilter,
} from "@/lib/archive";
import { recognitions } from "@/lib/data";
import { getJourneyMoments } from "@/lib/demo-moments";
import {
  buildJourneyCardUrl,
  getJourneyCardAreaForEmployee,
  makeInitials,
  nextJourneyCardId,
  useJourneyState,
} from "@/lib/journey-state";
import type { DepartmentId, Employee, Role } from "@/lib/types";
import { formatXp } from "@/lib/utils";

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
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>("active");
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [toast, setToast] = useState<StatusToastState | null>(null);
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
      employees.filter((employee) => {
        const matchesStatus = matchesArchiveFilter(
          employee,
          archiveFilter,
          employee.active !== false,
        );
        const matchesSearch =
          `${employee.name} ${employee.title} ${employee.passportId} ${employee.role} ${employee.email ?? ""} ${employee.accessCode ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
      }),
    [archiveFilter, employees, search],
  );

  const activeCrewCount = employees.filter(
    (employee) => employee.role === "employee" && employee.active !== false,
  ).length;
  const pendingPhotoRequests = employees.filter(
    (employee) =>
      employee.profilePhotoStatus === "pending" && employee.pendingProfilePhotoUrl,
  );

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
    setToast(null);
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
        journeyCardAreaId:
          newEmployee.journeyCardAreaId || suggestedAreaId(newEmployee.department),
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

  function deleteEmployee(id: string) {
    const employee = state.employees.find((item) => item.id === id);
    if (!employee) {
      setToast({ tone: "error", message: "That employee could not be found." });
      return;
    }

    const localMoments = getJourneyMoments();
    const hasMoments =
      recognitions.some((recognition) => recognition.employeeId === id) ||
      localMoments.some((moment) => moment.employeeId === id);
    const hasHistory =
      hasMoments ||
      employee.miles > 0 ||
      employee.weeklyMiles > 0 ||
      state.redemptions.some((redemption) => redemption.employeeId === id);
    const canDeletePermanently = isDraftLikeId(id) && !hasHistory;

    setConfirmDialog({
      title: canDeletePermanently ? `Delete ${employee.name}?` : `Archive ${employee.name}?`,
      destructive: true,
      confirmLabel: canDeletePermanently ? "Delete Permanently" : "Archive Employee",
      body: canDeletePermanently ? (
        <p>
          This draft/test employee has no XP, moments, or reward history, so the
          account will be permanently removed.
        </p>
      ) : (
        <div className="grid gap-2">
          <p>
            This employee will be deactivated and archived. They will disappear from
            manager search, Capture Moment, print runs, and employee login options.
          </p>
          <p>
            Their XP, Experience Moments, and reward history remain intact.
          </p>
        </div>
      ),
      onConfirm: () => {
        try {
          setSaved(false);
          updateState((current) => {
            const exists = current.employees.some((item) => item.id === id);
            if (!exists) {
              throw new Error("Employee no longer exists.");
            }

            return {
              ...current,
              employees: canDeletePermanently
                ? current.employees.filter((item) => item.id !== id)
                : current.employees.map((item) =>
                    item.id === id
                      ? {
                          ...item,
                          active: false,
                          accountStatus: "disabled",
                          archivedAt: new Date().toISOString(),
                        }
                      : item,
                  ),
              journeyCardAssignments: canDeletePermanently
                ? current.journeyCardAssignments.filter(
                    (assignment) => assignment.employeeId !== id,
                  )
                : current.journeyCardAssignments,
            };
          });
          setToast({
            tone: "success",
            message: canDeletePermanently
              ? `${employee.name} deleted.`
              : `${employee.name} archived and removed from active workflows.`,
          });
        } catch (error) {
          setToast({
            tone: "error",
            message:
              error instanceof Error ? error.message : "Unable to update that employee.",
          });
        }
      },
    });
  }

  function approveProfilePhoto(id: string) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              profilePhotoUrl: employee.pendingProfilePhotoUrl,
              pendingProfilePhotoUrl: undefined,
              profilePhotoStatus: "approved",
            }
          : employee,
      ),
    }));
  }

  function rejectProfilePhoto(id: string) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              pendingProfilePhotoUrl: undefined,
              profilePhotoStatus: "rejected",
            }
          : employee,
      ),
    }));
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-bold text-journey-steel">
            Roster changes are saved to this configurable build immediately and are
            used by manager search, Experience Card lookup, and recognition tools.
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
          <ArchiveFilterControls value={archiveFilter} onChange={setArchiveFilter} />
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Roster
          </Button>
        </div>
      </div>

      <StatusToast toast={toast} />

      <EmployeeImportTool />

      {pendingPhotoRequests.length ? (
        <div className="rounded-lg border border-journey-line bg-journey-white p-4 shadow-line">
          <p className="text-xs font-black uppercase text-journey-red">
            Profile Photo Approvals
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {pendingPhotoRequests.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-journey-line p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-journey-mist">
                    <Image
                      src={employee.pendingProfilePhotoUrl ?? ""}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-black text-journey-black">
                      {employee.name}
                    </p>
                    <p className="text-sm font-bold text-journey-steel">
                      Waiting for approval
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    icon={CheckCircle2}
                    onClick={() => approveProfilePhoto(employee.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    icon={XCircle}
                    onClick={() => rejectProfilePhoto(employee.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

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
              Add a person, assign a role, and issue a Experience Card.
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
            Default Experience Card Area
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
        placeholder="Search name, role, title, or Experience Card ID"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
              <th className="py-3 pr-3">Status</th>
              <th className="py-3 pr-3">Account</th>
              <th className="py-3 pr-3">Name</th>
              <th className="py-3 pr-3">Role</th>
              <th className="py-3 pr-3">Department</th>
              <th className="py-3 pr-3">Default Card</th>
              <th className="py-3 pr-3">Title</th>
              <th className="py-3 pr-3">Experience Card ID</th>
              <th className="py-3 pr-3">Shift</th>
              <th className="py-3 pr-3">XP</th>
              <th className="py-3 pr-3">Weekly XP</th>
              <th className="py-3 pr-3">Streak</th>
              <th className="py-3 pr-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const active = employee.active !== false;
              const archived = isArchived(employee);
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
                          archivedAt: undefined,
                        })
                      }
                      disabled={archived}
                    >
                      {archived ? "Archived" : active ? "Active" : "Disabled"}
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
                          archivedAt: status === "active" ? undefined : employee.archivedAt,
                        });
                      }}
                      disabled={archived}
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
                      Day-of print runs can assign any card type.
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
                      Used to look up turned-in Experience Cards.
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
                      {formatXp(employee.miles)} XP
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
                  <td className="py-3 pr-3">
                    <Button
                      type="button"
                      variant="ghost"
                      icon={Trash2}
                      onClick={() => deleteEmployee(employee.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </div>
  );
}
