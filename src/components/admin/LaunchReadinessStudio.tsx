"use client";

import { Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useJourneyState } from "@/lib/journey-state";
import type { LaunchReadinessItem } from "@/lib/types";

const ownerOptions: LaunchReadinessItem["owner"][] = [
  "Admin/GM",
  "Leader",
  "Experience Designer",
];
const statusOptions: LaunchReadinessItem["status"][] = [
  "not_started",
  "in_progress",
  "ready",
  "blocked",
];

export function LaunchReadinessStudio() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const items = state.launchReadinessItems.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const readyCount = items.filter((item) => item.status === "ready").length;
  const progress = useMemo(
    () => (items.length ? Math.round((readyCount / items.length) * 100) : 0),
    [items.length, readyCount],
  );

  function updateItem(id: string, patch: Partial<LaunchReadinessItem>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      launchReadinessItems: current.launchReadinessItems.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    }));
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-journey-line bg-journey-black p-5 text-journey-white shadow-line">
          <p className="text-xs font-black uppercase text-journey-red">Launch Readiness</p>
          <p className="mt-2 text-6xl font-black">{progress}%</p>
          <p className="mt-2 text-sm font-bold text-journey-line">
            {readyCount} of {items.length} operational checklist items are ready.
          </p>
          <div className="mt-5">
            <ProgressBar value={progress} max={100} inverse />
          </div>
        </section>
        <section className="rounded-lg border border-journey-line bg-journey-white p-5 shadow-line">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-journey-red">Launch Studio</p>
              <h2 className="mt-1 text-2xl font-black text-journey-black">
                Operational checklist
              </h2>
            </div>
            <Button type="button" icon={Save} onClick={() => setSaved(true)}>
              Save Checklist
            </Button>
          </div>
          <p className="mt-3 text-sm font-bold leading-6 text-journey-steel">
            This is the single place to decide whether a season is actually ready to run:
            configuration, cards, TV, employees, authentication, and Supabase connection.
          </p>
          {saved ? (
            <p className="mt-3 text-sm font-black text-journey-red">Launch Studio saved.</p>
          ) : null}
        </section>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid gap-4 rounded-lg border border-journey-line bg-journey-white p-4 xl:grid-cols-[140px_1fr_360px]"
          >
            <Button
              type="button"
              variant={item.enabled ? "dark" : "secondary"}
              icon={item.enabled ? ToggleRight : ToggleLeft}
              onClick={() => updateItem(item.id, { enabled: !item.enabled })}
              className="self-start"
            >
              {item.enabled ? "Enabled" : "Disabled"}
            </Button>
            <div className="grid gap-3">
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Checklist Item
                <input
                  value={item.label}
                  onChange={(event) => updateItem(item.id, { label: event.target.value })}
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Notes
                <textarea
                  value={item.notes}
                  onChange={(event) => updateItem(item.id, { notes: event.target.value })}
                  className="focus-ring min-h-20 rounded-md border border-journey-line px-3 py-2 text-sm text-journey-black"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Owner
                <select
                  value={item.owner}
                  onChange={(event) =>
                    updateItem(item.id, {
                      owner: event.target.value as LaunchReadinessItem["owner"],
                    })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                >
                  {ownerOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Status
                <select
                  value={item.status}
                  onChange={(event) =>
                    updateItem(item.id, {
                      status: event.target.value as LaunchReadinessItem["status"],
                    })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Due Date
                <input
                  type="date"
                  value={item.dueDate}
                  onChange={(event) => updateItem(item.id, { dueDate: event.target.value })}
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Sort
                <input
                  type="number"
                  value={item.sortOrder}
                  onChange={(event) =>
                    updateItem(item.id, { sortOrder: Number(event.target.value) })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
