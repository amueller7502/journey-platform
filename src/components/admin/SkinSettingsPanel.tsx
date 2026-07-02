"use client";

import { Palette, Plus, Power, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { JourneySkin } from "@/lib/types";

export function SkinSettingsPanel({
  skins,
  activeSkinId,
}: {
  skins?: JourneySkin[];
  activeSkinId?: string;
}) {
  const { state, updateState } = useJourneyState();
  const configuredSkins = state.skins.length ? state.skins : skins ?? [];
  const configuredActiveSkinId = activeSkinId ?? state.activeSkinId;
  const [selectedSkin, setSelectedSkin] = useState<string>(
    state.activeSkinId ?? configuredActiveSkinId,
  );
  const [saved, setSaved] = useState(false);

  const selected =
    configuredSkins.find((skin) => skin.id === selectedSkin) ??
    configuredSkins[0];

  function updateSkin(id: string, patch: Partial<JourneySkin>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      skins: current.skins.map((skin) => (skin.id === id ? { ...skin, ...patch } : skin)),
    }));
  }

  function updatePalette(id: string, key: keyof JourneySkin["palette"], color: string) {
    const skin = configuredSkins.find((item) => item.id === id);
    if (!skin) {
      return;
    }

    updateSkin(id, {
      palette: {
        ...skin.palette,
        [key]: color,
      },
    });
  }

  function addSkin() {
    setSaved(false);
    updateState((current) => {
      const id = `${makeSlugId("New Chapter Skin", "chapter_skin")}-${Date.now()}`;
      const nextSkin: JourneySkin = {
        id,
        name: "New Chapter Skin",
        status: "draft",
        description: "Reusable chapter visual package.",
        canDisable: true,
        tvTreatment: "Draft display treatment",
        headline: "Chapter Headline",
        visualDirection: "Describe the skin's cinematic world and UI tone.",
        motionStyle: "Describe motion cues for TV and hero surfaces.",
        texture: "Describe grain, frames, light, or environmental texture.",
        builderNotes: "Internal creative notes for this skin.",
        palette: {
          primary: "#050505",
          secondary: "#ffffff",
          accent: "#d71920",
          foil: "#d71920",
          deep: "#050505",
        },
      };

      setSelectedSkin(id);
      return {
        ...current,
        skins: [...current.skins, nextSkin],
      };
    });
  }

  function setActiveSkin(id: string) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      activeSkinId: id,
      skinEnabled: id !== "standard",
      skins: current.skins.map((skin) => ({
        ...skin,
        status: skin.id === id ? "active" : skin.status === "active" ? "available" : skin.status,
      })),
    }));
    setSelectedSkin(id);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-journey-steel">
            Skin Developer controls chapter-level visual packages. Turn skins off for
            the clean Cinema Standard experience, or draft future chapters like Dune 3.
          </p>
          {saved ? (
            <p className="mt-2 text-sm font-black text-journey-red">
              Skin configuration saved.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" icon={Plus} onClick={addSkin}>
            Add Skin
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Skin
          </Button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {configuredSkins.map((skin) => {
          const selectedCard = skin.id === selectedSkin;
          return (
            <button
              key={skin.id}
              type="button"
              onClick={() => {
                setSelectedSkin(skin.id);
                setSaved(false);
              }}
              className={`focus-ring rounded-lg border p-4 text-left transition ${
                selectedCard
                  ? "border-journey-red bg-journey-black text-journey-white"
                  : "border-journey-line bg-journey-white text-journey-black hover:bg-journey-mist"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-journey-red">
                    {skin.status}
                  </p>
                  <h3 className="mt-1 text-lg font-black">{skin.name}</h3>
                </div>
                <Palette className="h-5 w-5 text-journey-red" aria-hidden="true" />
              </div>
              <p
                className={`mt-3 text-sm leading-6 ${
                  selectedCard ? "text-journey-line" : "text-journey-steel"
                }`}
              >
                {skin.description}
              </p>
              <div className="mt-4 flex gap-2">
                {Object.entries(skin.palette).map(([name, color]) => (
                  <span
                    key={name}
                    className="h-6 w-10 rounded-sm border border-journey-line"
                    style={{ backgroundColor: color }}
                    title={name}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="grid gap-4 rounded-lg border border-journey-line p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-journey-red">
                Skin Developer
              </p>
              <h3 className="mt-1 text-xl font-black text-journey-black">
                {selected.name}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={state.activeSkinId === selected.id ? "dark" : "secondary"}
                icon={state.activeSkinId === selected.id ? ToggleRight : ToggleLeft}
                onClick={() => setActiveSkin(selected.id)}
              >
                {state.activeSkinId === selected.id ? "Active" : "Set Active"}
              </Button>
              <Button
                type="button"
                variant={state.skinEnabled ? "dark" : "secondary"}
                icon={Power}
                onClick={() => {
                  setSaved(false);
                  updateState((current) => ({
                    ...current,
                    skinEnabled: !current.skinEnabled,
                  }));
                }}
              >
                {state.skinEnabled ? "Disable Skin" : "Enable Skin"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Skin Name
              <input
                value={selected.name}
                onChange={(event) => updateSkin(selected.id, { name: event.target.value })}
                className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Status
              <select
                value={selected.status}
                onChange={(event) =>
                  updateSkin(selected.id, {
                    status: event.target.value as JourneySkin["status"],
                  })
                }
                className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
              >
                <option value="active">active</option>
                <option value="available">available</option>
                <option value="draft">draft</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Description
            <textarea
              value={selected.description}
              onChange={(event) =>
                updateSkin(selected.id, { description: event.target.value })
              }
              rows={3}
              className="focus-ring resize-none rounded-md border border-journey-line px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-journey-black">
            TV Treatment
            <input
              value={selected.tvTreatment}
              onChange={(event) =>
                updateSkin(selected.id, { tvTreatment: event.target.value })
              }
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Hero / TV Headline
              <input
                value={selected.headline ?? ""}
                onChange={(event) =>
                  updateSkin(selected.id, { headline: event.target.value })
                }
                className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Motion Style
              <input
                value={selected.motionStyle ?? ""}
                onChange={(event) =>
                  updateSkin(selected.id, { motionStyle: event.target.value })
                }
                className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Visual Direction
            <textarea
              value={selected.visualDirection ?? ""}
              onChange={(event) =>
                updateSkin(selected.id, { visualDirection: event.target.value })
              }
              rows={3}
              className="focus-ring resize-none rounded-md border border-journey-line px-3 py-2"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Texture
              <textarea
                value={selected.texture ?? ""}
                onChange={(event) =>
                  updateSkin(selected.id, { texture: event.target.value })
                }
                rows={3}
                className="focus-ring resize-none rounded-md border border-journey-line px-3 py-2"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Builder Notes
              <textarea
                value={selected.builderNotes ?? ""}
                onChange={(event) =>
                  updateSkin(selected.id, { builderNotes: event.target.value })
                }
                rows={3}
                className="focus-ring resize-none rounded-md border border-journey-line px-3 py-2"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {(["primary", "secondary", "accent", "foil", "deep"] as const).map((key) => (
              <label key={key} className="grid gap-2 text-sm font-bold text-journey-black">
                {key}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selected.palette[key] ?? "#050505"}
                    onChange={(event) => updatePalette(selected.id, key, event.target.value)}
                    className="h-10 w-14 rounded-md border border-journey-line"
                  />
                  <input
                    value={selected.palette[key] ?? ""}
                    onChange={(event) => updatePalette(selected.id, key, event.target.value)}
                    className="focus-ring min-h-10 min-w-0 flex-1 rounded-md border border-journey-line px-3 font-mono text-sm"
                  />
                </div>
              </label>
            ))}
          </div>

          <div
            className="overflow-hidden rounded-lg border border-journey-line p-5 text-journey-white"
            style={{
              background: `linear-gradient(135deg, ${selected.palette.deep ?? selected.palette.primary}, ${selected.palette.primary})`,
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p
                  className="text-xs font-black uppercase"
                  style={{ color: selected.palette.accent }}
                >
                  Skin Preview
                </p>
                <h3 className="mt-2 text-4xl font-black">
                  {selected.headline || selected.name}
                </h3>
                <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-journey-line">
                  {selected.visualDirection || selected.description}
                </p>
              </div>
              <div
                className="rounded-md border px-4 py-3 text-right"
                style={{ borderColor: selected.palette.foil ?? selected.palette.accent }}
              >
                <p className="text-xs font-black uppercase text-journey-line">
                  Motion
                </p>
                <p className="mt-1 text-lg font-black">
                  {selected.motionStyle || "Standard fades"}
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-journey-line p-4 text-sm font-bold text-journey-black">
            <input
              type="checkbox"
              checked={selected.canDisable}
              onChange={(event) =>
                updateSkin(selected.id, { canDisable: event.currentTarget.checked })
              }
              className="h-5 w-5 accent-journey-red"
            />
            Can be disabled for standard platform mode
          </label>
        </div>
      ) : null}

      <div className="rounded-lg border border-journey-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              Active Preview
            </p>
            <h3 className="mt-1 text-xl font-black text-journey-black">
              {state.skinEnabled ? selected?.name : "Cinema Standard"}
            </h3>
            <p className="mt-2 text-sm font-bold text-journey-steel">
              TV treatment: {state.skinEnabled ? selected?.tvTreatment : "Skin disabled"}
            </p>
          </div>
          <Button
            type="button"
            variant={state.skinEnabled ? "dark" : "secondary"}
            icon={Power}
            onClick={() => {
              setSaved(false);
              updateState((current) => ({
                ...current,
                skinEnabled: !current.skinEnabled,
              }));
            }}
          >
            {state.skinEnabled ? "Disable Skin" : "Enable Skin"}
          </Button>
        </div>
      </div>
    </div>
  );
}
