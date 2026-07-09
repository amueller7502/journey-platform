"use client";

import {
  ClipboardList,
  ListChecks,
  Plus,
  Save,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ArchiveFilterControls } from "@/components/ui/ArchiveFilterControls";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog, type ConfirmDialogState } from "@/components/ui/ConfirmDialog";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { StatusToast, type StatusToastState } from "@/components/ui/StatusToast";
import {
  archiveConfigPatch,
  isArchived,
  isDraftLikeId,
  matchesArchiveFilter,
  type ArchiveFilter,
} from "@/lib/archive";
import { chapter, recognitionStandards, recognitions } from "@/lib/data";
import { getJourneyMoments } from "@/lib/demo-moments";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { DepartmentId, JourneyCardArea, RecognitionType } from "@/lib/types";

function sortAreas(a: JourneyCardArea, b: JourneyCardArea) {
  return a.sortOrder - b.sortOrder;
}

function sortTasks(a: RecognitionType, b: RecognitionType) {
  return a.sortOrder - b.sortOrder;
}

function taskAppearsOnArea(task: RecognitionType, areaId?: string) {
  if (!areaId || !task.journeyCardEligible) {
    return false;
  }

  return !task.journeyCardAreaIds?.length || task.journeyCardAreaIds.includes(areaId);
}

