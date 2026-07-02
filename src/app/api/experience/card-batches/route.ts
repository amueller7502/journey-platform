import { NextResponse } from "next/server";
import {
  readExperienceState,
  recordExperienceCardBatch,
  recordExperienceMoments,
  writeExperienceState,
} from "@/lib/server/experience-state";
import { isArchived } from "@/lib/archive";

type CardBatchBody = {
  employeeId?: string;
  managerId?: string;
  areaId?: string;
  recognitionTypeIds?: string[];
  note?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as CardBatchBody;
  const selectedIds = body.recognitionTypeIds ?? [];
  if (!body.employeeId || !body.areaId || !selectedIds.length) {
    return NextResponse.json(
      { error: "Employee, card area, and verified items are required." },
      { status: 400 },
    );
  }

  const { state } = await readExperienceState();
  const employee = state.employees.find((item) => item.id === body.employeeId);
  const manager =
    state.employees.find((item) => item.id === body.managerId) ??
    state.employees.find((item) => item.role === "manager" && item.active !== false);
  const cardArea = state.journeyCardAreas.find(
    (area) => area.id === body.areaId && area.enabled && !isArchived(area),
  );
  const selectedTypes = state.recognitionTypes.filter(
    (type) =>
      selectedIds.includes(type.id) &&
      type.enabled &&
      !isArchived(type) &&
      type.journeyCardEligible &&
      (!type.journeyCardAreaIds?.length || type.journeyCardAreaIds.includes(body.areaId!)),
  );

  if (!employee || employee.role !== "employee" || !manager || !cardArea || !selectedTypes.length) {
    return NextResponse.json(
      { error: "Unable to submit that Experience Card batch." },
      { status: 404 },
    );
  }

  const createdAt = new Date().toISOString();
  const batchStamp = createdAt.replace(/[^0-9]/g, "");
  const batchId = `card-${employee.passportId}-${batchStamp}`;
  const totalXp = selectedTypes.reduce((total, type) => total + type.milesValue, 0);
  const note = body.note?.trim() || `${employee.name} turned in a verified ${cardArea.name} card.`;
  const moments = selectedTypes.map((type, index) => ({
    id: `${batchId}-${index}`,
    employeeId: employee.id,
    employeeName: employee.name,
    employeeInitials: employee.initials,
    recognitionTypeId: type.id,
    recognitionTypeName: type.name,
    standardId: type.standardId,
    miles: type.milesValue,
    note:
      body.note?.trim() ||
      `${employee.name} had ${type.name.toLowerCase()} verified from an Experience Card.`,
    createdAt,
    managerName: manager.name,
    batchId,
  }));

  const nextState = {
    ...state,
    employees: state.employees.map((item) =>
      item.id === employee.id
        ? {
            ...item,
            miles: item.miles + totalXp,
            weeklyMiles: item.weeklyMiles + totalXp,
            lastRecognizedAt: createdAt,
          }
        : item,
    ),
    departments: state.departments.map((department) =>
      department.id === employee.department
        ? {
            ...department,
            progressMiles: department.progressMiles + totalXp,
          }
        : department,
    ),
    updatedAt: createdAt,
  };

  const result = await writeExperienceState(nextState);
  const seasonId = state.seasons.find((season) => season.active)?.id ?? state.chapter.id;
  await recordExperienceCardBatch(
    {
      id: batchId,
      seasonId,
      employeeId: employee.id,
      managerId: manager.id,
      areaId: cardArea.id,
      selectedRecognitionTypeIds: selectedTypes.map((type) => type.id),
      totalXp,
      shiftNote: note,
      submittedAt: createdAt,
    },
    result.syncIssues,
  );
  await recordExperienceMoments(
    selectedTypes.map((type, index) => ({
      id: `${batchId}-${index}`,
      seasonId,
      employeeId: employee.id,
      managerId: manager.id,
      recognitionTypeId: type.id,
      standardId: type.standardId,
      xp: type.milesValue,
      note:
        body.note?.trim() ||
        `${employee.name} had ${type.name.toLowerCase()} verified from an Experience Card.`,
      source: "experience_card",
      batchId,
      createdAt,
    })),
    result.syncIssues,
  );

  return NextResponse.json({
    ...result,
    batchId,
    moments,
    totalXp,
  });
}
