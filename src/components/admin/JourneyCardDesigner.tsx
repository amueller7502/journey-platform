"use client";

import { ClipboardList, Plus, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { chapter, recognitionStandards } from "@/lib/data";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { DepartmentId, JourneyCardArea, RecognitionType } from "@/lib/types";

function sortAreas(a: JourneyCardArea, b: JourneyCardArea) {
  return a.sortOrder - b.sortOrder;
}

function sortTasks(a: RecognitionType, b: RecognitionType) {
  return a.sortOrder - b.sortOrder;
}

export function JourneyCardDesigner() {
  const { state, updateState } = useJourneyState();
  const areas = useMemo(
    () => state.journeyCardAreas.slice().sort(sortAreas),
    [state.journeyCardAreas],
  );
  const [selectedAreaId, setSelectedAreaId] = useState(areas[0]?.id ?? "");
  const [saved, setSaved] = useState(false);
  const selectedArea =
    areas.find((area) => area.id === selectedAreaId) ?? areas[0];
  const cardTasks = state.recognitionTypes
    .filter((type) => type.journeyCardEligible || type.type === "journey_card_task")
    .slice()
    .sort(sortTasks);
  const assignedEmployees = state.employees.filter(
    (employee) =>
      employee.role === "employee" &&
      employee.active !== false &&
      employee.journeyCardAreaId === selectedArea?.id,
  );

  function updateArea(id: string, patch: Partial<JourneyCardArea>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      journeyCardAreas: current.journeyCardAreas.map((area) =>
        area.id === id ? { ...area, ...patch } : area,
      ),
    }));
  }

  function addArea() {
    setSaved(false);
    updateState((current) => {
      const nextOrder =
        Math.max(0, ...current.journeyCardAreas.map((area) => area.sortOrder)) + 10;
      const id = `${makeSlugId("New Card Area", "card_area")}-${Date.now()}`;
      const nextArea: JourneyCardArea = {
        id,
        name: "New Card Area",
        description: "Describe which crew members should receive this Journey Card.",
        departmentIds: [],
        enabled: true,
        sortOrder: nextOrder,
      };

      setSelectedAreaId(id);
      return {
        ...current,
        journeyCardAreas: [...current.journeyCardAreas, nextArea],
      };
    });
  }

  function updateTask(id: string, patch: Partial<RecognitionType>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      recognitionTypes: current.recognitionTypes.map((type) =>
        type.id === id ? { ...type, ...patch } : type,
      ),
    }));
  }

  function toggleTaskArea(task: RecognitionType, areaId: string) {
    const currentAreaIds = task.journeyCardAreaIds ?? [];
    const nextAreaIds = currentAreaIds.includes(areaId)
      ? currentAreaIds.filter((id) => id !== areaId)
      : [...currentAreaIds, areaId];

    updateTask(task.id, {
      journeyCardEligible: true,
      journeyCardAreaIds: nextAreaIds,
    });
  }

  function addTaskToArea() {
    if (!selectedArea) {
      return;
    }

    setSaved(false);
    updateState((current) => {
      const nextOrder =
        Math.max(0, ...current.recognitionTypes.map((type) => type.sortOrder)) + 10;
      const nextTask: RecognitionType = {
        id: `${makeSlugId(`${selectedArea.name} Task`, "journey_card_task")}-${Date.now()}`,
        chapterId: chapter.id,
        name: `${selectedArea.name} Task`,
        description: "Describe the verified task for this area.",
        category: "Details",
        standardId: "detail_matters",
        milesValue: 15,
        icon: "BadgeCheck",
        enabled: true,
        requiresManagerVerification: true,
        sortOrder: nextOrder,
        type: "journey_card_task",
        creditScope: "employee",
        journeyCardEligible: true,
        journeyCardAreaIds: [selectedArea.id],
      };

      return {
        ...current,
        recognitionTypes: [...current.recognitionTypes, nextTask],
      };
    });
  }

  if (!selectedArea) {
    return (
      <Panel>
        <PanelHeader title="Journey Card Builder" eyebrow="Areas and Tasks" />
        <Button type="button" icon={Plus} onClick={addArea}>
          Add Journey Card Area
        </Button>
      </Panel>
    );
  }

  return (
    <Panel className="mt-5">
      <PanelHeader
        title="Journey Card Builder"
        eyebrow="Area-specific task design"
        action={<ClipboardList className="h-5 w-5 text-journey-red" aria-hidden="true" />}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-sm font-bold leading-6 text-journey-steel">
          Journey Cards can be assigned by work area. Managers only see tasks that
          match each employee card area, so kitchen, lobby, concessions, and
          facilities can each have a fair checklist.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" icon={Plus} onClick={addArea}>
            Add Area
          </Button>
          <Button type="button" variant="secondary" icon={Plus} onClick={addTaskToArea}>
            Add Task
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Cards
          </Button>
        </div>
      </div>

      {saved ? (
        <div className="mb-4 rounded-lg border border-journey-red bg-journey-white p-4 text-sm font-black text-journey-black">
          Journey Card configuration saved for this preview browser.
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
        <div className="grid gap-3">
          {areas.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => setSelectedAreaId(area.id)}
              className={`focus-ring rounded-lg border p-4 text-left transition ${
                area.id === selectedArea.id
                  ? "border-journey-red bg-journey-black text-journey-white"
                  : "border-journey-line bg-journey-white text-journey-black hover:bg-journey-mist"
              }`}
            >
              <p className="text-xs font-black uppercase text-journey-red">
                {area.enabled ? "Enabled" : "Disabled"}
              </p>
              <h3 className="mt-1 text-lg font-black">{area.name}</h3>
              <p className="mt-2 text-xs font-bold opacity-80">
                {state.employees.filter((employee) => employee.journeyCardAreaId === area.id).length} assigned
              </p>
            </button>
          ))}
        </div>

        <div className="grid gap-5">
          <div className="rounded-lg border border-journey-line bg-journey-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-journey-red">
                  Card Area
                </p>
                <input
                  value={selectedArea.name}
                  onChange={(event) =>
                    updateArea(selectedArea.id, { name: event.target.value })
                  }
                  className="focus-ring mt-2 min-h-11 w-full rounded-md border border-journey-line px-3 text-xl font-black text-journey-black"
                />
              </div>
              <Button
                type="button"
                variant={selectedArea.enabled ? "dark" : "secondary"}
                icon={selectedArea.enabled ? ToggleRight : ToggleLeft}
                onClick={() =>
                  updateArea(selectedArea.id, { enabled: !selectedArea.enabled })
                }
              >
                {selectedArea.enabled ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-bold text-journey-black">
              Description
              <textarea
                value={selectedArea.description}
                onChange={(event) =>
                  updateArea(selectedArea.id, { description: event.target.value })
                }
                rows={3}
                className="focus-ring resize-none rounded-md border border-journey-line px-3 py-2"
              />
            </label>

            <div className="mt-4">
              <p className="text-sm font-black text-journey-black">
                Departments that default to this card
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {state.departments
                  .filter((department) => department.id !== "leadership")
                  .map((department) => {
                    const checked = selectedArea.departmentIds.includes(department.id);
                    return (
                      <label
                        key={department.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold ${
                          checked
                            ? "border-journey-red bg-journey-red text-journey-white"
                            : "border-journey-line bg-journey-white text-journey-black"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const nextDepartments = event.target.checked
                              ? [...selectedArea.departmentIds, department.id]
                              : selectedArea.departmentIds.filter(
                                  (id) => id !== department.id,
                                );
                            updateArea(selectedArea.id, {
                              departmentIds: nextDepartments as DepartmentId[],
                            });
                          }}
                        />
                        {department.name}
                      </label>
                    );
                  })}
              </div>
            </div>

            <p className="mt-4 text-sm font-bold text-journey-steel">
              Assigned active crew:{" "}
              <span className="font-black text-journey-black">
                {assignedEmployees.map((employee) => employee.name).join(", ") || "None yet"}
              </span>
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-journey-line">
            <table className="w-full min-w-[1040px] border-collapse bg-journey-white text-left">
              <thead>
                <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
                  <th className="p-3">On Card</th>
                  <th className="p-3">Task</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Standard</th>
                  <th className="p-3">Miles</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {cardTasks.map((task) => {
                  const onCard = task.journeyCardAreaIds?.includes(selectedArea.id) ?? false;
                  return (
                    <tr key={task.id} className="border-b border-journey-line align-top">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={onCard}
                          onChange={() => toggleTaskArea(task, selectedArea.id)}
                          className="h-6 w-6 accent-journey-red"
                          aria-label={`Toggle ${task.name} on ${selectedArea.name}`}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          value={task.name}
                          onChange={(event) =>
                            updateTask(task.id, { name: event.target.value })
                          }
                          className="focus-ring min-h-10 w-full min-w-56 rounded-md border border-journey-line px-3 font-black"
                        />
                      </td>
                      <td className="p-3">
                        <textarea
                          value={task.description}
                          onChange={(event) =>
                            updateTask(task.id, { description: event.target.value })
                          }
                          rows={2}
                          className="focus-ring w-full min-w-72 resize-none rounded-md border border-journey-line px-3 py-2 text-sm"
                        />
                      </td>
                      <td className="p-3">
                        <select
                          value={task.standardId}
                          onChange={(event) =>
                            updateTask(task.id, {
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
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          value={task.milesValue}
                          onChange={(event) =>
                            updateTask(task.id, {
                              milesValue: Math.max(1, Number(event.target.value)),
                            })
                          }
                          className="focus-ring min-h-10 w-24 rounded-md border border-journey-line px-3 font-black"
                        />
                      </td>
                      <td className="p-3">
                        <Button
                          type="button"
                          variant={task.enabled ? "dark" : "secondary"}
                          icon={task.enabled ? ToggleRight : ToggleLeft}
                          onClick={() => updateTask(task.id, { enabled: !task.enabled })}
                        >
                          {task.enabled ? "Enabled" : "Disabled"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Panel>
  );
}
