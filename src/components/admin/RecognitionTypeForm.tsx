"use client";

import { useMemo, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  chapter,
  iconNames,
  recognitionStandards,
} from "@/lib/data";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { RecognitionType } from "@/lib/types";

function createBlankType(sortOrder: number): RecognitionType {
  return {
    id: "new-recognition-type",
    chapterId: chapter.id,
    name: "",
    description: "",
    category: "Guest Experience",
    standardId: "guest_welcome",
    milesValue: 10,
    icon: "Sparkles",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder,
    type: "recognition",
    creditScope: "employee",
    journeyCardEligible: false,
    journeyCardAreaIds: [],
  };
}

export function RecognitionTypeForm({ typeId }: { typeId?: string }) {
  const { state, updateState } = useJourneyState();
  const existing = useMemo(
    () => state.recognitionTypes.find((type) => type.id === typeId),
    [state.recognitionTypes, typeId],
  );
  const blankType = useMemo(
    () =>
      createBlankType(
        Math.max(0, ...state.recognitionTypes.map((type) => type.sortOrder)) + 10,
      ),
    [state.recognitionTypes],
  );
  const [form, setForm] = useState<RecognitionType>(existing ?? blankType);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const id =
          form.id === "new-recognition-type"
            ? `${makeSlugId(form.name, "recognition_type")}-${Date.now()}`
            : form.id;
        const nextType = {
          ...form,
          id,
          name: form.name.trim() || "Untitled Recognition Type",
          description: form.description.trim() || "Manager verified Experience Moment.",
          milesValue: Math.max(1, Number(form.milesValue)),
        };

        updateState((current) => {
          const exists = current.recognitionTypes.some((type) => type.id === id);

          return {
            ...current,
            recognitionTypes: exists
              ? current.recognitionTypes.map((type) =>
                  type.id === id ? nextType : type,
                )
              : [...current.recognitionTypes, nextType],
          };
        });
        setForm(nextType);
        setSaved(true);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Name
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
            placeholder="Recognition type name"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Type
          <select
            value={form.type}
            onChange={(event) =>
              setForm({ ...form, type: event.target.value as RecognitionType["type"] })
            }
            className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
          >
            <option value="recognition">recognition</option>
            <option value="journey_card_task">journey_card_task</option>
            <option value="excellence_check">excellence_check</option>
            <option value="reliability">reliability</option>
            <option value="teamwork">teamwork</option>
            <option value="guest_experience">guest_experience</option>
            <option value="detail">detail</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-journey-black">
        Description
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          rows={4}
          className="focus-ring resize-none rounded-md border border-journey-line px-3 py-3"
          placeholder="What managers are verifying"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-5">
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Category
          <select
            value={form.category}
            onChange={(event) =>
              setForm({ ...form, category: event.target.value as RecognitionType["category"] })
            }
            className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
          >
            <option value="Excellence Check">Excellence Check</option>
            <option value="Guest Experience">Guest Experience</option>
            <option value="Teamwork">Teamwork</option>
            <option value="Reliability">Reliability</option>
            <option value="Details">Details</option>
            <option value="Manager Award">Manager Award</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Standard
          <select
            value={form.standardId}
            onChange={(event) =>
              setForm({ ...form, standardId: event.target.value as RecognitionType["standardId"] })
            }
            className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
          >
            {recognitionStandards.map((standard) => (
              <option key={standard.id} value={standard.id}>
                {standard.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          XP
          <input
            type="number"
            value={form.milesValue}
            onChange={(event) =>
              setForm({ ...form, milesValue: Number(event.target.value) })
            }
            className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Icon
          <select
            value={form.icon}
            onChange={(event) => setForm({ ...form, icon: event.target.value })}
            className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
          >
            {iconNames.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Sort Order
          <input
            type="number"
            value={form.sortOrder}
            onChange={(event) =>
              setForm({ ...form, sortOrder: Number(event.target.value) })
            }
            className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-lg border border-journey-line p-4 text-sm font-bold text-journey-black">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) => setForm({ ...form, enabled: event.target.checked })}
          />
          Enabled
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-journey-line p-4 text-sm font-bold text-journey-black">
          <input
            type="checkbox"
            checked={form.requiresManagerVerification}
            onChange={(event) =>
              setForm({ ...form, requiresManagerVerification: event.target.checked })
            }
          />
          Requires manager verification
        </label>
        <label className="grid gap-2 rounded-lg border border-journey-line p-4 text-sm font-bold text-journey-black">
          Credit Scope
          <select
            value={form.creditScope ?? "employee"}
            onChange={(event) =>
              setForm({
                ...form,
                creditScope: event.target.value as RecognitionType["creditScope"],
              })
            }
            className="focus-ring min-h-10 rounded-md border border-journey-line px-3"
          >
            <option value="employee">Employee XP</option>
            <option value="department">Department / building progress</option>
            <option value="community">Community progress only</option>
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-journey-line p-4 text-sm font-bold text-journey-black">
          <input
            type="checkbox"
            checked={Boolean(form.journeyCardEligible)}
            onChange={(event) =>
              setForm({
                ...form,
                journeyCardEligible: event.target.checked,
                type: event.target.checked ? "journey_card_task" : form.type,
              })
            }
          />
          Available on Experience Cards
        </label>
      </div>

      <Button type="submit" icon={Save} className="w-full md:w-auto">
        Save Recognition Type
      </Button>

      {saved ? (
        <div className="rounded-lg border border-journey-red bg-journey-white p-4 text-sm font-bold text-journey-black">
          Recognition type saved to the configurable library. Supabase persistence
          maps to `recognition_types` when connected.
        </div>
      ) : null}
    </form>
  );
}
