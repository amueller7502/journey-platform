"use client";

import { Archive, Copy, Eye, Plus, Rocket, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { ExperienceSeason, SeasonStatus } from "@/lib/types";

const statusOptions: SeasonStatus[] = ["draft", "preview", "active", "archived"];

function makeId(label: string) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 12);

  return `${makeSlugId(label, "season")}-${suffix}`;
}

export function SeasonPlannerStudio() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const seasons = state.seasons.slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
  const activeSeason = seasons.find((season) => season.active);

  function updateSeason(id: string, patch: Partial<ExperienceSeason>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      seasons: current.seasons.map((season) =>
        season.id === id
          ? {
              ...season,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : season,
      ),
    }));
  }

  function addSeason() {
    setSaved(false);
    updateState((current) => {
      const id = makeId("New Season");
      const createdAt = new Date().toISOString();
      const nextSeason: ExperienceSeason = {
        id,
        name: "Experience",
        subtitle: "Employee Experience Platform",
        seasonLabel: `Season ${current.seasons.length + 1}`,
        seasonTitle: "New Season",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        communityXpGoal: 12000,
        welcomeMessage: "Recognize the moments that shape the employee experience.",
        tagline: "More Than A Movie Starts With Us.",
        heroArtworkUrl: "",
        experienceCardArtworkUrl: "",
        skinId: current.activeSkinId,
        status: "draft",
        active: false,
        previewEnabled: false,
        createdAt,
        updatedAt: createdAt,
      };

      return {
        ...current,
        seasons: [...current.seasons, nextSeason],
      };
    });
  }

  function duplicateSeason(season: ExperienceSeason) {
    setSaved(false);
    updateState((current) => {
      const createdAt = new Date().toISOString();
      const copy: ExperienceSeason = {
        ...season,
        id: makeId(`${season.seasonTitle} Copy`),
        seasonLabel: `${season.seasonLabel} Copy`,
        seasonTitle: `${season.seasonTitle} Copy`,
        status: "draft",
        active: false,
        previewEnabled: true,
        createdAt,
        updatedAt: createdAt,
      };

      return {
        ...current,
        seasons: [...current.seasons, copy],
      };
    });
  }

  function publishSeason(id: string) {
    setSaved(false);
    updateState((current) => {
      const seasonToPublish = current.seasons.find((season) => season.id === id);
      if (!seasonToPublish) {
        return current;
      }

      return {
        ...current,
        chapter: {
          ...current.chapter,
          chapterNumber: seasonToPublish.seasonLabel,
          chapterTitle: seasonToPublish.seasonTitle,
          seasonNumber: seasonToPublish.seasonLabel,
          seasonTitle: seasonToPublish.seasonTitle,
          startDate: seasonToPublish.startDate,
          endDate: seasonToPublish.endDate,
          communityGoalMiles: seasonToPublish.communityXpGoal,
          phrase: seasonToPublish.tagline,
          visualTagline: seasonToPublish.tagline,
          tagline: seasonToPublish.tagline,
          active: true,
        },
        activeSkinId: seasonToPublish.skinId,
        skinEnabled: seasonToPublish.skinId !== "standard",
        seasons: current.seasons.map((season) => ({
          ...season,
          active: season.id === id,
          status: season.id === id ? "active" : season.status === "active" ? "archived" : season.status,
          updatedAt: new Date().toISOString(),
        })),
      };
    });
  }

  function archiveSeason(id: string) {
    updateSeason(id, { status: "archived", active: false, previewEnabled: false });
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel className="bg-journey-black text-journey-white lg:col-span-2">
          <PanelHeader title="Season Planner" eyebrow="Unlimited seasons" />
          <p className="max-w-3xl text-sm font-bold leading-6 text-journey-line">
            Create future seasons, duplicate proven configurations, preview work before launch,
            and publish one active season at a time. Nothing that defines culture should require
            software development.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" icon={Plus} onClick={addSeason}>
              Create Season
            </Button>
            <Button type="button" variant="secondary" icon={Save} onClick={() => setSaved(true)}>
              Save Planner
            </Button>
          </div>
          {saved ? (
            <p className="mt-3 text-sm font-black text-journey-red">Season Planner saved.</p>
          ) : null}
        </Panel>
        <Panel>
          <PanelHeader title="Active Season" eyebrow="One live season" />
          <p className="text-2xl font-black text-journey-black">
            {activeSeason?.seasonTitle ?? "None"}
          </p>
          <p className="mt-2 text-sm font-bold text-journey-steel">
            {activeSeason
              ? `${activeSeason.startDate} - ${activeSeason.endDate}`
              : "Publish a season before launch."}
          </p>
        </Panel>
      </div>

      <div className="grid gap-4">
        {seasons.map((season) => (
          <Panel key={season.id}>
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr_auto]">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Product Name
                  <input
                    value={season.name}
                    onChange={(event) => updateSeason(season.id, { name: event.target.value })}
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Subtitle
                  <input
                    value={season.subtitle}
                    onChange={(event) =>
                      updateSeason(season.id, { subtitle: event.target.value })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Season Label
                  <input
                    value={season.seasonLabel}
                    onChange={(event) =>
                      updateSeason(season.id, { seasonLabel: event.target.value })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Season Title
                  <input
                    value={season.seasonTitle}
                    onChange={(event) =>
                      updateSeason(season.id, { seasonTitle: event.target.value })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Start Date
                  <input
                    type="date"
                    value={season.startDate}
                    onChange={(event) =>
                      updateSeason(season.id, { startDate: event.target.value })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  End Date
                  <input
                    type="date"
                    value={season.endDate}
                    onChange={(event) =>
                      updateSeason(season.id, { endDate: event.target.value })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                  />
                </label>
              </div>

              <div className="grid gap-3">
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Welcome Message
                  <textarea
                    value={season.welcomeMessage}
                    onChange={(event) =>
                      updateSeason(season.id, { welcomeMessage: event.target.value })
                    }
                    className="focus-ring min-h-24 rounded-md border border-journey-line px-3 py-2 text-sm text-journey-black"
                  />
                </label>
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                    XP Goal
                    <input
                      type="number"
                      min="1"
                      value={season.communityXpGoal}
                      onChange={(event) =>
                        updateSeason(season.id, {
                          communityXpGoal: Math.max(1, Number(event.target.value)),
                        })
                      }
                      className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                    Skin
                    <select
                      value={season.skinId}
                      onChange={(event) =>
                        updateSeason(season.id, { skinId: event.target.value })
                      }
                      className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                    >
                      {state.skins.map((skin) => (
                        <option key={skin.id} value={skin.id}>
                          {skin.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                    Status
                    <select
                      value={season.status}
                      onChange={(event) =>
                        updateSeason(season.id, { status: event.target.value as SeasonStatus })
                      }
                      className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Tagline
                  <input
                    value={season.tagline}
                    onChange={(event) =>
                      updateSeason(season.id, { tagline: event.target.value })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-start gap-2 xl:w-44 xl:flex-col">
                <Button
                  type="button"
                  variant={season.previewEnabled ? "dark" : "secondary"}
                  icon={season.previewEnabled ? ToggleRight : ToggleLeft}
                  onClick={() =>
                    updateSeason(season.id, { previewEnabled: !season.previewEnabled })
                  }
                  className="w-full"
                >
                  Preview
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={Eye}
                  onClick={() => updateSeason(season.id, { status: "preview" })}
                  className="w-full"
                >
                  Mark Preview
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  icon={Rocket}
                  onClick={() => publishSeason(season.id)}
                  className="w-full"
                >
                  Publish
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={Copy}
                  onClick={() => duplicateSeason(season)}
                  className="w-full"
                >
                  Duplicate
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  icon={Archive}
                  onClick={() => archiveSeason(season.id)}
                  className="w-full"
                >
                  Archive
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
