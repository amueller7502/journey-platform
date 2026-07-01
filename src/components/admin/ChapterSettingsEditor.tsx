"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ChapterSettingsEditor({
  settings,
}: {
  settings: string[][];
}) {
  const [fields, setFields] = useState(() =>
    settings.map(([label, value]) => ({ label, value })),
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
          Save Chapter Settings
        </Button>
        {saved ? (
          <p className="text-sm font-black text-journey-red">
            Chapter settings saved in this browser session.
          </p>
        ) : null}
      </div>
    </form>
  );
}
