"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getEmployee, getReward, redemptions } from "@/lib/data";

export function PendingRewardQueue() {
  const [items, setItems] = useState(redemptions);

  return (
    <div className="grid gap-3">
      {items.map((redemption) => {
        const employee = getEmployee(redemption.employeeId);
        const reward = getReward(redemption.rewardId);
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
                  {employee?.name} - {reward?.name}
                </h3>
                <p className="mt-1 text-sm font-bold text-journey-steel">
                  {reward?.milesCost} miles
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  icon={Check}
                  variant="dark"
                  onClick={() =>
                    setItems((current) =>
                      current.map((item) =>
                        item.id === redemption.id
                          ? { ...item, status: "Approved" }
                          : item,
                      ),
                    )
                  }
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  icon={X}
                  variant="secondary"
                  onClick={() =>
                    setItems((current) =>
                      current.filter((item) => item.id !== redemption.id),
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
