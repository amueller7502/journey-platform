import { isArchived } from "@/lib/archive";
import type {
  ManagerConsolePerson,
  ManagerConsolePointHistory,
  ManagerConsoleRedemption,
  ManagerConsoleReward,
} from "@/lib/manager-console-types";
import { ODYSSEY_REWARD_IDS } from "@/lib/odyssey-config";
import type { ExperienceOperatingState } from "@/lib/server/experience-state";
import type { Redemption } from "@/lib/types";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";

function isPendingRedemption(status: Redemption["status"]) {
  return (
    status === "Requested" ||
    status === "Approved" ||
    status === "Pending" ||
    status === "Ready"
  );
}

export function managerConsolePeople(
  state: ExperienceOperatingState,
): ManagerConsolePerson[] {
  const rewardCostById = new Map(
    state.rewards.map((reward) => [reward.id, reward.milesCost]),
  );

  return state.employees
    .filter((employee) => employee.active !== false)
    .map((employee) => {
      const redemptions = state.redemptions.filter(
        (redemption) => redemption.employeeId === employee.id,
      );
      const pendingPoints = redemptions
        .filter((redemption) => isPendingRedemption(redemption.status))
        .reduce(
          (total, redemption) =>
            total + (redemption.pointsCost ?? rewardCostById.get(redemption.rewardId) ?? 0),
          0,
        );
      const redeemedPoints = redemptions
        .filter((redemption) => redemption.status === "Fulfilled")
        .reduce(
          (total, redemption) =>
            total + (redemption.pointsCost ?? rewardCostById.get(redemption.rewardId) ?? 0),
          0,
        );

      return {
        id: employee.id,
        name: employee.name,
        role: employee.role,
        department: employee.department,
        title: employee.title,
        email: employee.email,
        passportId: employee.passportId,
        journeyCardAreaId: employee.journeyCardAreaId,
        points: employee.miles,
        pendingPoints,
        redeemedPoints,
        availablePoints: Math.max(
          0,
          employee.miles - pendingPoints - redeemedPoints,
        ),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function managerConsoleRewards(
  state: ExperienceOperatingState,
): ManagerConsoleReward[] {
  const odysseyRewardIds = new Set<string>(ODYSSEY_REWARD_IDS);

  return state.rewards
    .filter(
      (reward) =>
        odysseyRewardIds.has(reward.id) &&
        reward.enabled &&
        !reward.comingSoon &&
        !isArchived(reward),
    )
    .sort((a, b) => a.milesCost - b.milesCost || a.sortOrder - b.sortOrder)
    .map((reward) => ({
      id: reward.id,
      name: reward.name,
      pointsCost: reward.milesCost,
      inventoryCount: reward.inventoryCount,
    }));
}

export function managerConsoleRedemptions(
  state: ExperienceOperatingState,
): ManagerConsoleRedemption[] {
  const employeeById = new Map(
    state.employees.map((employee) => [employee.id, employee.name]),
  );
  const rewardById = new Map(
    state.rewards.map((reward) => [
      reward.id,
      { name: reward.name, pointsCost: reward.milesCost },
    ]),
  );

  return state.redemptions
    .filter((redemption) => redemption.status === "Fulfilled")
    .map((redemption) => {
      const reward = rewardById.get(redemption.rewardId);
      return {
        id: redemption.id,
        employeeId: redemption.employeeId,
        employeeName: employeeById.get(redemption.employeeId) ?? "Former crew member",
        rewardId: redemption.rewardId,
        rewardName: reward?.name ?? "Archived reward",
        pointsCost: redemption.pointsCost ?? reward?.pointsCost ?? 0,
        fulfilledAt:
          redemption.fulfilledAt ?? redemption.reviewedAt ?? redemption.requestedAt,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.fulfilledAt).getTime() - new Date(a.fulfilledAt).getTime(),
    );
}

export async function managerConsolePointHistory(
  state: ExperienceOperatingState,
): Promise<ManagerConsolePointHistory[]> {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  const supabase = createAdminClient();
  const [{ data: moments }, { data: adjustments }] = await Promise.all([
    supabase
      .from("experience_moments")
      .select("id, employee_id, manager_id, recognition_type_id, xp, note, source, created_at")
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase
      .from("point_adjustments")
      .select("id, employee_app_id, manager_app_id, amount, reason, created_at")
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);
  const employeeById = new Map(
    state.employees.map((employee) => [employee.id, employee.name]),
  );
  const recognitionById = new Map(
    state.recognitionTypes.map((type) => [type.id, type.name]),
  );

  return [
    ...((moments ?? []) as Array<{
      id: string;
      employee_id: string;
      manager_id: string;
      recognition_type_id: string;
      xp: number;
      note: string;
      source: string;
      created_at: string;
    }>).map((moment) => ({
      id: moment.id,
      employeeId: moment.employee_id,
      employeeName: employeeById.get(moment.employee_id) ?? "Former crew member",
      managerName: employeeById.get(moment.manager_id) ?? "Manager",
      label: recognitionById.get(moment.recognition_type_id) ?? "Experience Moment",
      points: moment.xp,
      note: moment.note,
      source: moment.source === "experience_card" ? "crew_quest" as const : "moment" as const,
      createdAt: moment.created_at,
    })),
    ...((adjustments ?? []) as Array<{
      id: string;
      employee_app_id: string;
      manager_app_id: string;
      amount: number;
      reason: string;
      created_at: string;
    }>).map((adjustment) => ({
      id: adjustment.id,
      employeeId: adjustment.employee_app_id,
      employeeName: employeeById.get(adjustment.employee_app_id) ?? "Former crew member",
      managerName: employeeById.get(adjustment.manager_app_id) ?? "Manager",
      label: "Point correction",
      points: -adjustment.amount,
      note: adjustment.reason,
      source: "correction" as const,
      createdAt: adjustment.created_at,
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
