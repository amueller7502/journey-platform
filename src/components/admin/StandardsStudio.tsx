"use client";

import { Plus, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { ConfigLifecycle, RecognitionStandard, StandardId } from "@/lib/types";

const lifecycleOptions: ConfigLifecycle[] = ["draft", "published", "archived"];

export function StandardsStudio() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const standards = state.recognitionStandards
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  function updateStandard(id: string, patch: Partial<RecognitionStandard>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      recognitionStandards: current.recognitionStandards.map((standard) =>
        standard.id === id
          ? {
              ...standard,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : standard,
      ),
    }));
  }

  function addStandard() {
    setSaved(false);
    updateState((current) => {
      const label = "New Experience Standard";
      const id = makeSlugId(label, "standard") as StandardId;
      const createdAt = new Date().toISOString();
      const nextOrder =
        Math.max(0, ...current.recognitionStandards.map((standard) => standard.sortOrder ?? 0)) +
        10;

      return {
        ...current,
        recognitionStandards: [
          ...current.recognitionStandards,
          {
            id,
            label,
            shortLabel: "New Standard",
            description: "Describe the behavior leaders should recognize.",
            storyPrompt: "What happened, and why did it matter?",
            enabled: true,
            sortOrder: nextOrder,
            lifecycle: "draft",
            seasonId: current.chapter.id,
            createdAt,
            updatedAt: createdAt,
          },
        ],
      };
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-sm font-bold leading-6 text-journey-steel">
          Standards are the culture language that every Experience Moment points back to.
          Leaders can recognize different behavior, but the meaning should stay clear.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" icon={Plus} onClick={addStandard}>
            Add Standard
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Standards
          </Button>
        </div>
      </div>
      {saved ? (
        <p className="text-sm font-black text-journey-red">Standards Studio saved.</p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead>
            <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Lifecycle</th>
              <th className="py-3 pr-4">Label</th>
              <th className="py-3 pr-4">Short Label</th>
              <th className="py-3 pr-4">Description</th>
              <th className="py-3 pr-4">Story Prompt</th>
              <th className="py-3 pr-4">Sort</th>
            </tr>
          </thead>
          <tbody>
            {standards.map((standard) => (
              <tr key={standard.id} className="border-b border-journey-line align-top">
                <td className="py-3 pr-4">
                  <Button
                    type="button"
                    variant={standard.enabled !== false ? "dark" : "secondary"}
                    icon={standard.enabled !== false ? ToggleRight : ToggleLeft}
                    onClick={() =>
                      updateStandard(standard.id, { enabled: standard.enabled === false })
                    }
                  >
                    {standard.enabled !== false ? "Enabled" : "Disabled"}
                  </Button>
                </td>
                <td className="py-3 pr-4">
                  <select
                    value={standard.lifecycle ?? "published"}
                    onChange={(event) =>
                      updateStandard(standard.id, {
                        lifecycle: event.target.value as ConfigLifecycle,
                      })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-sm font-bold"
                  >
                    {lifecycleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 pr-4">
                  <input
                    value={standard.label}
                    onChange={(event) =>
                      updateStandard(standard.id, { label: event.target.value })
                    }
                    className="focus-ring min-h-10 w-full min-w-64 rounded-md border border-journey-line px-3 font-black"
                  />
                </td>
                <td className="py-3 pr-4">
                  <input
                    value={standard.shortLabel}
                    onChange={(event) =>
                      updateStandard(standard.id, { shortLabel: event.target.value })
                    }
                    className="focus-ring min-h-10 w-full min-w-44 rounded-md border border-journey-line px-3 font-black"
                  />
                </td>
                <td className="py-3 pr-4">
                  <textarea
                    value={standard.description}
                    onChange={(event) =>
                      updateStandard(standard.id, { description: event.target.value })
                    }
                    className="focus-ring min-h-20 w-full min-w-72 rounded-md border border-journey-line px-3 py-2 text-sm"
                  />
                </td>
                <td className="py-3 pr-4">
                  <textarea
                    value={standard.storyPrompt ?? ""}
                    onChange={(event) =>
                      updateStandard(standard.id, { storyPrompt: event.target.value })
                    }
                    className="focus-ring min-h-20 w-full min-w-72 rounded-md border border-journey-line px-3 py-2 text-sm"
                  />
                </td>
                <td className="py-3 pr-4">
                  <input
                    type="number"
                    value={standard.sortOrder ?? 0}
                    onChange={(event) =>
                      updateStandard(standard.id, { sortOrder: Number(event.target.value) })
                    }
                    className="focus-ring min-h-10 w-24 rounded-md border border-journey-line px-3"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
