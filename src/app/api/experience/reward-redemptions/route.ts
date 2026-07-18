import { NextResponse } from "next/server";
import {
  readExperienceState,
  recordRewardRedemption,
  writeExperienceState,
} from "@/lib/server/experience-state";
import type { Redemption } from "@/lib/types";
import { getRequestAuthContext, requestUserCanAccess } from "@/lib/server/request-auth";

type RewardRequestBody = {
  employeeId?: string;
  rewardId?: string;
};

type RewardPatchBody = {
  redemptionId?: string;
  status?: Redemption["status"];
};

function isOpenStatus(status: Redemption["status"]) {
  return (
    status === "Requested" ||
    status === "Approved" ||
    status === "Pending" ||
    status === "Ready"
  );
}

export async function POST(request: Request) {
  const context = await getRequestAuthContext(request);
  if (!requestUserCanAccess(context, "employee")) {
    return NextResponse.json({ error: "Account access is required." }, { status: 401 });
  }

  const body = (await request.json()) as RewardRequestBody;
  if (!body.employeeId || !body.rewardId) {
    return NextResponse.json(
      { error: "Employee and reward are required." },
      { status: 400 },
    );
  }

  const { state } = await readExperienceState();
  const employee = state.employees.find((item) => item.id === body.employeeId);
  const reward = state.rewards.find((item) => item.id === body.rewardId && item.enabled);
  if (!employee || employee.role !== "employee" || !reward) {
    return NextResponse.json({ error: "Reward request could not be created." }, { status: 404 });
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
      (total, redemption) => total + (rewardCostById.get(redemption.rewardId) ?? 0),
      0,
    );
  const availablePoints = Math.max(0, employee.miles - committedPoints);

  if (availablePoints < reward.milesCost) {
    return NextResponse.json({ error: "Not enough XP for that reward yet." }, { status: 400 });
  }

  if (reward.comingSoon || reward.inventoryCount <= 0) {
    return NextResponse.json({ error: "That reward is not currently available." }, { status: 400 });
  }

  const alreadyOpen = state.redemptions.some(
    (redemption) =>
      redemption.employeeId === employee.id &&
      redemption.rewardId === reward.id &&
      isOpenStatus(redemption.status),
  );
  if (alreadyOpen) {
    return NextResponse.json({ error: "That reward already has an open request." }, { status: 400 });
  }

  const redemption: Redemption = {
    id: `redemption-${employee.id}-${reward.id}-${Date.now()}`,
    employeeId: employee.id,
    rewardId: reward.id,
    status: "Requested",
    requestedAt: new Date().toISOString(),
  };
  const nextState = {
    ...state,
    redemptions: [redemption, ...state.redemptions],
    updatedAt: redemption.requestedAt,
  };

  const result = await writeExperienceState(nextState);
  await recordRewardRedemption(redemption, result.syncIssues);

  return NextResponse.json({
    ...result,
    redemption,
  });
}

export async function PATCH(request: Request) {
  const context = await getRequestAuthContext(request);
  if (!requestUserCanAccess(context, "manager")) {
    return NextResponse.json({ error: "Manager access is required." }, { status: 401 });
  }

  const body = (await request.json()) as RewardPatchBody;
  if (!body.redemptionId || !body.status) {
    return NextResponse.json(
      { error: "Redemption and status are required." },
      { status: 400 },
    );
  }

  const allowed: Redemption["status"][] = ["Approved", "Fulfilled", "Cancelled", "Ready"];
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "Unsupported redemption status." }, { status: 400 });
  }

  const { state } = await readExperienceState();
  const redemption = state.redemptions.find((item) => item.id === body.redemptionId);
  if (!redemption) {
    return NextResponse.json({ error: "Reward request not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const updatedRedemption: Redemption = {
    ...redemption,
    status: body.status,
    reviewedAt:
      body.status === "Approved" || body.status === "Cancelled" || body.status === "Ready"
        ? now
        : redemption.reviewedAt,
    fulfilledAt: body.status === "Fulfilled" ? now : redemption.fulfilledAt,
  };
  const nextState = {
    ...state,
    redemptions: state.redemptions.map((item) =>
      item.id === redemption.id ? updatedRedemption : item,
    ),
    rewards:
      body.status === "Fulfilled"
        ? state.rewards.map((reward) =>
            reward.id === redemption.rewardId
              ? {
                  ...reward,
                  inventoryCount: Math.max(0, reward.inventoryCount - 1),
                }
              : reward,
          )
        : state.rewards,
    updatedAt: now,
  };

  const result = await writeExperienceState(nextState, {
    syncConfig: body.status === "Fulfilled",
  });
  await recordRewardRedemption(updatedRedemption, result.syncIssues);

  return NextResponse.json({
    ...result,
    redemption: updatedRedemption,
  });
}
