import { NextResponse } from "next/server";
import {
  readExperienceState,
  recordExperienceMoments,
  writeExperienceState,
} from "@/lib/server/experience-state";

type CaptureMomentBody = {
  employeeId?: string;
  recognitionTypeId?: string;
  managerId?: string;
  note?: string;
  xp?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CaptureMomentBody;
  if (!body.employeeId || !body.recognitionTypeId) {
    return NextResponse.json(
      { error: "Employee and recognition type are required." },
      { status: 400 },
    );
  }

  const { state } = await readExperienceState();
  const employee = state.employees.find((item) => item.id === body.employeeId);
  const recognitionType = state.recognitionTypes.find(
    (item) => item.id === body.recognitionTypeId && item.enabled,
  );
  const manager =
    state.employees.find((item) => item.id === body.managerId) ??
    state.employees.find((item) => item.role === "manager" && item.active !== false);

  if (!employee || employee.role !== "employee" || !recognitionType || !manager) {
    return NextResponse.json(
      { error: "Unable to capture that Experience Moment." },
      { status: 404 },
    );
  }

  const createdAt = new Date().toISOString();
  const xp =
    recognitionType.id === "manager_above_beyond" && body.xp
      ? body.xp
      : recognitionType.milesValue;
  const note =
    body.note?.trim() ||
    `${employee.name} created an Experience Moment through ${recognitionType.name.toLowerCase()}.`;
  const moment = {
    id: `moment-${employee.id}-${recognitionType.id}-${Date.now()}`,
    employeeId: employee.id,
    employeeName: employee.name,
    employeeInitials: employee.initials,
    recognitionTypeId: recognitionType.id,
    recognitionTypeName: recognitionType.name,
    standardId: recognitionType.standardId,
    miles: xp,
    note,
    createdAt,
    managerName: manager.name,
  };

  const nextState = {
    ...state,
    employees: state.employees.map((item) =>
      item.id === employee.id
        ? {
            ...item,
            miles: item.miles + xp,
            weeklyMiles: item.weeklyMiles + xp,
            lastRecognizedAt: createdAt,
          }
        : item,
    ),
    departments: state.departments.map((department) =>
      department.id === employee.department
        ? {
            ...department,
            progressMiles: department.progressMiles + xp,
          }
        : department,
    ),
    updatedAt: createdAt,
  };

  const result = await writeExperienceState(nextState);
  await recordExperienceMoments(
    [
      {
        id: moment.id,
        seasonId: state.seasons.find((season) => season.active)?.id ?? state.chapter.id,
        employeeId: employee.id,
        managerId: manager.id,
        recognitionTypeId: recognitionType.id,
        standardId: recognitionType.standardId,
        xp,
        note,
        source: "manager_entry",
        createdAt,
      },
    ],
    result.syncIssues,
  );

  return NextResponse.json({
    ...result,
    moment,
  });
}
