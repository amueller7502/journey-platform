"use client";

import { Palette, Plus, Power, Save, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { JourneySkin } from "@/lib/types";

const patternOptions: NonNullable<JourneySkin["patternStyle"]>[] = [
  "none",
  "film",
  "doodles",
  "waves",
  "marquee",
];
const backgroundOptions: NonNullable<JourneySkin["backgroundMode"]>[] = [
  "clean",
  "cinematic",
  "playful",
  "immersive",
];
const titleOptions: NonNullable<JourneySkin["titleTreatment"]>[] = [
  "clean",
  "marquee",
  "blockbuster",
  "handbill",
];
const cardOptions: NonNullable<JourneySkin["cardTreatment"]>[] = [
  "flat",
  "poster",
  "ticket",
  "lobby",
];
const frameOptions: NonNullable<JourneySkin["frameStyle"]>[] = [
  "standard",
  "filmstrip",
  "ticket-stub",
  "lightbox",
];

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
        patternStyle: "doodles",
        backgroundMode: "playful",
        animationIntensity: 50,
        funLevel: 70,
        doodleDensity: 60,
        titleTreatment: "handbill",
        cardTreatment: "ticket",
        frameStyle: "filmstrip",
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

  function removeSkin(id: string) {
    if (id === "standard") {
      return;
    }

    setSaved(false);
    const nextSkin = configuredSkins.find((skin) => skin.id !== id) ?? configuredSkins[0];
    setSelectedSkin(nextSkin?.id ?? "standard");
    updateState((current) => ({
      ...current,
      activeSkinId: current.activeSkinId === id ? "standard" : current.activeSkinId,
      skinEnabled: current.activeSkinId === id ? false : current.skinEnabled,
      skins: current.skins.filter((skin) => skin.id !== id),
    }));
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
              {selected.id !== "standard" ? (
                <Button
                  type="button"
                  variant="ghost"
                  icon={Trash2}
                  onClick={() => removeSkin(selected.id)}
                >
                  Delete Skin
                </Button>
              ) : null}
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

          <div className="grid gap-4 md:grid-cols-3">
            <SkinSelect
              label="Pattern Style"
              value={selected.patternStyle ?? "film"}
              options={patternOptions}
              onChange={(value) => updateSkin(selected.id, { patternStyle: value })}
            />
            <SkinSelect
              label="Background Mode"
              value={selected.backgroundMode ?? "cinematic"}
              options={backgroundOptions}
              onChange={(value) => updateSkin(selected.id, { backgroundMode: value })}
            />
            <SkinSelect
              label="Title Treatment"
              value={selected.titleTreatment ?? "clean"}
              options={titleOptions}
              onChange={(value) => updateSkin(selected.id, { titleTreatment: value })}
            />
            <SkinSelect
              label="Card Treatment"
              value={selected.cardTreatment ?? "poster"}
              options={cardOptions}
              onChange={(value) => updateSkin(selected.id, { cardTreatment: value })}
            />
            <SkinSelect
              label="Frame Style"
              value={selected.frameStyle ?? "filmstrip"}
              options={frameOptions}
              onChange={(value) => updateSkin(selected.id, { frameStyle: value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <SkinSlider
              label="Animation Intensity"
              value={selected.animationIntensity ?? 60}
              onChange={(value) => updateSkin(selected.id, { animationIntensity: value })}
            />
            <SkinSlider
              label="Fun Level"
              value={selected.funLevel ?? 50}
              onChange={(value) => updateSkin(selected.id, { funLevel: value })}
            />
            <SkinSlider
              label="Doodle Density"
              value={selected.doodleDensity ?? 20}
              onChange={(value) => updateSkin(selected.id, { doodleDensity: value })}
            />
          </div>

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
            className={`skin-preview-pattern skin-pattern-${selected.patternStyle ?? "film"} overflow-hidden rounded-lg border border-journey-line p-5 text-journey-white`}
            style={{
              background: `linear-gradient(135deg, ${selected.palette.deep ?? selected.palette.primary}, ${selected.palette.primary})`,
              "--skin-preview-density": `${(selected.doodleDensity ?? 20) / 100}`,
              "--skin-preview-speed": `${Math.max(5, 16 - (selected.animationIntensity ?? 50) / 8)}s`,
            } as CSSProperties}
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
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    selected.patternStyle,
                    selected.backgroundMode,
                    selected.titleTreatment,
                    selected.cardTreatment,
                    selected.frameStyle,
                  ].map((value) =>
                    value ? (
                      <span
                        key={value}
                        className="rounded-sm border border-journey-steel bg-journey-black/60 px-2 py-1 text-xs font-black uppercase text-journey-line"
                      >
                        {value}
                      </span>
                    ) : null,
                  )}
                </div>
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

function SkinSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-journey-black">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SkinSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-journey-black">
      <span className="flex items-center justify-between gap-3">
        {label}
        <span className="font-black text-journey-red">{value}</span>
      </span>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-journey-red"
      />
    </label>
  );
}
