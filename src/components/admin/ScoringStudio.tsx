"use client";

import { Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useJourneyState } from "@/lib/journey-state";
import type { ConfigLifecycle, ScoringMetric } from "@/lib/types";

const lifecycleOptions: ConfigLifecycle[] = ["draft", "published", "archived"];

export function ScoringStudio() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const metrics = state.scoringMetrics.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const enabledMetrics = metrics.filter((metric) => metric.enabled);
  const totalWeight = enabledMetrics.reduce((total, metric) => total + metric.weight, 0);
  const weightedScore = totalWeight
    ? Math.round(
        enabledMetrics.reduce(
          (total, metric) => total + metric.currentValue * (metric.weight / totalWeight),
          0,
        ),
      )
    : 0;

  function updateMetric(id: string, patch: Partial<ScoringMetric>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      scoringMetrics: current.scoringMetrics.map((metric) =>
        metric.id === id
          ? {
              ...metric,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : metric,
      ),
    }));
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-journey-line bg-journey-black p-5 text-journey-white shadow-line">
          <p className="text-xs font-black uppercase text-journey-red">Calculated Preview</p>
          <p className="mt-2 text-6xl font-black">{weightedScore}</p>
          <p className="mt-2 text-sm font-bold leading-6 text-journey-line">
            Weighted from enabled scoring metrics. Change weights and targets to tune what
            Experience emphasizes for a season.
          </p>
          <div className="mt-5">
            <ProgressBar value={weightedScore} max={100} inverse />
          </div>
        </section>
        <section className="rounded-lg border border-journey-line bg-journey-white p-5 shadow-line">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-journey-red">Weight Check</p>
              <p className="mt-1 text-3xl font-black text-journey-black">{totalWeight}%</p>
            </div>
            <Button type="button" icon={Save} onClick={() => setSaved(true)}>
              Save Scoring
            </Button>
          </div>
          <p className="mt-3 text-sm font-bold leading-6 text-journey-steel">
            Aim for enabled weights to total 100%. The product will still calculate if they do
            not, but a clean total is easier for leaders to reason about.
          </p>
          {saved ? (
            <p className="mt-3 text-sm font-black text-journey-red">Scoring Studio saved.</p>
          ) : null}
        </section>
      </div>

      <div className="grid gap-3">
        {metrics.map((metric) => (
          <article
            key={metric.id}
            className="grid gap-4 rounded-lg border border-journey-line bg-journey-white p-4 lg:grid-cols-[150px_1fr_360px]"
          >
            <div className="grid content-start gap-2">
              <Button
                type="button"
                variant={metric.enabled ? "dark" : "secondary"}
                icon={metric.enabled ? ToggleRight : ToggleLeft}
                onClick={() => updateMetric(metric.id, { enabled: !metric.enabled })}
              >
                {metric.enabled ? "Enabled" : "Disabled"}
              </Button>
              <p className="rounded-md bg-journey-mist px-3 py-2 text-center text-2xl font-black text-journey-black">
                {metric.currentValue}
              </p>
            </div>
            <div className="grid gap-3">
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Label
                <input
                  value={metric.label}
                  onChange={(event) => updateMetric(metric.id, { label: event.target.value })}
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Description
                <textarea
                  value={metric.description}
                  onChange={(event) =>
                    updateMetric(metric.id, { description: event.target.value })
                  }
                  className="focus-ring min-h-20 rounded-md border border-journey-line px-3 py-2 text-sm text-journey-black"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Weight
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={metric.weight}
                  onChange={(event) =>
                    updateMetric(metric.id, {
                      weight: Math.min(100, Math.max(0, Number(event.target.value))),
                    })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Target
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={metric.target}
                  onChange={(event) =>
                    updateMetric(metric.id, {
                      target: Math.min(100, Math.max(0, Number(event.target.value))),
                    })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Current Value
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={metric.currentValue}
                  onChange={(event) =>
                    updateMetric(metric.id, {
                      currentValue: Math.min(100, Math.max(0, Number(event.target.value))),
                    })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Lifecycle
                <select
                  value={metric.lifecycle}
                  onChange={(event) =>
                    updateMetric(metric.id, { lifecycle: event.target.value as ConfigLifecycle })
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
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
