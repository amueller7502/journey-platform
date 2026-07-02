"use client";

import { useState } from "react";
import { Check, PackageCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  replaceJourneyStateFromServer,
  useJourneyState,
  type JourneyOperatingState,
} from "@/lib/journey-state";
import type { Redemption } from "@/lib/types";
import { formatShortDateTime } from "@/lib/utils";

function openStatus(status: Redemption["status"]) {
  return status === "Requested" || status === "Approved" || status === "Pending" || status === "Ready";
}

export function PendingRewardQueue() {
  const { state, updateState } = useJourneyState();
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");
  const items = state.redemptions
    .filter((redemption) => openStatus(redemption.status))
    .slice()
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

  async function updateRedemption(id: string, status: Redemption["status"]) {
    setUpdatingId(id);
    setMessage("");

    try {
      const response = await fetch("/api/experience/reward-redemptions", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ redemptionId: id, status }),
      });
      const payload = (await response.json()) as {
        error?: string;
        mode?: "local" | "supabase";
        state?: JourneyOperatingState;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Reward request could not be updated.");
      }

      if (payload.mode === "supabase" && payload.state) {
        replaceJourneyStateFromServer(payload.state);
      } else {
        updateLocalRedemption(id, status);
      }
      setMessage(`Reward request marked ${status.toLowerCase()}.`);
    } catch (error) {
      updateLocalRedemption(id, status);
      setMessage(
        error instanceof Error
          ? `${error.message} Saved locally as fallback.`
          : "Saved locally as fallback.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  function updateLocalRedemption(id: string, status: Redemption["status"]) {
    updateState((current) => ({
      ...current,
      redemptions: current.redemptions.map((redemption) =>
        redemption.id === id
          ? {
              ...redemption,
              status,
              reviewedAt:
                status === "Approved" || status === "Cancelled" || status === "Ready"
                  ? new Date().toISOString()
                  : redemption.reviewedAt,
              fulfilledAt: status === "Fulfilled" ? new Date().toISOString() : redemption.fulfilledAt,
            }
          : redemption,
      ),
      rewards:
        status === "Fulfilled"
          ? current.rewards.map((reward) => {
              const redemption = current.redemptions.find((item) => item.id === id);
              return reward.id === redemption?.rewardId
                ? {
                    ...reward,
                    inventoryCount: Math.max(0, reward.inventoryCount - 1),
                  }
                : reward;
            })
          : current.rewards,
    }));
  }

  return (
    <div className="grid gap-3">
      {!items.length ? (
        <div className="rounded-lg border border-dashed border-journey-line p-5">
          <p className="font-black text-journey-black">No open reward requests.</p>
          <p className="mt-2 text-sm font-bold text-journey-steel">
            Employee reward requests will appear here for approval and fulfillment.
          </p>
        </div>
      ) : null}
      {message ? (
        <p className="rounded-lg border border-journey-line bg-journey-mist p-3 text-sm font-black text-journey-red">
          {message}
        </p>
      ) : null}
      {items.map((redemption) => {
        const employee = state.employees.find((item) => item.id === redemption.employeeId);
        const reward = state.rewards.find((item) => item.id === redemption.rewardId);
        return (
          <article
            key={redemption.id}
            className="rounded-lg border border-journey-line bg-journey-white p-4 shadow-line"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-journey-red">
                  {redemption.status}
                </p>
                <h3 className="mt-1 text-lg font-black text-journey-black">
                  {employee?.name ?? "Crew Member"} - {reward?.name ?? "Reward"}
                </h3>
                <p className="mt-1 text-sm font-bold text-journey-steel">
                  {reward?.milesCost ?? 0} XP / requested{" "}
                  {formatShortDateTime(redemption.requestedAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  icon={Check}
                  variant="dark"
                  disabled={
                    updatingId === redemption.id ||
                    redemption.status === "Approved" ||
                    redemption.status === "Ready"
                  }
                  onClick={() => void updateRedemption(redemption.id, "Approved")}
                >
                  {updatingId === redemption.id ? "Updating..." : "Approve"}
                </Button>
                <Button
                  type="button"
                  icon={PackageCheck}
                  disabled={updatingId === redemption.id || reward?.inventoryCount === 0}
                  onClick={() => void updateRedemption(redemption.id, "Fulfilled")}
                >
                  Fulfill
                </Button>
                <Button
                  type="button"
                  icon={X}
                  variant="secondary"
                  disabled={updatingId === redemption.id}
                  onClick={() => void updateRedemption(redemption.id, "Cancelled")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
