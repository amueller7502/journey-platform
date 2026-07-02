"use client";

import { Plus, Save, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { ConfigLifecycle, DisplaySlideType, ExperienceDisplaySlide } from "@/lib/types";

const lifecycleOptions: ConfigLifecycle[] = ["draft", "published", "archived"];
const slideTypes: DisplaySlideType[] = [
  "Community XP",
  "Today's Focus",
  "Recognition Spotlight",
  "Department Progress",
  "Reward Spotlight",
  "Countdown",
  "Experience Score",
  "Leaderboard",
  "Custom",
];

function makeSlideId(label: string) {
  return `${makeSlugId(label, "display_slide")}-${new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 12)}`;
}

export function DisplaysStudio() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const slides = state.experienceDisplaySlides
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function updateSlide(id: string, patch: Partial<ExperienceDisplaySlide>) {
    setSaved(false);
    updateState((current) => {
      const nextSlides = current.experienceDisplaySlides.map((slide) =>
        slide.id === id
          ? {
              ...slide,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : slide,
      );
      const updatedSlide = nextSlides.find((slide) => slide.id === id);

      return {
        ...current,
        experienceDisplaySlides: nextSlides,
        tvPanelSettings: updatedSlide
          ? current.tvPanelSettings.map((panel) =>
              panel.label === updatedSlide.label || panel.id === id
                ? {
                    ...panel,
                    label: updatedSlide.label,
                    enabled: updatedSlide.enabled && updatedSlide.showOnTv,
                    sortOrder: updatedSlide.sortOrder,
                    seconds: updatedSlide.durationSeconds,
                  }
                : panel,
            )
          : current.tvPanelSettings,
      };
    });
  }

  function addSlide() {
    setSaved(false);
    updateState((current) => {
      const createdAt = new Date().toISOString();
      const label = "Custom Display Slide";
      const nextOrder =
        Math.max(0, ...current.experienceDisplaySlides.map((slide) => slide.sortOrder)) + 10;
      const slide: ExperienceDisplaySlide = {
        id: makeSlideId(label),
        type: "Custom",
        label,
        headline: "New display moment",
        supportingText: "Describe what employees should see on the shared display.",
        durationSeconds: 7,
        showOnTv: true,
        lifecycle: "draft",
        enabled: true,
        sortOrder: nextOrder,
        seasonId: current.chapter.id,
        createdAt,
        updatedAt: createdAt,
      };

      return {
        ...current,
        experienceDisplaySlides: [...current.experienceDisplaySlides, slide],
        tvPanelSettings: [
          ...current.tvPanelSettings,
          {
            id: slide.id,
            label: slide.label,
            enabled: true,
            sortOrder: nextOrder,
            seconds: slide.durationSeconds,
          },
        ],
      };
    });
  }

  function deleteSlide(id: string) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      experienceDisplaySlides: current.experienceDisplaySlides.filter((slide) => slide.id !== id),
      tvPanelSettings: current.tvPanelSettings.filter((panel) => panel.id !== id),
    }));
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-sm font-bold leading-6 text-journey-steel">
          Displays Studio controls the TV loop: slide order, visibility, timing, headlines,
          and supporting copy. Published slides can be shown on TV; draft slides can be prepared
          for future seasons.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" icon={Plus} onClick={addSlide}>
            Add Slide
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Displays
          </Button>
        </div>
      </div>
      {saved ? (
        <p className="text-sm font-black text-journey-red">Displays Studio saved.</p>
      ) : null}

      <div className="grid gap-3">
        {slides.map((slide) => (
          <article
            key={slide.id}
            className="grid gap-4 rounded-lg border border-journey-line bg-journey-white p-4 xl:grid-cols-[180px_1fr_260px_auto]"
          >
            <div className="grid gap-2 content-start">
              <Button
                type="button"
                variant={slide.enabled ? "dark" : "secondary"}
                icon={slide.enabled ? ToggleRight : ToggleLeft}
                onClick={() => updateSlide(slide.id, { enabled: !slide.enabled })}
              >
                {slide.enabled ? "Enabled" : "Disabled"}
              </Button>
              <Button
                type="button"
                variant={slide.showOnTv ? "dark" : "secondary"}
                icon={slide.showOnTv ? ToggleRight : ToggleLeft}
                onClick={() => updateSlide(slide.id, { showOnTv: !slide.showOnTv })}
              >
                {slide.showOnTv ? "On TV" : "Hidden"}
              </Button>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Label
                  <input
                    value={slide.label}
                    onChange={(event) => updateSlide(slide.id, { label: event.target.value })}
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                  />
                </label>
                <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                  Slide Type
                  <select
                    value={slide.type}
                    onChange={(event) =>
                      updateSlide(slide.id, { type: event.target.value as DisplaySlideType })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                  >
                    {slideTypes.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Headline
                <input
                  value={slide.headline}
                  onChange={(event) => updateSlide(slide.id, { headline: event.target.value })}
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black text-journey-black"
                />
              </label>
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Supporting Text
                <textarea
                  value={slide.supportingText}
                  onChange={(event) =>
                    updateSlide(slide.id, { supportingText: event.target.value })
                  }
                  className="focus-ring min-h-20 rounded-md border border-journey-line px-3 py-2 text-sm text-journey-black"
                />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
              <label className="grid gap-1 text-xs font-black uppercase text-journey-steel">
                Lifecycle
                <select
                  value={slide.lifecycle}
                  onChange={(event) =>
                    updateSlide(slide.id, { lifecycle: event.target.value as ConfigLifecycle })
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
                Order
                <input
                  type="number"
                  value={slide.sortOrder}
                  onChange={(event) =>
                    updateSlide(slide.id, { sortOrder: Number(event.target.value) })
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
                  value={slide.durationSeconds}
                  onChange={(event) =>
                    updateSlide(slide.id, {
                      durationSeconds: Math.min(60, Math.max(4, Number(event.target.value))),
                    })
                  }
                  className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base text-journey-black"
                />
              </label>
            </div>

            <Button
              type="button"
              variant="ghost"
              icon={Trash2}
              onClick={() => deleteSlide(slide.id)}
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
