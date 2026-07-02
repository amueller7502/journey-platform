"use client";

import { Plus, Save, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type {
  ConfigLifecycle,
  ExperienceAchievement,
  ExperienceAchievementAudience,
} from "@/lib/types";

const audienceOptions: ExperienceAchievementAudience[] = ["employee", "leader"];
const lifecycleOptions: ConfigLifecycle[] = ["draft", "published", "archived"];

function makeAchievementId(title: string) {
  return `${makeSlugId(title, "achievement")}-${new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 12)}`;
}

export function AchievementsStudio() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const achievements = state.experienceAchievements
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function updateAchievement(id: string, patch: Partial<ExperienceAchievement>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      experienceAchievements: current.experienceAchievements.map((achievement) =>
        achievement.id === id
          ? {
              ...achievement,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : achievement,
      ),
    }));
  }

  function addAchievement(audience: ExperienceAchievementAudience) {
    setSaved(false);
    updateState((current) => {
      const createdAt = new Date().toISOString();
      const title = audience === "leader" ? "New Leadership Achievement" : "New Employee Badge";
      const nextOrder =
        Math.max(0, ...current.experienceAchievements.map((achievement) => achievement.sortOrder)) +
        10;
      const achievement: ExperienceAchievement = {
        id: makeAchievementId(title),
        audience,
        title,
        description: "Describe the achievement and why it matters.",
        collection: audience === "leader" ? "Leadership Achievements" : "Season Badges",
        hidden: false,
        badgeImageUrl: "/brand/celebration-c-frame.png",
        criteria: "Define how this achievement is earned.",
        lifecycle: "draft",
        enabled: true,
        sortOrder: nextOrder,
        seasonId: current.chapter.id,
        createdAt,
        updatedAt: createdAt,
      };

      return {
        ...current,
        experienceAchievements: [...current.experienceAchievements, achievement],
      };
    });
  }

  function deleteAchievement(id: string) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      experienceAchievements: current.experienceAchievements.filter(
        (achievement) => achievement.id !== id,
      ),
    }));
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-sm font-bold leading-6 text-journey-steel">
          Achievements give seasons a sense of memory without turning Experience into a game.
          Configure employee badges, leadership achievements, hidden achievements, and collections.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={() => addAchievement("employee")}
          >
            Add Employee Badge
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={() => addAchievement("leader")}
          >
            Add Leader Achievement
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Achievements
          </Button>
        </div>
      </div>
      {saved ? (
        <p className="text-sm font-black text-journey-red">Achievements Studio saved.</p>
      ) : null}

      <div className="grid gap-3">
        {achievements.map((achievement) => (
          <article
            key={achievement.id}
            className="grid gap-4 rounded-lg border border-journey-line bg-journey-white p-4 xl:grid-cols-[150px_1fr_340px_auto]"
          >
            <div className="grid content-start gap-2">
              <Button
                type="button"
                variant={achievement.enabled ? "dark" : "secondary"}
                icon={achievement.enabled ? ToggleRight : ToggleLeft}
                onClick={() =>
                  updateAchievement(achievement.id, { enabled: !achievement.enabled })
                }
              >
                {achievement.enabled ? "Enabled" : "Disabled"}
              </Button>
              <Button
                type="button"
                variant={achievement.hidden ? "dark" : "secondary"}
                onClick={() => updateAchievement(achievement.id, { hidden: !achievement.hidden })}
              >
                {achievement.hidden ? "Hidden" : "Visible"}
              </Button>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Title
                  <input
                    value={achievement.title}
                    onChange={(event) =>
                      updateAchievement(achievement.id, { title: event.target.value })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Collection
                  <input
                    value={achievement.collection}
                    onChange={(event) =>
                      updateAchievement(achievement.id, { collection: event.target.value })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
              </div>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Description
                <textarea
                  value={achievement.description}
                  onChange={(event) =>
                    updateAchievement(achievement.id, { description: event.target.value })
                  }
                  className="focus-ring min-h-20 rounded-md border border-journey-line px-3 py-2 text-sm text-journey-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Criteria
                <textarea
                  value={achievement.criteria}
                  onChange={(event) =>
                    updateAchievement(achievement.id, { criteria: event.target.value })
                  }
                  className="focus-ring min-h-20 rounded-md border border-journey-line px-3 py-2 text-sm text-journey-black"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Audience
                <select
                  value={achievement.audience}
                  onChange={(event) =>
                    updateAchievement(achievement.id, {
                      audience: event.target.value as ExperienceAchievementAudience,
                    })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                >
                  {audienceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Lifecycle
                <select
                  value={achievement.lifecycle}
                  onChange={(event) =>
                    updateAchievement(achievement.id, {
                      lifecycle: event.target.value as ConfigLifecycle,
                    })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                >
                  {lifecycleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Badge Image
                <input
                  value={achievement.badgeImageUrl}
                  onChange={(event) =>
                    updateAchievement(achievement.id, { badgeImageUrl: event.target.value })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                />
              </label>
            </div>

            <Button
              type="button"
              variant="ghost"
              icon={Trash2}
              onClick={() => deleteAchievement(achievement.id)}
              className="self-start"
            >
              Delete
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
