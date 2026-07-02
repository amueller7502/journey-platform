"use client";

import { useId, useMemo, useState } from "react";
import { Search, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { saveJourneyMoment, type JourneyMoment } from "@/lib/demo-moments";
import { isArchived } from "@/lib/archive";
import {
  addMilesToEmployee,
  replaceJourneyStateFromServer,
  useJourneyState,
  type JourneyOperatingState,
} from "@/lib/journey-state";

const quickTypeIds = [
  "guest_compliment",
  "help_another_department",
  "picked_up_shift",
  "manager_above_beyond",
];

function initialEmployeeFromUrl(crew: Array<{ id: string }>) {
  if (typeof window === "undefined") {
    return crew[0]?.id ?? "";
  }

  const requestedEmployeeId = new URLSearchParams(window.location.search).get("employee");
  return requestedEmployeeId && crew.some((employee) => employee.id === requestedEmployeeId)
    ? requestedEmployeeId
    : crew[0]?.id ?? "";
}

export function RecognitionForm() {
  const formId = useId();
  const { state } = useJourneyState();
  const crew = useMemo(
    () =>
      state.employees.filter(
        (employee) => employee.role === "employee" && employee.active !== false,
      ),
    [state.employees],
  );
  const recognitionOptions = useMemo(
    () =>
      state.recognitionTypes
        .filter(
          (type) =>
            type.enabled &&
            !isArchived(type) &&
            type.type !== "excellence_check" &&
            type.type !== "journey_card_task",
        )
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [state.recognitionTypes],
  );
  const [search, setSearch] = useState("");
  const [employeeId, setEmployeeId] = useState(() => initialEmployeeFromUrl(crew));
  const [recognitionTypeId, setRecognitionTypeId] = useState(
    recognitionOptions[0]?.id ?? "",
  );
  const [miles, setMiles] = useState(recognitionOptions[0]?.milesValue ?? 0);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  const selectedEmployeeId = crew.some((employee) => employee.id === employeeId)
    ? employeeId
    : crew[0]?.id ?? "";
  const selectedRecognitionTypeId = recognitionOptions.some(
    (type) => type.id === recognitionTypeId,
  )
    ? recognitionTypeId
    : recognitionOptions[0]?.id ?? "";

  const recognitionType = useMemo(
    () => recognitionOptions.find((item) => item.id === selectedRecognitionTypeId),
    [recognitionOptions, selectedRecognitionTypeId],
  );
  const employee = crew.find((item) => item.id === selectedEmployeeId);
  const filteredCrew = crew.filter((item) =>
    `${item.name} ${item.title} ${item.passportId}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const quickTypes = quickTypeIds
    .map((id) => recognitionOptions.find((item) => item.id === id))
    .filter(Boolean);
  const canChooseManagerMiles = selectedRecognitionTypeId === "manager_above_beyond";
  const effectiveMiles = canChooseManagerMiles
    ? miles
    : recognitionType?.milesValue ?? miles;

  function selectRecognitionType(id: string) {
    const nextType = recognitionOptions.find((item) => item.id === id);

    setRecognitionTypeId(id);
    setSubmitted(false);
    if (nextType) {
      setMiles(nextType.milesValue);
    }
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!employee || !recognitionType) {
          return;
        }

        setSubmitting(true);
        setError("");
        const nextSubmitCount = submitCount + 1;
        setSubmitCount(nextSubmitCount);
        const fallbackMoment: JourneyMoment = {
          id: `${formId}-${nextSubmitCount}`,
          employeeId: employee.id,
          employeeName: employee.name,
          employeeInitials: employee.initials,
          recognitionTypeId: recognitionType.id,
          recognitionTypeName: recognitionType.name,
          standardId: recognitionType.standardId,
          miles: effectiveMiles,
          note:
            note.trim() ||
            `${employee.name} created an Experience Moment through ${recognitionType.name.toLowerCase()}.`,
          createdAt: new Date().toISOString(),
          managerName: "Jordan Ellis",
        };

        try {
          const response = await fetch("/api/experience/moments", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              employeeId: employee.id,
              recognitionTypeId: recognitionType.id,
              managerId: "mgr-jordan",
              xp: effectiveMiles,
              note,
            }),
          });
          const payload = (await response.json()) as {
            error?: string;
            mode?: "local" | "supabase";
            state?: JourneyOperatingState;
            moment?: JourneyMoment;
          };

          if (!response.ok) {
            throw new Error(payload.error ?? "Experience Moment could not be captured.");
          }

          if (payload.mode === "supabase" && payload.state) {
            replaceJourneyStateFromServer(payload.state);
            saveJourneyMoment(payload.moment ?? fallbackMoment);
          } else {
            saveJourneyMoment(fallbackMoment);
            addMilesToEmployee(employee.id, effectiveMiles);
          }
          setSubmitted(true);
        } catch (caughtError) {
          saveJourneyMoment(fallbackMoment);
          addMilesToEmployee(employee.id, effectiveMiles);
          setSubmitted(true);
          setError(
            caughtError instanceof Error
              ? `${caughtError.message} Saved locally as fallback.`
              : "Saved locally as fallback.",
          );
        } finally {
          setSubmitting(false);
        }
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
            Standard and XP are automatic.
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
              placeholder="Name, role, or Experience Card ID"
            />
          </div>
          <select
            value={selectedEmployeeId}
            onChange={(event) => {
              setEmployeeId(event.target.value);
              setSubmitted(false);
            }}
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
            value={selectedRecognitionTypeId}
            onChange={(event) => selectRecognitionType(event.target.value)}
            className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
          >
            {recognitionOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.milesValue} XP)
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
                  item?.id === selectedRecognitionTypeId
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

      {!recognitionOptions.length ? (
        <div className="rounded-lg border border-journey-line bg-journey-white p-4 text-sm font-bold text-journey-steel">
          No enabled recognition moments are available. Add or enable one in
          Recognition Builder.
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_0.35fr]">
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Optional Moment Note
          <textarea
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setSubmitted(false);
            }}
            rows={3}
            className="focus-ring resize-none rounded-md border border-journey-line bg-journey-white px-3 py-3"
            placeholder="What Moment mattered? Optional."
          />
        </label>

        <div className="grid gap-2 rounded-lg border border-journey-line bg-journey-white p-4">
          <p className="text-xs font-black uppercase text-journey-red">XP Earned</p>
          <p className="text-4xl font-black text-journey-black">{effectiveMiles}</p>
          <p className="text-sm font-bold text-journey-steel">
            {recognitionType?.name}
          </p>
          {canChooseManagerMiles ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {[25, 50, 75].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMiles(value)}
                  className={`focus-ring rounded-md border px-3 py-2 text-xs font-black ${
                    effectiveMiles === value
                      ? "border-journey-red bg-journey-red text-journey-white"
                      : "border-journey-line bg-journey-white text-journey-black"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          ) : null}
          <p className="text-xs font-bold text-journey-steel">
            Builders change XP values in Recognition Builder.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-journey-line bg-journey-mist p-4">
        <div>
          <p className="text-sm font-black text-journey-black">
            {employee?.name ?? "Employee"} receives {effectiveMiles} XP
          </p>
          <p className="mt-1 text-sm font-bold text-journey-steel">
            {recognitionType?.name} becomes an Experience Moment.
          </p>
        </div>
          <Button
            icon={Send}
            type="submit"
            disabled={submitting || submitted || !recognitionOptions.length}
          >
            {submitting ? "Capturing..." : submitted ? "Moment Captured" : "Capture Moment"}
          </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-journey-line bg-journey-mist p-4 text-sm font-black text-journey-red">
          {error}
        </div>
      ) : null}

      {submitted ? (
        <div className="flex items-start gap-3 rounded-lg border border-journey-red bg-journey-white p-4">
          <Sparkles className="mt-0.5 h-5 w-5 text-journey-red" aria-hidden="true" />
          <div>
            <p className="font-black text-journey-black">Experience Moment captured</p>
            <p className="mt-1 text-sm text-journey-steel">
              Experience Moment created for {employee?.name}. It now appears in Recent
              Moments and the TV Recognition Wall.
            </p>
          </div>
        </div>
      ) : null}
    </form>
  );
}
