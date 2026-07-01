"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { RewardCard } from "@/components/dashboard/RewardCard";
import { Button } from "@/components/ui/Button";
import { useJourneyState } from "@/lib/journey-state";
import type { Reward } from "@/lib/types";

const rewardCategories: Reward["category"][] = ["Food", "Cinema", "Gear", "Experience"];

export function RewardInventoryEditor({ initialRewards }: { initialRewards: Reward[] }) {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const catalog = state.rewards.length ? state.rewards : initialRewards;

  const activeRewards = useMemo(
    () => catalog.filter((reward) => reward.enabled).sort((a, b) => a.sortOrder - b.sortOrder),
    [catalog],
  );

  function updateReward(id: string, patch: Partial<Reward>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      rewards: current.rewards.map((reward) =>
        reward.id === id ? { ...reward, ...patch } : reward,
      ),
    }));
  }

  function addReward() {
    setSaved(false);
    updateState((current) => ({
      ...current,
      rewards: [
        ...current.rewards,
        {
          id: `reward-draft-${Date.now()}`,
          chapterId: initialRewards[0]?.chapterId ?? "chapter-one-odyssey",
          name: "New Reward",
          description: "Describe what the crew member receives.",
          milesCost: 100,
          inventoryCount: 5,
          imageUrl: "/brand/celebration-c-frame.png",
          category: "Experience",
          enabled: true,
          sortOrder: current.rewards.length * 10 + 10,
          redemptionLimitPerEmployee: 1,
          fulfillmentNotes: "Add pickup or approval notes.",
        },
      ],
    }));
  }

  function removeReward(id: string) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      rewards: current.rewards.filter((reward) => reward.id !== id),
    }));
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-journey-steel">
            Reward changes are saved to this configurable build and reflected in the
            employee Trading Post on this browser.
          </p>
          {saved ? (
            <p className="mt-2 text-sm font-black text-journey-red">
              Catalog changes saved in this browser session.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" icon={Plus} onClick={addReward}>
            Add Reward
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Catalog
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
              <th className="py-3 pr-3">Enabled</th>
              <th className="py-3 pr-3">Reward</th>
              <th className="py-3 pr-3">Description</th>
              <th className="py-3 pr-3">Miles</th>
              <th className="py-3 pr-3">Stock</th>
              <th className="py-3 pr-3">Category</th>
              <th className="py-3 pr-3">Image URL</th>
              <th className="py-3 pr-3">Spotlight</th>
              <th className="py-3 pr-3">Remove</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map((reward) => (
              <tr key={reward.id} className="border-b border-journey-line align-top">
                <td className="py-3 pr-3">
                  <input
                    aria-label={`Enable ${reward.name}`}
                    type="checkbox"
                    checked={reward.enabled}
                    onChange={(event) =>
                      updateReward(reward.id, { enabled: event.currentTarget.checked })
                    }
                    className="h-5 w-5 accent-journey-red"
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    value={reward.name}
                    onChange={(event) => updateReward(reward.id, { name: event.target.value })}
                    className="focus-ring min-h-10 w-full rounded-md border border-journey-line px-3 font-bold"
                  />
                </td>
                <td className="py-3 pr-3">
                  <textarea
                    value={reward.description}
                    onChange={(event) =>
                      updateReward(reward.id, { description: event.target.value })
                    }
                    className="focus-ring min-h-20 w-full rounded-md border border-journey-line px-3 py-2 text-sm"
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    type="number"
                    min="1"
                    value={reward.milesCost}
                    onChange={(event) =>
                      updateReward(reward.id, {
                        milesCost: Math.max(1, Number(event.target.value)),
                      })
                    }
                    className="focus-ring min-h-10 w-24 rounded-md border border-journey-line px-3 font-black"
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    type="number"
                    min="0"
                    value={reward.inventoryCount}
                    onChange={(event) =>
                      updateReward(reward.id, {
                        inventoryCount: Math.max(0, Number(event.target.value)),
                      })
                    }
                    className="focus-ring min-h-10 w-24 rounded-md border border-journey-line px-3 font-black"
                  />
                </td>
                <td className="py-3 pr-3">
                  <select
                    value={reward.category}
                    onChange={(event) =>
                      updateReward(reward.id, {
                        category: event.target.value as Reward["category"],
                      })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 font-bold"
                  >
                    {rewardCategories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 pr-3">
                  <input
                    value={reward.imageUrl}
                    onChange={(event) =>
                      updateReward(reward.id, { imageUrl: event.target.value })
                    }
                    className="focus-ring min-h-10 w-full min-w-64 rounded-md border border-journey-line px-3 text-sm"
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    aria-label={`Spotlight ${reward.name}`}
                    type="checkbox"
                    checked={Boolean(reward.spotlight)}
                    onChange={(event) =>
                      updateReward(reward.id, { spotlight: event.currentTarget.checked })
                    }
                    className="h-5 w-5 accent-journey-red"
                  />
                </td>
                <td className="py-3 pr-3">
                  <Button
                    type="button"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => removeReward(reward.id)}
                    aria-label={`Remove ${reward.name}`}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-3 text-xs font-black uppercase text-journey-red">
          Trading Post Preview
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {activeRewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      </div>
    </div>
  );
}
