"use client";

import { useId, useMemo, useState } from "react";
import { Search, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  enabledRecognitionTypes,
  employees,
} from "@/lib/data";
import { saveDemoMoment } from "@/lib/demo-moments";

const recognitionOptions = enabledRecognitionTypes.filter(
  (type) => type.type !== "excellence_check",
);

const quickTypeIds = [
  "guest_compliment",
  "help_another_department",
  "picked_up_shift",
  "manager_above_beyond",
];

export function RecognitionForm() {
  const formId = useId();
  const crew = employees.filter((employee) => employee.role === "employee");
  const [search, setSearch] = useState("");
  const [employeeId, setEmployeeId] = useState(crew[0]?.id ?? "");
  const [recognitionTypeId, setRecognitionTypeId] = useState(recognitionOptions[0].id);
  const [miles, setMiles] = useState(recognitionOptions[0].milesValue);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const recognitionType = useMemo(
    () => recognitionOptions.find((item) => item.id === recognitionTypeId),
    [recognitionTypeId],
  );
  const employee = crew.find((item) => item.id === employeeId);
  const filteredCrew = crew.filter((item) =>
    `${item.name} ${item.title} ${item.passportId}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const quickTypes = quickTypeIds
    .map((id) => recognitionOptions.find((item) => item.id === id))
    .filter(Boolean);

  function selectRecognitionType(id: string) {
    const nextType = recognitionOptions.find((item) => item.id === id);

    setRecognitionTypeId(id);
    if (nextType) {
      setMiles(nextType.milesValue);
    }
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!employee || !recognitionType) {
          return;
        }

        const nextSubmitCount = submitCount + 1;
        setSubmitCount(nextSubmitCount);
        saveDemoMoment({
          id: `${formId}-${nextSubmitCount}`,
          employeeId: employee.id,
          employeeName: employee.name,
          employeeInitials: employee.initials,
          recognitionTypeId: recognitionType.id,
          recognitionTypeName: recognitionType.name,
          standardId: recognitionType.standardId,
          miles,
          note:
            note.trim() ||
            `${employee.name} created a Journey Moment through ${recognitionType.name.toLowerCase()}.`,
          createdAt: new Date().toISOString(),
          managerName: "Jordan Ellis",
        });
        setSubmitted(true);
      }}
    >
      <div className="rounded-lg border border-journey-line bg-journey-mist p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              Under 10 seconds
            </p>
            <h3 className="mt-1 text-xl font-black text-journey-black">
              Search, select, Capture Moment.
            </h3>
          </div>
          <p className="text-sm font-bold text-journey-steel">
            Standard and Miles are automatic.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Search / Select Employee
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-journey-steel"
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="focus-ring min-h-11 w-full rounded-md border border-journey-line bg-journey-white pl-10 pr-3"
              placeholder="Name, role, or Journey Card ID"
            />
          </div>
          <select
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
            className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
          >
            {filteredCrew.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Recognize Moment
          <select
            value={recognitionTypeId}
            onChange={(event) => selectRecognitionType(event.target.value)}
            className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
          >
            {recognitionOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.milesValue} Miles)
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            {quickTypes.map((item) => (
              <button
                key={item?.id}
                type="button"
                onClick={() => item && selectRecognitionType(item.id)}
                className={`focus-ring rounded-md border px-3 py-2 text-xs font-black uppercase transition ${
                  item?.id === recognitionTypeId
                    ? "border-journey-red bg-journey-red text-journey-white"
                    : "border-journey-line bg-journey-white text-journey-black hover:bg-journey-mist"
                }`}
              >
                {item?.name}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.35fr]">
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Optional Moment Note
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            className="focus-ring resize-none rounded-md border border-journey-line bg-journey-white px-3 py-3"
            placeholder="What Moment mattered? Optional for demo."
          />
        </label>

        <div className="grid gap-2 rounded-lg border border-journey-line bg-journey-white p-4">
          <p className="text-xs font-black uppercase text-journey-red">Miles Earned</p>
          <p className="text-4xl font-black text-journey-black">{miles}</p>
          <p className="text-sm font-bold text-journey-steel">
            {recognitionType?.name}
          </p>
          <p className="text-xs font-bold text-journey-steel">
            Admins change Miles values in Recognition Library.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-journey-line bg-journey-mist p-4">
        <div>
          <p className="text-sm font-black text-journey-black">
            {employee?.name ?? "Employee"} receives {miles} Miles Earned
          </p>
          <p className="mt-1 text-sm font-bold text-journey-steel">
            {recognitionType?.name} becomes a Journey Moment.
          </p>
        </div>
        <Button icon={Send} type="submit">
          Capture Moment
        </Button>
      </div>

      {submitted ? (
        <div className="flex items-start gap-3 rounded-lg border border-journey-red bg-journey-white p-4">
          <Sparkles className="mt-0.5 h-5 w-5 text-journey-red" aria-hidden="true" />
          <div>
            <p className="font-black text-journey-black">Journey Moment captured</p>
            <p className="mt-1 text-sm text-journey-steel">
              Demo Moment created for {employee?.name}. It now appears in Recent
              Moments and the TV Recognition Wall on this browser.
            </p>
          </div>
        </div>
      ) : null}
    </form>
  );
}
