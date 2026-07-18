import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { managerConsolePeople } from "@/lib/server/manager-console";
import {
  readExperienceState,
  recordPointAdjustment,
  writeExperienceState,
} from "@/lib/server/experience-state";
import { requestCanSubmitExperience } from "@/lib/server/public-access";

type PointAdjustmentBody = {
  employeeId?: string;
  managerId?: string;
  points?: number;
  reason?: string;
};

export async function POST(request: Request) {
  if (!(await requestCanSubmitExperience(request))) {
    return NextResponse.json({ error: "This manager page is not authorized." }, { status: 401 });
  }

  const body = (await request.json()) as PointAdjustmentBody;
  const points = Math.trunc(Number(body.points));
  const reason = body.reason?.trim() ?? "";
  if (!body.employeeId || !Number.isFinite(points) || points <= 0 || !reason) {
    return NextResponse.json(
      { error: "Crew member, points to remove, and a reason are required." },
      { status: 400 },
    );
  }

  const { state } = await readExperienceState();
  const employee = state.employees.find(
    (item) => item.id === body.employeeId && item.role === "employee" && item.active !== false,
  );
  const manager =
    state.employees.find(
      (item) => item.id === body.managerId && item.role !== "employee" && item.active !== false,
    ) ??
    state.employees.find((item) => item.role !== "employee" && item.active !== false);

  if (!employee || !manager) {
    return NextResponse.json({ error: "That point adjustment could not be completed." }, { status: 404 });
  }

  const rewardCostById = new Map(
    state.rewards.map((reward) => [reward.id, reward.milesCost]),
  );
  const committedPoints = state.redemptions
    .filter(
      (redemption) =>
        redemption.employeeId === employee.id && redemption.status !== "Cancelled",
    )
    .reduce(
      (total, redemption) =>
        total + (redemption.pointsCost ?? rewardCostById.get(redemption.rewardId) ?? 0),
      0,
    );
  const removablePoints = Math.max(0, employee.miles - committedPoints);
  if (points > removablePoints) {
    return NextResponse.json(
      {
        error: `${employee.name} has ${removablePoints} uncommitted points available to remove. Reverse a reward first if needed.`,
      },
      { status: 400 },
    );
  }

  const createdAt = new Date().toISOString();
  const adjustment = {
    id: `adjustment-${randomUUID()}`,
    employeeId: employee.id,
    managerId: manager.id,
    amount: points,
    reason,
    createdAt,
  };
  const nextState = {
    ...state,
    employees: state.employees.map((item) =>
      item.id === employee.id
        ? {
            ...item,
            miles: item.miles - points,
            weeklyMiles: Math.max(0, item.weeklyMiles - points),
          }
        : item,
    ),
    departments: state.departments.map((department) =>
      department.id === employee.department
        ? {
            ...department,
            progressMiles: Math.max(0, department.progressMiles - points),
          }
        : department,
    ),
    updatedAt: createdAt,
  };
  const result = await writeExperienceState(nextState, { syncConfig: true });
  await recordPointAdjustment(adjustment, result.syncIssues);

  return NextResponse.json(
    {
      ...result,
      people: managerConsolePeople(result.state),
      message: `${points} points were removed from ${employee.name}.`,
    },
    { status: result.ok ? 200 : 500 },
  );
}
