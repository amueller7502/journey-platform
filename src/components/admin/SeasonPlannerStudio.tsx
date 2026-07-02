"use client";

import {
  Archive,
  CalendarPlus,
  Copy,
  Eye,
  Lock,
  Rocket,
  Save,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { ExperienceSeason, SeasonStatus } from "@/lib/types";

const editableStatusOptions: SeasonStatus[] = ["draft", "preview", "archived"];

const statusStyles: Record<SeasonStatus, string> = {
  active: "border-journey-red bg-journey-red text-journey-white",
  draft: "border-journey-line bg-journey-mist text-journey-black",
  preview: "border-journey-black bg-journey-black text-journey-white",
  archived: "border-journey-line bg-journey-white text-journey-steel",
};

function makeId(label: string) {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 12);

  return `${makeSlugId(label, "season")}-${suffix}`;
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
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
      const active = current.seasons.find((season) => season.active);
      const id = makeId("New Season");
      const createdAt = new Date().toISOString();
      const startDate = active ? addDays(active.endDate, 1) : "2026-09-01";
      const nextSeason: ExperienceSeason = {
        id,
        name: "Experience",
        subtitle: "Employee Experience Platform",
        seasonLabel: `Season ${current.seasons.length + 1}`,
        seasonTitle: "New Season",
        startDate,
        endDate: addDays(startDate, 27),
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
            What kind of employee experience do you want to create today? Draft future
            seasons, duplicate proven configurations, preview work before launch, and
            publish one active season at a time.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" icon={CalendarPlus} onClick={addSeason}>
              Create Draft Season
            </Button>
            {activeSeason ? (
              <Button
                type="button"
                variant="secondary"
                icon={Copy}
                onClick={() => duplicateSeason(activeSeason)}
              >
                Duplicate Active
              </Button>
            ) : null}
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
          {activeSeason ? (
            <span className="mt-3 inline-flex rounded-sm bg-journey-red px-2 py-1 text-xs font-black uppercase text-journey-white">
              Active
            </span>
          ) : null}
          <p className="mt-2 text-sm font-bold text-journey-steel">
            {activeSeason
              ? `${activeSeason.startDate} - ${activeSeason.endDate}`
              : "Publish a season before launch."}
          </p>
        </Panel>
      </div>

      <div className="grid gap-4">
        {seasons.map((season) => {
          const isActive = season.active || season.status === "active";
          const isArchived = season.status === "archived";
          const canEdit = !isActive && !isArchived;

          return (
          <Panel key={season.id} className={isActive ? "border-journey-red" : ""}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-sm border px-2 py-1 text-xs font-black uppercase ${statusStyles[season.status]}`}
                  >
                    {season.status}
                  </span>
                  {season.previewEnabled ? (
                    <span className="rounded-sm border border-journey-line bg-journey-white px-2 py-1 text-xs font-black uppercase text-journey-steel">
                      Preview enabled
                    </span>
                  ) : null}
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-journey-mist px-2 py-1 text-xs font-black uppercase text-journey-black">
                      <Lock className="h-3 w-3" aria-hidden="true" />
                      Live season protected
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-2 text-2xl font-black text-journey-black">
                  {season.seasonLabel}: {season.seasonTitle}
                </h3>
              </div>
              <p className="max-w-md text-sm font-bold leading-6 text-journey-steel">
                {isActive
                  ? "Duplicate this season to make changes for the future without altering the live Experience."
                  : isArchived
                    ? "Archived seasons stay available for reference and reporting."
                    : "Draft and preview seasons can be edited here before they are published."}
              </p>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr_auto]">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Product Name
                  <input
                    value={season.name}
                    onChange={(event) => updateSeason(season.id, { name: event.target.value })}
                    disabled={!canEdit}
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
                    disabled={!canEdit}
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
                    disabled={!canEdit}
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
                    disabled={!canEdit}
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
                    disabled={!canEdit}
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
                    disabled={!canEdit}
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
                    disabled={!canEdit}
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
                      disabled={!canEdit}
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
                      disabled={!canEdit}
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
                      disabled={!canEdit}
                      className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                    >
                      {(isActive ? ["active"] : editableStatusOptions).map((option) => (
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
                    disabled={!canEdit}
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
                  disabled={isArchived}
                  className="w-full"
                >
                  {season.previewEnabled ? "Disable Preview" : "Preview"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={Eye}
                  onClick={() => updateSeason(season.id, { status: "preview", previewEnabled: true })}
                  disabled={isActive || isArchived}
                  className="w-full"
                >
                  Mark Preview
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  icon={Rocket}
                  onClick={() => publishSeason(season.id)}
                  disabled={isActive || isArchived}
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
                  disabled={isActive || isArchived}
                  className="w-full"
                >
                  Archive
                </Button>
              </div>
            </div>
          </Panel>
          );
        })}
      </div>
    </div>
  );
}
