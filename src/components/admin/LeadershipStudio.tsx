"use client";

import { Plus, Save, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type {
  LeadershipPointRule,
  LeadershipRecognitionCategory,
  LeadershipReward,
} from "@/lib/types";

const categoryOptions: LeadershipRecognitionCategory[] = [
  "Coaching",
  "Coverage",
  "Communication",
  "Guest Recovery",
  "Operational Leadership",
];

const rewardCollections: NonNullable<LeadershipReward["collection"]>[] = [
  "Everyday Leadership",
  "Professional Development",
  "Premium",
  "Leadership Experiences",
  "Season Exclusives",
];

function makeConfigId(label: string) {
  return `${makeSlugId(label, "leadership_config")}-${new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 12)}`;
}

export function LeadershipStudio() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const rules = state.leadershipPointRules.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const rewards = state.leadershipRewards
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  function updateRule(id: string, patch: Partial<LeadershipPointRule>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      leadershipPointRules: current.leadershipPointRules.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : rule,
      ),
    }));
  }

  function updateReward(id: string, patch: Partial<LeadershipReward>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      leadershipRewards: current.leadershipRewards.map((reward) =>
        reward.id === id
          ? {
              ...reward,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : reward,
      ),
    }));
  }

  function addRule() {
    setSaved(false);
    updateState((current) => {
      const createdAt = new Date().toISOString();
      const name = "New Leadership Point Rule";
      const nextOrder =
        Math.max(0, ...current.leadershipPointRules.map((rule) => rule.sortOrder)) + 10;
      const rule: LeadershipPointRule = {
        id: makeConfigId(name),
        name,
        description: "Describe the leadership behavior that should earn LP.",
        lpValue: 5,
        category: "Coaching",
        requiresNote: true,
        lifecycle: "draft",
        enabled: true,
        sortOrder: nextOrder,
        seasonId: current.chapter.id,
        createdAt,
        updatedAt: createdAt,
      };

      return {
        ...current,
        leadershipPointRules: [...current.leadershipPointRules, rule],
      };
    });
  }

  function addReward() {
    setSaved(false);
    updateState((current) => {
      const createdAt = new Date().toISOString();
      const reward: LeadershipReward = {
        id: makeConfigId("New Leadership Reward"),
        name: "New Leadership Reward",
        description: "Describe the reward for leadership behavior.",
        status: "available",
        fulfillmentNotes: "Define fulfillment requirements.",
        lpCost: 50,
        collection: "Everyday Leadership",
        enabled: true,
        sortOrder: Math.max(0, ...current.leadershipRewards.map((item) => item.sortOrder ?? 0)) + 10,
        lifecycle: "draft",
        seasonId: current.chapter.id,
        createdAt,
        updatedAt: createdAt,
      };

      return {
        ...current,
        leadershipRewards: [...current.leadershipRewards, reward],
      };
    });
  }

  function deleteRule(id: string) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      leadershipPointRules: current.leadershipPointRules.filter((rule) => rule.id !== id),
    }));
  }

  function deleteReward(id: string) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      leadershipRewards: current.leadershipRewards.filter((reward) => reward.id !== id),
    }));
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-journey-line bg-journey-black p-5 text-journey-white shadow-line">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">Leadership Studio</p>
            <h2 className="mt-1 text-3xl font-black">LP is separate from employee XP</h2>
            <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-journey-line">
              Leaders do not earn employee XP. Leadership Studio configures LP rules,
              leadership rewards, coaching signals, and the behaviors that strengthen the
              Employee Experience.
            </p>
          </div>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Leadership Studio
          </Button>
        </div>
        {saved ? (
          <p className="mt-3 text-sm font-black text-journey-red">Leadership Studio saved.</p>
        ) : null}
      </section>

      <section className="rounded-lg border border-journey-line bg-journey-white p-5 shadow-line">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">Leadership Points</p>
            <h2 className="text-xl font-black text-journey-black">LP Rules</h2>
          </div>
          <Button type="button" variant="secondary" icon={Plus} onClick={addRule}>
            Add LP Rule
          </Button>
        </div>
        <div className="mt-4 grid gap-3">
          {rules.map((rule) => (
            <article
              key={rule.id}
              className="grid gap-4 rounded-lg border border-journey-line p-4 xl:grid-cols-[140px_1fr_320px_auto]"
            >
              <Button
                type="button"
                variant={rule.enabled ? "dark" : "secondary"}
                icon={rule.enabled ? ToggleRight : ToggleLeft}
                onClick={() => updateRule(rule.id, { enabled: !rule.enabled })}
                className="self-start"
              >
                {rule.enabled ? "Enabled" : "Disabled"}
              </Button>
              <div className="grid gap-3">
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Rule Name
                  <input
                    value={rule.name}
                    onChange={(event) => updateRule(rule.id, { name: event.target.value })}
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Description
                  <textarea
                    value={rule.description}
                    onChange={(event) =>
                      updateRule(rule.id, { description: event.target.value })
                    }
                    className="focus-ring min-h-20 rounded-md border border-journey-line px-3 py-2 text-sm text-journey-black"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  LP Value
                  <input
                    type="number"
                    min="0"
                    value={rule.lpValue}
                    onChange={(event) =>
                      updateRule(rule.id, { lpValue: Math.max(0, Number(event.target.value)) })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Category
                  <select
                    value={rule.category}
                    onChange={(event) =>
                      updateRule(rule.id, {
                        category: event.target.value as LeadershipRecognitionCategory,
                      })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <Button
                  type="button"
                  variant={rule.requiresNote ? "dark" : "secondary"}
                  onClick={() => updateRule(rule.id, { requiresNote: !rule.requiresNote })}
                >
                  {rule.requiresNote ? "Note Required" : "Note Optional"}
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                icon={Trash2}
                onClick={() => deleteRule(rule.id)}
                className="self-start"
              >
                Delete
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-journey-line bg-journey-white p-5 shadow-line">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">Leadership Rewards</p>
            <h2 className="text-xl font-black text-journey-black">LP Reward Collections</h2>
          </div>
          <Button type="button" variant="secondary" icon={Plus} onClick={addReward}>
            Add Leadership Reward
          </Button>
        </div>
        <div className="mt-4 grid gap-3">
          {rewards.map((reward) => (
            <article
              key={reward.id}
              className="grid gap-4 rounded-lg border border-journey-line p-4 xl:grid-cols-[140px_1fr_320px_auto]"
            >
              <Button
                type="button"
                variant={reward.enabled !== false ? "dark" : "secondary"}
                icon={reward.enabled !== false ? ToggleRight : ToggleLeft}
                onClick={() => updateReward(reward.id, { enabled: reward.enabled === false })}
                className="self-start"
              >
                {reward.enabled !== false ? "Enabled" : "Disabled"}
              </Button>
              <div className="grid gap-3">
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Reward Name
                  <input
                    value={reward.name}
                    onChange={(event) => updateReward(reward.id, { name: event.target.value })}
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Description
                  <textarea
                    value={reward.description}
                    onChange={(event) =>
                      updateReward(reward.id, { description: event.target.value })
                    }
                    className="focus-ring min-h-20 rounded-md border border-journey-line px-3 py-2 text-sm text-journey-black"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  LP Cost
                  <input
                    type="number"
                    min="0"
                    value={reward.lpCost ?? 50}
                    onChange={(event) =>
                      updateReward(reward.id, { lpCost: Math.max(0, Number(event.target.value)) })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Collection
                  <select
                    value={reward.collection ?? "Everyday Leadership"}
                    onChange={(event) =>
                      updateReward(reward.id, {
                        collection: event.target.value as NonNullable<
                          LeadershipReward["collection"]
                        >,
                      })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                  >
                    {rewardCollections.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel sm:col-span-2">
                  Fulfillment Notes
                  <textarea
                    value={reward.fulfillmentNotes}
                    onChange={(event) =>
                      updateReward(reward.id, { fulfillmentNotes: event.target.value })
                    }
                    className="focus-ring min-h-20 rounded-md border border-journey-line px-3 py-2 text-sm text-journey-black"
                  />
                </label>
              </div>
              <Button
                type="button"
                variant="ghost"
                icon={Trash2}
                onClick={() => deleteReward(reward.id)}
                className="self-start"
              >
                Delete
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
