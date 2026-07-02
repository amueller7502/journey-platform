"use client";

import { Plus, Save, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { TvPanelSetting } from "@/lib/types";

export function TvDisplaySettingsPanel() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const panels = state.tvPanelSettings.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  function updatePanel(id: string, patch: Partial<TvPanelSetting>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      tvPanelSettings: current.tvPanelSettings.map((panel) =>
        panel.id === id ? { ...panel, ...patch } : panel,
      ),
    }));
  }

  function addPanel() {
    setSaved(false);
    updateState((current) => {
      const label = "Custom TV Slide";
      const nextOrder =
        Math.max(0, ...current.tvPanelSettings.map((panel) => panel.sortOrder)) + 1;
      return {
        ...current,
        tvPanelSettings: [
          ...current.tvPanelSettings,
          {
            id: `${makeSlugId(label, "tv_slide")}-${Date.now()}`,
            label,
            enabled: true,
            sortOrder: nextOrder,
            seconds: 7,
          },
        ],
      };
    });
  }

  function deletePanel(id: string) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      tvPanelSettings: current.tvPanelSettings.filter((panel) => panel.id !== id),
    }));
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-journey-steel">
          These controls drive the `/tv` loop. Disabled panels are skipped, and each
          slide can have its own timing.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" icon={Plus} onClick={addPanel}>
            Add Slide
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save TV Loop
          </Button>
        </div>
      </div>
      {saved ? (
        <p className="text-sm font-black text-journey-red">TV loop settings saved.</p>
      ) : null}
      <div className="grid gap-3">
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="grid gap-3 rounded-lg border border-journey-line p-4 md:grid-cols-[140px_1fr_110px_110px_auto]"
          >
            <Button
              type="button"
              variant={panel.enabled ? "dark" : "secondary"}
              icon={panel.enabled ? ToggleRight : ToggleLeft}
              onClick={() => updatePanel(panel.id, { enabled: !panel.enabled })}
            >
              {panel.enabled ? "On" : "Off"}
            </Button>
            <input
              value={panel.label}
              onChange={(event) => updatePanel(panel.id, { label: event.target.value })}
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3 font-black text-journey-black"
            />
            <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
              Order
              <input
                type="number"
                value={panel.sortOrder}
                onChange={(event) =>
                  updatePanel(panel.id, { sortOrder: Number(event.target.value) })
                }
                className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
              />
            </label>
            <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
              Seconds
              <input
                type="number"
                min="4"
                max="60"
                value={panel.seconds}
                onChange={(event) =>
                  updatePanel(panel.id, {
                    seconds: Math.min(60, Math.max(4, Number(event.target.value))),
                  })
                }
                className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
              />
            </label>
            <Button
              type="button"
              variant="ghost"
              icon={Trash2}
              onClick={() => deletePanel(panel.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
