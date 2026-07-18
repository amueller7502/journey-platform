import { NextResponse } from "next/server";
import {
  managerConsolePeople,
  managerConsoleRewards,
} from "@/lib/server/manager-console";
import {
  readExperienceState,
  recordRewardRedemption,
  writeExperienceState,
} from "@/lib/server/experience-state";
import { requestCanSubmitExperience } from "@/lib/server/public-access";
import type { Redemption } from "@/lib/types";

type ManagerRedemptionBody = {
  employeeId?: string;
  rewardId?: string;
  managerId?: string;
};

export async function POST(request: Request) {
  if (!(await requestCanSubmitExperience(request))) {
    return NextResponse.json({ error: "This manager page is not authorized." }, { status: 401 });
  }

  const body = (await request.json()) as ManagerRedemptionBody;
  if (!body.employeeId || !body.rewardId) {
    return NextResponse.json({ error: "Employee and reward are required." }, { status: 400 });
  }

  const { state } = await readExperienceState();
  const employee = state.employees.find(
    (item) =>
      item.id === body.employeeId && item.role === "employee" && item.active !== false,
  );
  const reward = state.rewards.find(
    (item) => item.id === body.rewardId && item.enabled && !item.comingSoon,
  );
  const manager =
    state.employees.find(
      (item) => item.id === body.managerId && item.role !== "employee" && item.active !== false,
    ) ??
    state.employees.find((item) => item.role !== "employee" && item.active !== false);

  if (!employee || !reward || !manager) {
    return NextResponse.json({ error: "That redemption could not be completed." }, { status: 404 });
  }

  const rewardCostById = new Map(
    state.rewards.map((availableReward) => [availableReward.id, availableReward.milesCost]),
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
  const availablePoints = Math.max(0, employee.miles - committedPoints);

  if (availablePoints < reward.milesCost) {
    return NextResponse.json(
      { error: `${employee.name} has ${availablePoints} available points.` },
      { status: 400 },
    );
  }

  const completedCount = state.redemptions.filter(
    (redemption) =>
      redemption.employeeId === employee.id &&
      redemption.rewardId === reward.id &&
      redemption.status !== "Cancelled",
  ).length;
  if (
    reward.redemptionLimitPerEmployee &&
    completedCount >= reward.redemptionLimitPerEmployee
  ) {
    return NextResponse.json(
      { error: `${employee.name} has already reached the limit for ${reward.name}.` },
      { status: 400 },
    );
  }

  const fulfilledAt = new Date().toISOString();
  const redemption: Redemption = {
    id: `redemption-${employee.id}-${reward.id}-${Date.now()}`,
    employeeId: employee.id,
    rewardId: reward.id,
    pointsCost: reward.milesCost,
    status: "Fulfilled",
    requestedAt: fulfilledAt,
    reviewedAt: fulfilledAt,
    fulfilledAt,
  };
  const nextState = {
    ...state,
    redemptions: [redemption, ...state.redemptions],
    rewards: state.rewards.map((item) =>
      item.id === reward.id && item.inventoryCount > 0
        ? { ...item, inventoryCount: item.inventoryCount - 1 }
        : item,
    ),
    updatedAt: fulfilledAt,
  };
  const result = await writeExperienceState(nextState, { syncConfig: true });
  await recordRewardRedemption(redemption, result.syncIssues);

  return NextResponse.json(
    {
      ...result,
      redemption,
      people: managerConsolePeople(result.state),
      rewards: managerConsoleRewards(result.state),
      message: `${employee.name} redeemed ${reward.milesCost} points for ${reward.name}.`,
    },
    { status: result.ok ? 200 : 500 },
  );
}