function CardTemplatePreview({
  area,
  tasks,
}: {
  area: JourneyCardArea;
  tasks: RecognitionType[];
}) {
  const totalXp = tasks.reduce((total, task) => total + task.milesValue, 0);

  return (
    <div className="rounded-lg border border-journey-line bg-journey-white p-4">
      <div className="rounded-md border-2 border-journey-black bg-journey-white">
        <div className="border-b-4 border-journey-red bg-journey-black px-4 py-3 text-journey-white">
          <p className="text-[10px] font-black uppercase text-journey-red">
            Experience Card
          </p>
          <h3 className="mt-1 text-lg font-black">More Than A Movie Starts With Us</h3>
        </div>
        <div className="grid gap-4 p-4">
          <div>
            <p className="text-[10px] font-black uppercase text-journey-red">
              Crew Member Name
            </p>
            <div className="mt-3 h-0.5 w-full bg-journey-black" />
            <p className="mt-2 text-xs font-bold text-journey-steel">
              Write name clearly, then turn in to a manager.
            </p>
          </div>
          <div className="rounded-md border border-journey-line bg-journey-mist p-3">
            <p className="text-xs font-black uppercase text-journey-red">
              {area.name}
            </p>
            <p className="mt-1 text-sm font-bold leading-5 text-journey-steel">
              {area.description}
            </p>
          </div>
          <div className="grid gap-2">
            {!tasks.length ? (
              <p className="rounded-md border border-dashed border-journey-line p-3 text-sm font-bold text-journey-steel">
                Add tasks to show the printed checklist.
              </p>
            ) : null}
            {tasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[18px_1fr_auto] items-start gap-2 rounded-md border border-journey-line p-2"
              >
                <span className="mt-0.5 h-4 w-4 rounded-sm border border-journey-black" />
                <span>
                  <span className="block text-sm font-black text-journey-black">
                    {task.name}
                  </span>
                  <span className="block text-xs leading-5 text-journey-steel">
                    {task.description}
                  </span>
                </span>
                <span className="text-xs font-black text-journey-red">
                  +{task.milesValue}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-journey-line pt-3">
            <p className="text-xs font-black uppercase text-journey-steel">
              Manager initials
            </p>
            <p className="text-sm font-black text-journey-black">
              {tasks.length} items / {totalXp} XP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JourneyCardDesigner() {
  const { state, updateState } = useJourneyState();
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>("active");
  const allAreas = useMemo(
    () => state.journeyCardAreas.slice().sort(sortAreas),
    [state.journeyCardAreas],
  );
  const areas = useMemo(
    () => allAreas.filter((area) => matchesArchiveFilter(area, archiveFilter)),
    [allAreas, archiveFilter],
  );
  const [selectedAreaId, setSelectedAreaId] = useState(allAreas[0]?.id ?? "");
  const [saved, setSaved] = useState(false);
  const [showOnlySelectedTasks, setShowOnlySelectedTasks] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [toast, setToast] = useState<StatusToastState | null>(null);
  const selectedArea =
    areas.find((area) => area.id === selectedAreaId) ?? areas[0];
  const cardTasks = state.recognitionTypes
    .filter((type) => type.journeyCardEligible || type.type === "journey_card_task")
    .filter((type) => matchesArchiveFilter(type, archiveFilter))
    .slice()
    .sort(sortTasks);
  const assignedEmployees = state.employees.filter(
    (employee) =>
      employee.role === "employee" &&
      employee.active !== false &&
      employee.journeyCardAreaId === selectedArea?.id,
  );
  const selectedAreaTasks = cardTasks.filter((task) =>
    taskAppearsOnArea(task, selectedArea?.id),
  );
  const visibleCardTasks = showOnlySelectedTasks ? selectedAreaTasks : cardTasks;
  const enabledSelectedAreaTasks = selectedAreaTasks.filter(
    (task) => task.enabled && !isArchived(task),
  );
  const selectedAreaXp = enabledSelectedAreaTasks.reduce(
    (total, task) => total + task.milesValue,
    0,
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
    setToast(null);
    updateState((current) => {
      const nextOrder =
        Math.max(0, ...current.journeyCardAreas.map((area) => area.sortOrder)) + 10;
      const id = `${makeSlugId("New Card Area", "card_area")}-${Date.now()}`;
      const nextArea: JourneyCardArea = {
        id,
        name: "New Card Area",
        description: "Describe which crew members should receive this Experience Card.",
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

  function removeArea(id: string) {
    const area = state.journeyCardAreas.find((item) => item.id === id);
    if (!area) {
      setToast({ tone: "error", message: "That Experience Card area could not be found." });
      return;
    }

    const hasRelatedRecords =
      state.employees.some((employee) => employee.journeyCardAreaId === id) ||
      state.journeyCardAssignments.some((assignment) => assignment.journeyCardAreaId === id) ||
      state.recognitionTypes.some((type) => type.journeyCardAreaIds?.includes(id));
    const canDeletePermanently = isDraftLikeId(id) && !hasRelatedRecords;
    const nextArea = allAreas.find((item) => item.id !== id && !isArchived(item));

    setConfirmDialog({
      title: canDeletePermanently ? `Delete ${area.name}?` : `Archive ${area.name}?`,
      destructive: true,
      confirmLabel: canDeletePermanently ? "Delete Permanently" : "Archive Area",
      body: canDeletePermanently ? (
        <p>
          This draft/test card area has no employees, print runs, or tasks tied to it,
          so it will be permanently removed.
        </p>
      ) : (
        <div className="grid gap-2">
          <p>
            This card area will be archived and disabled. It will no longer appear in
            daily print runs or card entry.
          </p>
          <p>
            Existing employees and historical card batches remain intact.
          </p>
        </div>
      ),
      onConfirm: () => {
        try {
          setSaved(false);
          setSelectedAreaId(nextArea?.id ?? "");
          updateState((current) => ({
            ...current,
            journeyCardAreas: canDeletePermanently
              ? current.journeyCardAreas.filter((item) => item.id !== id)
              : current.journeyCardAreas.map((item) =>
                  item.id === id ? { ...item, ...archiveConfigPatch() } : item,
                ),
            employees: canDeletePermanently
              ? current.employees.map((employee) =>
                  employee.journeyCardAreaId === id
                    ? { ...employee, journeyCardAreaId: nextArea?.id }
                    : employee,
                )
              : current.employees,
            recognitionTypes: canDeletePermanently
              ? current.recognitionTypes.map((type) => ({
                  ...type,
                  journeyCardAreaIds: type.journeyCardAreaIds?.filter(
                    (areaId) => areaId !== id,
                  ),
                }))
              : current.recognitionTypes,
          }));
          setToast({
            tone: "success",
            message: canDeletePermanently
              ? `${area.name} deleted.`
              : `${area.name} archived and removed from active card workflows.`,
          });
        } catch (error) {
          setToast({
            tone: "error",
            message:
              error instanceof Error ? error.message : "Unable to update that card area.",
          });
        }
      },
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
    setToast(null);
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

  function removeTask(id: string) {
    const task = state.recognitionTypes.find((item) => item.id === id);
    if (!task) {
      setToast({ tone: "error", message: "That card task could not be found." });
      return;
    }

    const hasHistory =
      recognitions.some((recognition) => recognition.recognitionTypeId === id) ||
      getJourneyMoments().some((moment) => moment.recognitionTypeId === id) ||
      state.excellenceLogs.some((log) => log.recognitionTypeId === id);
    const canDeletePermanently = isDraftLikeId(id) && !hasHistory;

    setConfirmDialog({
      title: canDeletePermanently ? `Delete ${task.name}?` : `Archive ${task.name}?`,
      destructive: true,
      confirmLabel: canDeletePermanently ? "Delete Permanently" : "Archive Task",
      body: canDeletePermanently ? (
        <p>
          This draft/test card task has no Experience Moments tied to it, so it will
          be permanently removed.
        </p>
      ) : (
        <div className="grid gap-2">
          <p>
            This task will be archived, disabled, and removed from active Experience
            Cards immediately.
          </p>
          <p>Historical Experience Moments and XP remain intact.</p>
        </div>
      ),
      onConfirm: () => {
        try {
          setSaved(false);
          updateState((current) => ({
            ...current,
            recognitionTypes: canDeletePermanently
              ? current.recognitionTypes.filter((type) => type.id !== id)
              : current.recognitionTypes.map((type) =>
                  type.id === id
                    ? {
                        ...type,
                        ...archiveConfigPatch(),
                        journeyCardEligible: false,
                        journeyCardAreaIds: [],
                      }
                    : type,
                ),
          }));
          setToast({
            tone: "success",
            message: canDeletePermanently
              ? `${task.name} deleted.`
              : `${task.name} archived and removed from active cards.`,
          });
        } catch (error) {
          setToast({
            tone: "error",
            message:
              error instanceof Error ? error.message : "Unable to update that card task.",
          });
        }
      },
    });
  }

  if (!selectedArea) {
    return (
      <Panel>
        <PanelHeader title="Experience Card Builder" eyebrow="Areas and Tasks" />
        <Button type="button" icon={Plus} onClick={addArea}>
          Add Experience Card Area
        </Button>
      </Panel>
    );
  }

  return (
    <Panel className="mt-5">
      <PanelHeader
        title="Experience Card Builder"
        eyebrow="Card template design"
        action={<ClipboardList className="h-5 w-5 text-journey-red" aria-hidden="true" />}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-3xl text-sm font-bold leading-6 text-journey-steel">
          Build reusable write-in card templates by work area. Staff write their
          name on the paper card, and managers choose the employee when the card
          is entered.
        </p>
        <div className="flex flex-wrap gap-2">
          <ArchiveFilterControls value={archiveFilter} onChange={setArchiveFilter} />
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
          Experience Card configuration saved for this preview browser.
        </div>
      ) : null}

      <StatusToast toast={toast} />

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
                {isArchived(area) ? "Archived" : area.enabled ? "Enabled" : "Disabled"}
              </p>
              <h3 className="mt-1 text-lg font-black">{area.name}</h3>
              <p className="mt-2 text-xs font-bold opacity-80">
                {cardTasks.filter((task) => taskAppearsOnArea(task, area.id)).length} tasks
              </p>
            </button>
          ))}
        </div>

        <div className="grid gap-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-journey-line bg-journey-white p-4">
              <p className="text-xs font-black uppercase text-journey-red">
                On This Card
              </p>
              <p className="mt-1 text-3xl font-black text-journey-black">
                {enabledSelectedAreaTasks.length}
              </p>
              <p className="text-sm font-bold text-journey-steel">
                enabled checklist items
              </p>
            </div>
            <div className="rounded-lg border border-journey-line bg-journey-white p-4">
              <p className="text-xs font-black uppercase text-journey-red">
                Possible XP
              </p>
              <p className="mt-1 text-3xl font-black text-journey-black">
                {selectedAreaXp}
              </p>
              <p className="text-sm font-bold text-journey-steel">
                if every item is verified
              </p>
            </div>
            <div className="rounded-lg border border-journey-line bg-journey-white p-4">
              <p className="text-xs font-black uppercase text-journey-red">
                Default Crew
              </p>
              <p className="mt-1 text-3xl font-black text-journey-black">
                {assignedEmployees.length}
              </p>
              <p className="text-sm font-bold text-journey-steel">
                by employee setup only
              </p>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
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
                disabled={isArchived(selectedArea)}
              >
                {isArchived(selectedArea)
                  ? "Archived"
                  : selectedArea.enabled
                    ? "Enabled"
                    : "Disabled"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                icon={Trash2}
                onClick={() => removeArea(selectedArea.id)}
              >
                Delete Area
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
              Default active crew:{" "}
              <span className="font-black text-journey-black">
                {assignedEmployees.map((employee) => employee.name).join(", ") || "None yet"}
              </span>
            </p>
          </div>

          <CardTemplatePreview area={selectedArea} tasks={enabledSelectedAreaTasks} />
          </div>

          <div className="rounded-lg border border-journey-line bg-journey-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-journey-red">
                  Card task library
                </p>
                <h3 className="mt-1 text-xl font-black text-journey-black">
                  {showOnlySelectedTasks ? "Tasks on this card" : "All card tasks"}
                </h3>
              </div>
              <Button
                type="button"
                variant="secondary"
                icon={showOnlySelectedTasks ? ClipboardList : ListChecks}
                onClick={() => setShowOnlySelectedTasks((current) => !current)}
              >
                {showOnlySelectedTasks ? "Show All Tasks" : "Show On Card"}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-journey-line">
            <table className="w-full min-w-[1040px] border-collapse bg-journey-white text-left">
              <thead>
                <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
                  <th className="p-3">On Card</th>
                  <th className="p-3">Task</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Standard</th>
                  <th className="p-3">XP</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {visibleCardTasks.map((task) => {
                  const onCard = taskAppearsOnArea(task, selectedArea.id);
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
                          disabled={isArchived(task)}
                        >
                          {isArchived(task) ? "Archived" : task.enabled ? "Enabled" : "Disabled"}
                        </Button>
                      </td>
                      <td className="p-3">
                        <Button
                          type="button"
                          variant="ghost"
                          icon={Trash2}
                          onClick={() => removeTask(task.id)}
                        >
                          Delete
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
      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </Panel>
  );
}
