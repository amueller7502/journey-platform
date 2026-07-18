import type { ExperienceOperatingState } from "@/lib/server/experience-state";
import type { Redemption } from "@/lib/types";

export type CrewLeaderboardRow = {
  id: string;
  name: string;
  earned: number;
  pending: number;
  redeemed: number;
  available: number;
  rank: number;
};

function isPendingRedemption(status: Redemption["status"]) {
  return (
    status === "Requested" ||
    status === "Approved" ||
    status === "Pending" ||
    status === "Ready"
  );
}

export function crewLeaderboardRows(
  state: ExperienceOperatingState,
): CrewLeaderboardRow[] {
  const rewardCostById = new Map(
    state.rewards.map((reward) => [reward.id, reward.milesCost]),
  );

  return state.employees
    .filter((employee) => employee.role === "employee" && employee.active !== false)
    .map((employee) => {
      const employeeRedemptions = state.redemptions.filter(
        (redemption) => redemption.employeeId === employee.id,
      );
      const redeemed = employeeRedemptions
        .filter((redemption) => redemption.status === "Fulfilled")
        .reduce(
          (total, redemption) =>
            total + (redemption.pointsCost ?? rewardCostById.get(redemption.rewardId) ?? 0),
          0,
        );
      const pending = employeeRedemptions
        .filter((redemption) => isPendingRedemption(redemption.status))
        .reduce(
          (total, redemption) =>
            total + (redemption.pointsCost ?? rewardCostById.get(redemption.rewardId) ?? 0),
          0,
        );

      return {
        id: employee.id,
        name: employee.name,
        earned: employee.miles,
        pending,
        redeemed,
        available: Math.max(0, employee.miles - pending - redeemed),
      };
    })
    .sort(
      (a, b) =>
        b.earned - a.earned ||
        b.available - a.available ||
        a.name.localeCompare(b.name),
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));
}
