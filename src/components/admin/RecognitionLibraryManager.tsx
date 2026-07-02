"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { chapter, iconNames, recognitionStandards } from "@/lib/data";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { RecognitionCategory, RecognitionType, RecognitionTypeKind } from "@/lib/types";

const categoryOptions: RecognitionCategory[] = [
  "Excellence Check",
  "Guest Experience",
  "Teamwork",
  "Reliability",
  "Details",
  "Manager Award",
];

const typeOptions: RecognitionTypeKind[] = [
  "recognition",
  "journey_card_task",
  "excellence_check",
  "reliability",
  "teamwork",
  "guest_experience",
  "detail",
];

export function RecognitionLibraryManager() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState<"all" | "excellence" | "recognition" | "card">("all");
  const types = state.recognitionTypes;
  const visibleTypes = types.filter((type) => {
    if (filter === "excellence") {
      return type.type === "excellence_check";
    }

    if (filter === "recognition") {
      return type.type !== "excellence_check" && type.type !== "journey_card_task";
    }

    if (filter === "card") {
      return type.journeyCardEligible || type.type === "journey_card_task";
    }

    return true;
  });

  function updateRecognitionType(id: string, patch: Partial<RecognitionType>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      recognitionTypes: current.recognitionTypes.map((type) =>
        type.id === id ? { ...type, ...patch } : type,
      ),
    }));
  }

  function addRecognitionType(kind: RecognitionTypeKind) {
    setSaved(false);
    updateState((current) => {
      const nextOrder =
        Math.max(0, ...current.recognitionTypes.map((type) => type.sortOrder)) + 10;
      const name =
        kind === "excellence_check"
          ? "New Excellence Check"
          : kind === "journey_card_task"
            ? "New Journey Card Task"
            : "New Recognition Moment";
      const id = `${makeSlugId(name, "recognition_type")}-${Date.now()}`;
      const nextType: RecognitionType = {
        id,
        chapterId: chapter.id,
        name,
        description: "Describe what managers should verify.",
        category: kind === "excellence_check" ? "Excellence Check" : "Guest Experience",
        standardId: "guest_welcome",
        milesValue: kind === "excellence_check" ? 10 : 20,
        icon: kind === "excellence_check" ? "BadgeCheck" : "Sparkles",
        enabled: true,
        requiresManagerVerification: true,
        sortOrder: nextOrder,
        type: kind,
        creditScope: kind === "excellence_check" ? "department" : "employee",
        journeyCardEligible: kind === "journey_card_task",
        journeyCardAreaIds:
          kind === "journey_card_task"
            ? [current.journeyCardAreas.find((area) => area.enabled)?.id ?? "floor_lobby"]
            : [],
      };

      return {
        ...current,
        recognitionTypes: [...current.recognitionTypes, nextType],
      };
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-journey-steel">
            Admin-managed rules. Changes update manager recognition, Journey Card
            batch entry, and excellence checks in this browser.
          </p>
          {saved ? (
            <p className="mt-2 text-sm font-black text-journey-red">
              Recognition library saved.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={filter === "all" ? "dark" : "secondary"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            type="button"
            variant={filter === "excellence" ? "dark" : "secondary"}
            onClick={() => setFilter("excellence")}
          >
            Excellence Checks
          </Button>
          <Button
            type="button"
            variant={filter === "recognition" ? "dark" : "secondary"}
            onClick={() => setFilter("recognition")}
          >
            Moments
          </Button>
          <Button
            type="button"
            variant={filter === "card" ? "dark" : "secondary"}
            onClick={() => setFilter("card")}
          >
            Card Tasks
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={() => addRecognitionType("excellence_check")}
          >
            Add Check
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={() => addRecognitionType("journey_card_task")}
          >
            Add Card Task
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={Plus}
            onClick={() => addRecognitionType("recognition")}
          >
            Add Moment
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Library
          </Button>
          <LinkButton href="/admin/recognition-library/new" icon={Plus}>
            Full Form
          </LinkButton>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Description</th>
              <th className="py-3 pr-4">Type</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Standard</th>
              <th className="py-3 pr-4">Miles</th>
              <th className="py-3 pr-4">Scope</th>
              <th className="py-3 pr-4">Journey Card</th>
              <th className="py-3 pr-4">Icon</th>
              <th className="py-3 pr-4">Verification</th>
              <th className="py-3 pr-4">Sort</th>
              <th className="py-3 pr-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {visibleTypes
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((type) => {
                return (
                  <tr key={type.id} className="border-b border-journey-line align-top">
                    <td className="py-3 pr-4">
                      <Button
                        type="button"
                        icon={type.enabled ? ToggleRight : ToggleLeft}
                        variant={type.enabled ? "dark" : "secondary"}
                        onClick={() => updateRecognitionType(type.id, { enabled: !type.enabled })}
                      >
                        {type.enabled ? "Enabled" : "Disabled"}
                      </Button>
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        value={type.name}
                        onChange={(event) =>
                          updateRecognitionType(type.id, { name: event.target.value })
                        }
                        className="focus-ring min-h-10 w-full min-w-56 rounded-md border border-journey-line px-3 font-black"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <textarea
                        value={type.description}
                        onChange={(event) =>
                          updateRecognitionType(type.id, { description: event.target.value })
                        }
                        className="focus-ring min-h-20 w-full min-w-72 rounded-md border border-journey-line px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={type.type}
                        onChange={(event) =>
                          updateRecognitionType(type.id, {
                            type: event.target.value as RecognitionTypeKind,
                          })
                        }
                        className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-sm font-bold"
                      >
                        {typeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={type.category}
                        onChange={(event) =>
                          updateRecognitionType(type.id, {
                            category: event.target.value as RecognitionCategory,
                          })
                        }
                        className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-sm font-bold"
                      >
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={type.standardId}
                        onChange={(event) =>
                          updateRecognitionType(type.id, {
                            standardId: event.target.value as RecognitionType["standardId"],
                          })
                        }
                        className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-sm font-bold"
                      >
                        {recognitionStandards.map((standard) => (
                          <option key={standard.id} value={standard.id}>
                            {standard.shortLabel}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        type="number"
                        min="1"
                        value={type.milesValue}
                        onChange={(event) =>
                          updateRecognitionType(type.id, {
                            milesValue: Math.max(1, Number(event.target.value)),
                          })
                        }
                        className="focus-ring min-h-10 w-24 rounded-md border border-journey-line px-3 text-lg font-black"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={type.creditScope ?? (type.type === "excellence_check" ? "department" : "employee")}
                        onChange={(event) =>
                          updateRecognitionType(type.id, {
                            creditScope: event.target.value as RecognitionType["creditScope"],
                          })
                        }
                        className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-sm font-bold"
                      >
                        <option value="employee">employee</option>
                        <option value="department">department</option>
                        <option value="community">community</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-journey-steel">
                        <input
                          type="checkbox"
                          checked={Boolean(type.journeyCardEligible)}
                          onChange={(event) =>
                            updateRecognitionType(type.id, {
                              journeyCardEligible: event.target.checked,
                              type: event.target.checked ? "journey_card_task" : type.type,
                            })
                          }
                          className="h-5 w-5 accent-journey-red"
                        />
                        Card task
                      </label>
                      <p className="mt-2 text-xs font-bold text-journey-steel">
                        Assign areas in Admin / Journey Cards.
                      </p>
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={type.icon}
                        onChange={(event) =>
                          updateRecognitionType(type.id, { icon: event.target.value })
                        }
                        className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-sm font-bold"
                      >
                        {iconNames.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-journey-steel">
                        <input
                          type="checkbox"
                          checked={type.requiresManagerVerification}
                          onChange={(event) =>
                            updateRecognitionType(type.id, {
                              requiresManagerVerification: event.target.checked,
                            })
                          }
                          className="h-5 w-5 accent-journey-red"
                        />
                        Manager
                      </label>
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        type="number"
                        value={type.sortOrder}
                        onChange={(event) =>
                          updateRecognitionType(type.id, {
                            sortOrder: Number(event.target.value),
                          })
                        }
                        className="focus-ring min-h-10 w-24 rounded-md border border-journey-line px-3 font-black"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/recognition-library/${type.id}`}
                        className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md border border-journey-line px-3 py-2 text-sm font-black text-journey-black hover:bg-journey-mist"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
