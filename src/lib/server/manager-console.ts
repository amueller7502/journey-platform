import { isArchived } from "@/lib/archive";
import type {
  ManagerConsolePerson,
  ManagerConsoleReward,
} from "@/lib/manager-console-types";
import { ODYSSEY_REWARD_IDS } from "@/lib/odyssey-config";
import type { ExperienceOperatingState } from "@/lib/server/experience-state";
import type { Redemption } from "@/lib/types";

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
