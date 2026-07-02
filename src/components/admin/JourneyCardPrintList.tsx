"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, ClipboardCheck, Printer, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { useJourneyState } from "@/lib/journey-state";
import type { JourneyCardArea, JourneyCardShiftAssignment, RecognitionType } from "@/lib/types";
import { formatMiles } from "@/lib/utils";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function sortAreas(a: JourneyCardArea, b: JourneyCardArea) {
  return a.sortOrder - b.sortOrder;
}

function sortTasks(a: RecognitionType, b: RecognitionType) {
  return a.sortOrder - b.sortOrder;
}

export function JourneyCardPrintList() {
  const router = useRouter();
  const { state, updateState } = useJourneyState();
  const areas = useMemo(
    () => state.journeyCardAreas.filter((area) => area.enabled).slice().sort(sortAreas),
    [state.journeyCardAreas],
  );
  const activeCrew = state.employees
    .filter((employee) => employee.role === "employee" && employee.active !== false)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  const [shiftDate, setShiftDate] = useState(todayString());
  const [areaId, setAreaId] = useState(areas[0]?.id ?? "");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const assignments = state.journeyCardAssignments
    .filter((assignment) => assignment.shiftDate === shiftDate)
    .slice()
    .sort((a, b) => {
      const employeeA = state.employees.find((employee) => employee.id === a.employeeId);
      const employeeB = state.employees.find((employee) => employee.id === b.employeeId);
      return (employeeA?.name ?? "").localeCompare(employeeB?.name ?? "");
    });

  const selectedArea = areas.find((area) => area.id === areaId) ?? areas[0];

  function tasksForArea(currentAreaId: string) {
    return state.recognitionTypes
      .filter((type) => {
        if (!type.enabled || !type.journeyCardEligible) {
          return false;
        }

        return (
          !type.journeyCardAreaIds?.length ||
          type.journeyCardAreaIds.includes(currentAreaId)
        );
      })
      .slice()
      .sort(sortTasks);
  }

  function assignmentLabel(assignment: JourneyCardShiftAssignment) {
    const employee = state.employees.find((item) => item.id === assignment.employeeId);
    const area = areas.find((item) => item.id === assignment.journeyCardAreaId);
    return `${employee?.name ?? "Crew Member"} - ${area?.name ?? "Experience Card"}`;
  }

  function toggleEmployee(employeeId: string) {
    setSelectedEmployees((current) =>
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId],
    );
  }

  function assignCards() {
    if (!selectedArea || !selectedEmployees.length) {
      setMessage("Choose a card type and at least one employee.");
      return;
    }

    const now = new Date().toISOString();
    updateState((current) => {
      const existingKeys = new Set(
        current.journeyCardAssignments.map(
          (assignment) =>
            `${assignment.shiftDate}:${assignment.employeeId}:${assignment.journeyCardAreaId}`,
        ),
      );
      const nextAssignments = selectedEmployees
        .filter((employeeId) => !existingKeys.has(`${shiftDate}:${employeeId}:${selectedArea.id}`))
        .map((employeeId) => ({
          id: `shift-card-${shiftDate}-${employeeId}-${selectedArea.id}-${Date.now()}`,
          employeeId,
          journeyCardAreaId: selectedArea.id,
          shiftDate,
          createdAt: now,
        }));

      return {
        ...current,
        journeyCardAssignments: [
          ...current.journeyCardAssignments,
          ...nextAssignments,
        ],
      };
    });
    setMessage(
      `Created ${selectedEmployees.length} ${selectedArea.name} card assignment${
        selectedEmployees.length === 1 ? "" : "s"
      } for ${shiftDate}.`,
    );
  }

  function removeAssignment(id: string) {
    updateState((current) => ({
      ...current,
      journeyCardAssignments: current.journeyCardAssignments.filter(
        (assignment) => assignment.id !== id,
      ),
    }));
  }

  function printCards() {
    const now = new Date().toISOString();
    updateState((current) => ({
      ...current,
      journeyCardAssignments: current.journeyCardAssignments.map((assignment) =>
        assignment.shiftDate === shiftDate
          ? {
              ...assignment,
              printedAt: now,
            }
          : assignment,
      ),
    }));
    window.print();
  }

  function openManagerEntry(assignment: JourneyCardShiftAssignment) {
    const employee = state.employees.find((item) => item.id === assignment.employeeId);
    if (!employee) {
      return;
    }

    router.push(
      `/manager/passport/${encodeURIComponent(employee.passportId)}?area=${encodeURIComponent(
        assignment.journeyCardAreaId,
      )}`,
    );
  }

  return (
    <>
      <Panel className="mt-5">
        <PanelHeader
          title="Daily Experience Card Print Run"
          eyebrow="Shift checklist planner"
          action={
            <Button
              type="button"
              icon={Printer}
              variant="secondary"
              onClick={printCards}
              disabled={!assignments.length}
            >
              Print Today&apos;s Cards
            </Button>
          }
        />
        <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-lg border border-journey-line bg-journey-mist p-4">
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-bold text-journey-black">
                Shift Date
                <input
                  type="date"
                  value={shiftDate}
                  onChange={(event) => setShiftDate(event.target.value)}
                  className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-journey-black">
                Experience Card Type
                <select
                  value={areaId}
                  onChange={(event) => setAreaId(event.target.value)}
                  className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
                >
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-black text-journey-black">
                {selectedEmployees.length} selected
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  icon={Users}
                  onClick={() => setSelectedEmployees(activeCrew.map((employee) => employee.id))}
                >
                  Select All
                </Button>
                <Button type="button" icon={ClipboardCheck} onClick={assignCards}>
                  Create Cards
                </Button>
              </div>
            </div>

            {message ? (
              <p className="mt-3 rounded-md border border-journey-line bg-journey-white p-3 text-sm font-black text-journey-red">
                {message}
              </p>
            ) : null}

            <div className="mt-4 grid max-h-[520px] gap-2 overflow-y-auto pr-1">
              {activeCrew.map((employee) => (
                <label
                  key={employee.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-journey-line bg-journey-white p-3 text-sm font-bold text-journey-black"
                >
                  <span>
                    <span className="block font-black">{employee.name}</span>
                    <span className="text-xs text-journey-steel">
                      {employee.title} / {employee.shift}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => toggleEmployee(employee.id)}
                    className="h-5 w-5 accent-journey-red"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-journey-line bg-journey-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-journey-red">
                  Cards for {shiftDate}
                </p>
                <h3 className="mt-1 text-xl font-black text-journey-black">
                  {assignments.length} printable shift cards
                </h3>
              </div>
              <CalendarDays className="h-5 w-5 text-journey-red" aria-hidden="true" />
            </div>
            <div className="mt-4 grid gap-3">
              {!assignments.length ? (
                <p className="rounded-lg border border-dashed border-journey-line p-4 text-sm font-bold text-journey-steel">
                  Select employees, choose the card type they are scheduled for today,
                  then create cards.
                </p>
              ) : null}
              {assignments.map((assignment) => {
                const tasks = tasksForArea(assignment.journeyCardAreaId);
                return (
                  <div
                    key={assignment.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-journey-line p-3"
                  >
                    <div>
                      <p className="font-black text-journey-black">
                        {assignmentLabel(assignment)}
                      </p>
                      <p className="mt-1 text-sm font-bold text-journey-steel">
                        {tasks.length} checklist items /{" "}
                        {formatMiles(tasks.reduce((total, task) => total + task.milesValue, 0))}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        icon={ClipboardCheck}
                        onClick={() => openManagerEntry(assignment)}
                      >
                        Enter
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        icon={Trash2}
                        onClick={() => removeAssignment(assignment.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </Panel>

      <Panel className="mt-5 journey-print-section">
        <PanelHeader
          title="Printable Shift Cards"
          eyebrow="Half-sheet checklists"
          action={<Printer className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="journey-card-sheet grid gap-4 md:grid-cols-2">
          {assignments.map((assignment) => {
            const employee = state.employees.find((item) => item.id === assignment.employeeId);
            const area = areas.find((item) => item.id === assignment.journeyCardAreaId);
            const tasks = tasksForArea(assignment.journeyCardAreaId);
            const totalMiles = tasks.reduce((total, task) => total + task.milesValue, 0);

            return (
              <article
                key={`print-${assignment.id}`}
                className="journey-print-card overflow-hidden rounded-lg border-2 border-journey-black bg-journey-white"
              >
                <div className="border-b-4 border-journey-red bg-journey-black p-4 text-journey-white">
                  <p className="text-xs font-black uppercase text-journey-red">
                    Experience / Shift Card
                  </p>
                  <h3 className="mt-1 text-2xl font-black">Every Mile Matters</h3>
                  <p className="mt-1 text-sm font-bold text-journey-line">
                    Turn this card in to a manager at the end of the shift.
                  </p>
                </div>
                <div className="grid gap-4 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-black uppercase text-journey-red">
                        Crew Member
                      </p>
                      <h4 className="mt-1 text-xl font-black text-journey-black">
                        {employee?.name ?? "Crew Member"}
                      </h4>
                      <p className="mt-1 text-sm font-bold text-journey-steel">
                        {employee?.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-journey-red">
                        Card Type
                      </p>
                      <h4 className="mt-1 text-xl font-black text-journey-black">
                        {area?.name ?? "Experience Card"}
                      </h4>
                      <p className="mt-1 text-sm font-bold text-journey-steel">
                        {assignment.shiftDate} / {formatMiles(totalMiles)} possible
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md border border-journey-line">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="grid grid-cols-[28px_1fr_70px] gap-2 border-b border-journey-line px-3 py-2 last:border-b-0"
                      >
                        <span className="mt-0.5 h-5 w-5 rounded-sm border-2 border-journey-black" />
                        <div>
                          <p className="text-sm font-black text-journey-black">
                            {task.name}
                          </p>
                          <p className="text-[11px] font-bold leading-4 text-journey-steel">
                            {task.description}
                          </p>
                        </div>
                        <p className="text-right text-xs font-black text-journey-red">
                          +{task.milesValue}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 text-xs font-bold text-journey-black sm:grid-cols-3">
                    <div className="border-b border-journey-black pb-1">Employee initials</div>
                    <div className="border-b border-journey-black pb-1">Manager initials</div>
                    <div className="border-b border-journey-black pb-1">Entered in Experience</div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>

      <Panel className="mt-5">
        <PanelHeader title="Export Preview" eyebrow="Copy-ready rows" />
        <pre className="overflow-x-auto rounded-lg bg-journey-black p-4 text-xs font-bold text-journey-white">
{`shift_date,employee,journey_card_id,card_type,possible_miles
${assignments
  .map((assignment) => {
    const employee = state.employees.find((item) => item.id === assignment.employeeId);
    const area = areas.find((item) => item.id === assignment.journeyCardAreaId);
    const possibleMiles = tasksForArea(assignment.journeyCardAreaId).reduce(
      (total, task) => total + task.milesValue,
      0,
    );

    return [
      assignment.shiftDate,
      employee?.name ?? "",
      employee?.passportId ?? "",
      area?.name ?? "",
      possibleMiles,
    ].join(",");
  })
  .join("\n")}`}
        </pre>
      </Panel>
    </>
  );
}
