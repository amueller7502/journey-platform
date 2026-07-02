"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { saveJourneyMoment } from "@/lib/demo-moments";
import { recognitionStandards } from "@/lib/data";
import {
  addMilesToEmployee,
  getJourneyCardAreaForEmployee,
  useJourneyState,
} from "@/lib/journey-state";
import type { Employee } from "@/lib/types";

export function PassportEntryForm({
  employee,
  initialAreaId,
}: {
  employee: Employee;
  initialAreaId?: string;
}) {
  const { state } = useJourneyState();
  const currentEmployee =
    state.employees.find((item) => item.passportId === employee.passportId) ?? employee;
  const defaultCardArea = getJourneyCardAreaForEmployee(
    currentEmployee,
    state.journeyCardAreas,
  );
  const activeAreas = state.journeyCardAreas
    .filter((area) => area.enabled)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const [cardAreaId, setCardAreaId] = useState(
    initialAreaId ?? defaultCardArea?.id ?? activeAreas[0]?.id ?? "",
  );
  const cardArea =
    activeAreas.find((area) => area.id === cardAreaId) ?? defaultCardArea ?? activeAreas[0];
  const enabledRecognitionTypes = state.recognitionTypes
    .filter((type) => {
      if (!type.enabled || !type.journeyCardEligible) {
        return false;
      }

      if (!cardArea) {
        return true;
      }

      return (
        !type.journeyCardAreaIds?.length ||
        type.journeyCardAreaIds.includes(cardArea.id)
      );
    })
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const availableSelected = selected.filter((id) =>
    enabledRecognitionTypes.some((type) => type.id === id),
  );
  const selectedTypes = enabledRecognitionTypes.filter((type) =>
    availableSelected.includes(type.id),
  );
  const totalMiles = selectedTypes.reduce((total, type) => total + type.milesValue, 0);
  const submittedBatchId = `card-${currentEmployee.passportId.toLowerCase()}-today`;

  const grouped = recognitionStandards.map((standard) => ({
    standard,
    items: enabledRecognitionTypes.filter((type) => type.standardId === standard.id),
  }));

  if (submitted) {
    return (
      <div className="rounded-lg border border-journey-red bg-journey-white p-6 shadow-line">
        <CheckCircle2 className="h-10 w-10 text-journey-red" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black text-journey-black">
          Experience Card Batch Submitted
        </h2>
        <p className="mt-3 text-lg font-bold text-journey-steel">
          {currentEmployee.name} earned {totalMiles} XP from {selectedTypes.length} verified{" "}
          {cardArea?.name ?? "Experience Card"} items.
        </p>
        <p className="mt-4 text-sm font-bold text-journey-steel">
          Batch: {submittedBatchId}
        </p>
      </div>
    );
  }

  return (
    <form
      className="pb-24"
      onSubmit={(event) => {
        event.preventDefault();
        if (!selectedTypes.length) {
          return;
        }
        const createdAt = new Date().toISOString();
        const batchStamp = createdAt.replace(/[^0-9]/g, "");
        const batchId = `card-${currentEmployee.passportId}-${batchStamp}`;
        selectedTypes
          .slice()
          .reverse()
          .forEach((type, index) => {
            saveJourneyMoment({
              id: `card-${currentEmployee.passportId}-${batchStamp}-${index}`,
              employeeId: currentEmployee.id,
              employeeName: currentEmployee.name,
              employeeInitials: currentEmployee.initials,
              recognitionTypeId: type.id,
              recognitionTypeName: type.name,
              standardId: type.standardId,
              miles: type.milesValue,
              note:
                note.trim() ||
                `${currentEmployee.name} had ${type.name.toLowerCase()} verified from an Experience Card.`,
              createdAt,
              managerName: "Jordan Ellis",
              batchId,
            });
          });
        addMilesToEmployee(currentEmployee.id, totalMiles);
        setSubmitted(true);
      }}
    >
      <div className="grid gap-5">
        <section className="rounded-lg border border-journey-line bg-journey-mist p-4">
          <p className="text-xs font-black uppercase text-journey-red">
            {cardArea?.name ?? "Unassigned Experience Card"}
          </p>
          <h3 className="mt-1 text-xl font-black text-journey-black">
            Enter turned-in shift checklist
          </h3>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-journey-steel">
            Choose the Experience Card type the employee worked today, then select
            the items that were verified from the paper card they turned in.
          </p>
          <label className="mt-4 grid max-w-xl gap-2 text-sm font-bold text-journey-black">
            Experience Card Type Worked Today
            <select
              value={cardArea?.id ?? ""}
              onChange={(event) => {
                setCardAreaId(event.target.value);
                setSelected([]);
                setSubmitted(false);
              }}
              className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
            >
              {activeAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        {!enabledRecognitionTypes.length ? (
          <section className="rounded-lg border border-journey-line bg-journey-white p-4 text-sm font-bold text-journey-steel">
            No enabled Experience Card tasks match this employee&apos;s card area. Add tasks
            in Admin / Experience Cards.
          </section>
        ) : null}

        {grouped.map(({ standard, items }) => (
          items.length ? (
          <section key={standard.id} className="rounded-lg border border-journey-line bg-journey-white p-4 shadow-line">
            <div className="mb-4">
              <p className="text-xs font-black uppercase text-journey-red">
                {standard.shortLabel}
              </p>
              <h3 className="text-xl font-black text-journey-black">{standard.label}</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((item) => {
              const checked = availableSelected.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                      checked
                        ? "border-journey-red bg-journey-mist"
                        : "border-journey-line bg-journey-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        setSelected((current) =>
                          event.target.checked
                            ? [...current, item.id]
                            : current.filter((id) => id !== item.id),
                        )
                      }
                      className="mt-1 h-6 w-6 accent-journey-red"
                    />
                    <span>
                      <span className="block text-base font-black text-journey-black">
                        {item.name}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-journey-steel">
                        {item.description}
                      </span>
                      <span className="mt-2 block text-sm font-black text-journey-red">
                        +{item.milesValue} XP
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
          ) : null
        ))}
      </div>

      <label className="mt-5 grid gap-2 text-sm font-bold text-journey-black">
        Optional Manager Note
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          className="focus-ring resize-none rounded-md border border-journey-line px-3 py-3"
          placeholder="Anything to remember about this Experience Card?"
        />
      </label>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-journey-line bg-journey-white/95 p-4 shadow-premium">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">Batch total</p>
            <p className="text-2xl font-black text-journey-black">
              {totalMiles} XP from {selectedTypes.length} items
            </p>
          </div>
          <Button type="submit" icon={Send} disabled={!selectedTypes.length}>
            Submit Experience Card Batch
          </Button>
        </div>
      </div>
    </form>
  );
}
