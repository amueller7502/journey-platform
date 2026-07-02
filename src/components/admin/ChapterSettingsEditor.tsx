"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useJourneyState } from "@/lib/journey-state";

const editableFields = [
  ["Season name", "name"],
  ["Season subtitle", "subtitle"],
  ["Start date", "startDate"],
  ["End date", "endDate"],
  ["Community XP goal", "communityGoalMiles"],
  ["Theme label", "themeLabel"],
  ["Active", "active"],
  ["Season tagline", "visualTagline"],
  ["Theme note", "themeNote"],
] as const;

export function ChapterSettingsEditor({
  settings,
}: {
  settings: string[][];
}) {
  const { state, updateState } = useJourneyState();
  const [fields, setFields] = useState(() =>
    editableFields.map(([label, key]) => ({
      label,
      key,
      value:
        key === "active"
          ? state.chapter.active
            ? "Yes"
            : "No"
          : String(state.chapter[key] ?? settings.find(([item]) => item === label)?.[1] ?? ""),
    })),
  );
  const [saved, setSaved] = useState(false);

  function updateSetting(label: string, value: string) {
    setSaved(false);
    setFields((current) =>
      current.map((field) => (field.label === label ? { ...field, value } : field)),
    );
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        updateState((current) => {
          const values = Object.fromEntries(
            fields.map((field) => [field.key, field.value]),
          );

          return {
            ...current,
            chapter: {
              ...current.chapter,
              name: values.name || current.chapter.name,
              subtitle: values.subtitle || current.chapter.subtitle,
              startDate: values.startDate || current.chapter.startDate,
              endDate: values.endDate || current.chapter.endDate,
              communityGoalMiles: Math.max(
                1,
                Number(values.communityGoalMiles) ||
                  current.chapter.communityGoalMiles,
              ),
              themeLabel: values.themeLabel || current.chapter.themeLabel,
              active: String(values.active).toLowerCase().startsWith("y"),
              visualTagline: values.visualTagline || current.chapter.visualTagline,
              themeNote: values.themeNote || current.chapter.themeNote,
              imaxReference: `${values.communityGoalMiles || current.chapter.communityGoalMiles} XP - a nod to IMAX 1570 film.`,
            },
          };
        });
        setSaved(true);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <label
            key={field.label}
            className="grid gap-2 rounded-lg border border-journey-line p-4 text-sm font-bold text-journey-black"
          >
            <span className="text-xs font-black uppercase text-journey-red">
              {field.label}
            </span>
            <input
              value={field.value}
              onChange={(event) => updateSetting(field.label, event.target.value)}
              className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-base font-black"
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" icon={Save}>
          Save Season Settings
        </Button>
        {saved ? (
          <p className="text-sm font-black text-journey-red">
            Season settings saved.
          </p>
        ) : null}
      </div>
    </form>
  );
}
