import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { ManagerRosterInput } from "@/lib/manager-console-types";
import { managerConsolePeople } from "@/lib/server/manager-console";
import {
  readExperienceState,
  writeExperienceState,
} from "@/lib/server/experience-state";
import { requestCanSubmitExperience } from "@/lib/server/public-access";
import type { DepartmentId, Employee } from "@/lib/types";

type RosterRequest =
  | { action?: "upsert"; people?: ManagerRosterInput[] }
  | { action: "archive"; personId?: string };

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "CM";
}

function nextPassportId(employees: Employee[]) {
  const nextNumber =
    employees.reduce((highest, employee) => {
      const match = employee.passportId.match(/(\d+)$/);
      return Math.max(highest, match ? Number(match[1]) : 0);
    }, 0) + 1;

  return `ODY-1570-${String(nextNumber).padStart(3, "0")}`;
}

function departmentFor(
  value: string | undefined,
  role: "employee" | "manager",
  validDepartments: Set<string>,
) {
  if (role === "manager") {
    return "leadership" as DepartmentId;
  }

  const slug = value?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return (slug && validDepartments.has(slug) ? slug : "floor") as DepartmentId;
}

export async function POST(request: Request) {
  if (!(await requestCanSubmitExperience(request))) {
    return NextResponse.json({ error: "This manager page is not authorized." }, { status: 401 });
  }

  const body = (await request.json()) as RosterRequest;
  const { state } = await readExperienceState();

  if (body.action === "archive") {
    const person = state.employees.find((employee) => employee.id === body.personId);
    if (!person || person.role === "admin") {
      return NextResponse.json({ error: "That person cannot be removed here." }, { status: 400 });
    }

    if (person.role !== "employee") {
      const remainingLeaders = state.employees.filter(
        (employee) =>
          employee.id !== person.id &&
          employee.role !== "employee" &&
          employee.active !== false,
      );
      if (!remainingLeaders.length) {
        return NextResponse.json(
          { error: "Add another manager before removing the final manager." },
          { status: 400 },
        );
      }
    }

    const result = await writeExperienceState(
      {
        ...state,
        employees: state.employees.map((employee) =>
          employee.id === person.id
            ? {
                ...employee,
                active: false,
                accountStatus: "disabled" as const,
                archivedAt: new Date().toISOString(),
              }
            : employee,
        ),
      },
      { syncConfig: true },
    );

    return NextResponse.json(
      {
        ...result,
        people: managerConsolePeople(result.state),
        message: `${person.name} was removed from active manager workflows.`,
      },
      { status: result.ok ? 200 : 500 },
    );
  }

  const inputs = "people" in body ? body.people ?? [] : [];
  if (!inputs.length || inputs.length > 500) {
    return NextResponse.json(
      { error: "Add between 1 and 500 named people at a time." },
      { status: 400 },
    );
  }

  const validDepartments = new Set(state.departments.map((department) => department.id));
  const nextEmployees = [...state.employees];
  let changed = 0;

  for (const input of inputs) {
    const name = input.name?.trim();
    if (!name) {
      continue;
    }

    const role = input.role === "manager" ? "manager" : "employee";
    const email = input.email?.trim() || undefined;
    const existing =
      (input.id ? nextEmployees.find((employee) => employee.id === input.id) : undefined) ??
      (email
        ? nextEmployees.find(
            (employee) => employee.email?.toLowerCase() === email.toLowerCase(),
          )
        : undefined) ??
      nextEmployees.find(
        (employee) =>
          employee.name.toLowerCase() === name.toLowerCase() && employee.role === role,
      );

    if (existing?.role === "admin") {
      continue;
    }

    const department = departmentFor(
      input.department ?? existing?.department,
      role,
      validDepartments,
    );
    const journeyCardAreaId =
      state.journeyCardAreas.find((area) => area.departmentIds.includes(department))?.id ??
      state.journeyCardAreas.find((area) => area.enabled)?.id;

    if (existing) {
      const index = nextEmployees.findIndex((employee) => employee.id === existing.id);
      nextEmployees[index] = {
        ...existing,
        name,
        initials: initialsFor(name),
        role,
        department,
        title: input.title?.trim() || (role === "manager" ? "Manager" : existing.title),
        email: email ?? existing.email,
        journeyCardAreaId: role === "employee" ? journeyCardAreaId : existing.journeyCardAreaId,
        active: true,
        accountStatus: existing.accountStatus === "disabled" ? "active" : existing.accountStatus,
        archivedAt: undefined,
      };
      changed += 1;
      continue;
    }

    const passportId = nextPassportId(nextEmployees);
    const initials = initialsFor(name);
    const baseUrl = process.env.EXPERIENCE_APP_URL?.replace(/\/$/, "") ?? "";
    nextEmployees.push({
      id: `emp-${randomUUID()}`,
      name,
      role,
      department,
      title: input.title?.trim() || (role === "manager" ? "Manager" : "Crew Member"),
      initials,
      passportId,
      passportQrUrl: `${baseUrl}/manager/passport/${encodeURIComponent(passportId)}`,
      journeyCardAreaId,
      email,
      accessCode: `${initials}${passportId.slice(-4)}`,
      accountStatus: "active",
      active: true,
      miles: 0,
      weeklyMiles: 0,
      reliabilityStreak: 0,
      shift: "Unassigned",
    });
    changed += 1;
  }

  if (!changed) {
    return NextResponse.json({ error: "No valid named rows were found." }, { status: 400 });
  }

  const result = await writeExperienceState(
    { ...state, employees: nextEmployees },
    { syncConfig: true },
  );

  return NextResponse.json(
    {
      ...result,
      people: managerConsolePeople(result.state),
      message: `${changed} ${changed === 1 ? "person" : "people"} saved.`,
    },
    { status: result.ok ? 200 : 500 },
  );
}
