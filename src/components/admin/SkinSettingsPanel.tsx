"use client";

import { Palette, Power, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { JourneySkin, SkinId } from "@/lib/types";

export function SkinSettingsPanel({
  skins,
  activeSkinId,
}: {
  skins: JourneySkin[];
  activeSkinId: SkinId;
}) {
  const [selectedSkin, setSelectedSkin] = useState(activeSkinId);
  const [skinEnabled, setSkinEnabled] = useState(activeSkinId !== "standard");
  const [saved, setSaved] = useState(false);

  const selected = skins.find((skin) => skin.id === selectedSkin) ?? skins[0];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-journey-steel">
          Skins are chapter-level visual packages. Turning the chapter skin off returns
          the platform to the clean Cinema Standard look.
        </p>
        <Button type="button" icon={Save} onClick={() => setSaved(true)}>
          Save Skin
        </Button>
      </div>

      {saved ? (
        <p className="rounded-lg border border-journey-line bg-journey-mist p-3 text-sm font-black text-journey-black">
          Skin choice saved in this browser session. Supabase persistence is modeled
          with `skins` and `chapter_skin_settings`.
        </p>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-3">
        {skins.map((skin) => {
          const selectedCard = skin.id === selectedSkin;
          return (
            <button
              key={skin.id}
              type="button"
              onClick={() => {
                setSelectedSkin(skin.id);
                setSaved(false);
                setSkinEnabled(skin.id !== "standard");
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

      <div className="rounded-lg border border-journey-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              Active Preview
            </p>
            <h3 className="mt-1 text-xl font-black text-journey-black">
              {skinEnabled ? selected.name : "Cinema Standard"}
            </h3>
            <p className="mt-2 text-sm font-bold text-journey-steel">
              TV treatment: {skinEnabled ? selected.tvTreatment : "Skin disabled"}
            </p>
          </div>
          <Button
            type="button"
            variant={skinEnabled ? "dark" : "secondary"}
            icon={Power}
            onClick={() => {
              setSkinEnabled((current) => !current);
              setSaved(false);
            }}
          >
            {skinEnabled ? "Disable Skin" : "Enable Skin"}
          </Button>
        </div>
      </div>
    </div>
  );
}
