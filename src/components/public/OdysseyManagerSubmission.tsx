"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ClipboardCheck,
  Gift,
  LoaderCircle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { OdysseyPeopleManager } from "@/components/public/OdysseyPeopleManager";
import { OdysseyRedemptionManager } from "@/components/public/OdysseyRedemptionManager";
import type {
  ManagerConsoleDepartment,
  ManagerConsolePerson,
  ManagerConsoleReward,
} from "@/lib/manager-console-types";
import type { JourneyCardArea, RecognitionType } from "@/lib/types";

type Mode = "moment" | "card" | "redeem" | "people";

type SubmissionStatus =
  | { kind: "idle" }
  | { kind: "working"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function OdysseyManagerSubmission({
  submissionCredential,
  initialPeople,
  initialRewards,
  departments,
  recognitionTypes,
  cardAreas,
  persistenceReady,
}: {
  submissionCredential: string;
  initialPeople: ManagerConsolePerson[];
  initialRewards: ManagerConsoleReward[];
  departments: ManagerConsoleDepartment[];
  recognitionTypes: RecognitionType[];
  cardAreas: JourneyCardArea[];
  persistenceReady: boolean;
}) {
  const [mode, setMode] = useState<Mode>("moment");
  const [people, setPeople] = useState(initialPeople);
  const [rewards, setRewards] = useState(initialRewards);
  const [search, setSearch] = useState("");
  const [employeeId, setEmployeeId] = useState(
    initialPeople.find((person) => person.role === "employee")?.id ?? "",
  );
  const [managerId, setManagerId] = useState(
    initialPeople.find((person) => person.role !== "employee")?.id ?? "",
  );
  const [recognitionTypeId, setRecognitionTypeId] = useState(
    recognitionTypes.find((type) => !type.journeyCardEligible)?.id ?? "",
  );
  const [cardAreaId, setCardAreaId] = useState(
    initialPeople.find((person) => person.role === "employee")?.journeyCardAreaId ??
      cardAreas[0]?.id ??
      "",
  );
  const [selectedCardTypeIds, setSelectedCardTypeIds] = useState<string[]>(() => {
    const firstCardType = recognitionTypes.find((type) => type.journeyCardEligible);
    return firstCardType ? [firstCardType.id] : [];
  });
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>({ kind: "idle" });
  const crew = useMemo(
    () => people.filter((person) => person.role === "employee"),
    [people],
  );
  const leaders = useMemo(
    () => people.filter((person) => person.role !== "employee"),
    [people],
  );

  const activeEmployeeId = crew.some((employee) => employee.id === employeeId)
    ? employeeId
    : crew[0]?.id ?? "";
  const activeManagerId = leaders.some((leader) => leader.id === managerId)
    ? managerId
    : leaders[0]?.id ?? "";

  const filteredCrew = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return crew;
    }

    return crew.filter((employee) =>
      `${employee.name} ${employee.title} ${employee.passportId}`
        .toLowerCase()
        .includes(query),
    );
  }, [crew, search]);

  const selectedEmployee =
    crew.find((employee) => employee.id === activeEmployeeId) ?? crew[0];
  const momentTypes = recognitionTypes.filter((type) => !type.journeyCardEligible);
  const selectedRecognition =
    momentTypes.find((type) => type.id === recognitionTypeId) ?? momentTypes[0];
  const availableCardTypes = recognitionTypes.filter(
    (type) =>
      type.journeyCardEligible &&
      (!type.journeyCardAreaIds?.length || type.journeyCardAreaIds.includes(cardAreaId)),
  );
  const selectedCardTypes = availableCardTypes.filter((type) =>
    selectedCardTypeIds.includes(type.id),
  );
  const selectedCardPoints = selectedCardTypes.reduce(
    (total, type) => total + type.milesValue,
    0,
  );

  function chooseEmployee(nextEmployeeId: string) {
    setEmployeeId(nextEmployeeId);
    const employee = crew.find((item) => item.id === nextEmployeeId);
    if (employee?.journeyCardAreaId) {
      setCardAreaId(employee.journeyCardAreaId);
    }
    setStatus({ kind: "idle" });
  }

  function addPoints(employee: ManagerConsolePerson, points: number) {
    setPeople((current) =>
      current.map((item) =>
        item.id === employee.id
          ? {
              ...item,
              points: item.points + points,
              availablePoints: item.availablePoints + points,
            }
          : item,
      ),
    );
  }

  async function submitMoment() {
    if (!selectedEmployee || !selectedRecognition || !activeManagerId) {
      return;
    }

    setStatus({ kind: "working", message: "Capturing the moment..." });
    try {
      const response = await fetch("/api/experience/moments", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-experience-manager-key": submissionCredential,
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          recognitionTypeId: selectedRecognition.id,
          managerId: activeManagerId,
          note,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "The points could not be saved.");
      }

      addPoints(selectedEmployee, selectedRecognition.milesValue);
      setNote("");
      setStatus({
        kind: "success",
        message: `${selectedEmployee.name} earned ${selectedRecognition.milesValue} points for ${selectedRecognition.name}.`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "The points could not be saved.",
      });
    }
  }

  async function submitCard() {
    if (!selectedEmployee || !activeManagerId || !cardAreaId || !selectedCardTypes.length) {
      return;
    }

    setStatus({ kind: "working", message: "Processing the Crew Quest card..." });
    try {
      const response = await fetch("/api/experience/card-batches", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-experience-manager-key": submissionCredential,
        },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          managerId: activeManagerId,
          areaId: cardAreaId,
          recognitionTypeIds: selectedCardTypes.map((type) => type.id),
          note,
        }),
      });
      const payload = (await response.json()) as { error?: string; totalXp?: number };
      if (!response.ok) {
        throw new Error(payload.error ?? "The Crew Quest card could not be saved.");
      }

      const points = payload.totalXp ?? selectedCardPoints;
      addPoints(selectedEmployee, points);
      setNote("");
      setStatus({
        kind: "success",
        message: `${selectedEmployee.name}'s Crew Quest card was processed for ${points} points.`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "The Crew Quest card could not be saved.",
      });
    }
  }

  const blocked = !persistenceReady || status.kind === "working";

  return (
    <div className="grid gap-5">
      {!persistenceReady ? (
        <div className="rounded-lg border border-[#d71920]/45 bg-[#fff1ed] p-4 text-sm font-bold text-[#8f1217]">
          Supabase is not connected in this environment. The screen is available for preview,
          but submissions are paused so points cannot be lost.
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#ccb567] bg-[#fffaf0] p-2 shadow-[0_12px_35px_rgba(8,27,36,.12)] sm:grid-cols-4">
        {([
          ["moment", "Capture Points", Sparkles],
          ["card", "Crew Quest", ClipboardCheck],
          ["redeem", "Redeem Points", Gift],
          ["people", "People", Users],
        ] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id);
              setStatus({ kind: "idle" });
            }}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-center text-xs font-black transition sm:flex-row sm:text-sm ${
              mode === id
                ? "bg-[#102631] text-[#f4d678] shadow-lg"
                : "text-[#294451] hover:bg-[#efe4c5]"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {mode === "people" ? (
        <OdysseyPeopleManager
          submissionCredential={submissionCredential}
          people={people}
          departments={departments}
          persistenceReady={persistenceReady}
          onPeopleChange={setPeople}
        />
      ) : mode === "redeem" ? (
        <OdysseyRedemptionManager
          submissionCredential={submissionCredential}
          people={people}
          rewards={rewards}
          managerId={activeManagerId}
          persistenceReady={persistenceReady}
          onChange={(nextPeople, nextRewards) => {
            setPeople(nextPeople);
            setRewards(nextRewards);
          }}
        />
      ) : (
      <section className="rounded-xl border border-[#ccb567] bg-[#fffaf0] p-4 shadow-[0_16px_45px_rgba(8,27,36,.14)] sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-black text-[#102631]">
            Manager submitting
            <select
              value={activeManagerId}
              onChange={(event) => setManagerId(event.target.value)}
              className="min-h-12 rounded-lg border-2 border-[#d4c27e] bg-white px-3 outline-none focus:border-[#d71920]"
            >
              {leaders.map((leader) => (
                <option key={leader.id} value={leader.id}>{leader.name}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-black text-[#102631]">
            Find crew member
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-[#9a7f39]" aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-h-12 w-full rounded-lg border-2 border-[#d4c27e] bg-white pl-10 pr-3 outline-none focus:border-[#d71920]"
                placeholder="Name or card ID"
              />
            </div>
          </label>
        </div>

        <label className="mt-4 grid gap-2 text-sm font-black text-[#102631]">
          Crew member
          <select
            value={selectedEmployee?.id ?? ""}
            onChange={(event) => chooseEmployee(event.target.value)}
            className="min-h-14 rounded-lg border-2 border-[#d4c27e] bg-white px-3 text-base outline-none focus:border-[#d71920]"
          >
            {filteredCrew.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} — {employee.points} points
              </option>
            ))}
          </select>
        </label>

        {selectedEmployee ? (
          <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-[#c8a958]/45 bg-[#102631] p-4 text-white">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f4d678]">Current total</p>
              <p className="mt-1 text-sm font-bold text-white/70">{selectedEmployee.name}</p>
            </div>
            <p className="text-3xl font-black text-[#f4d678]">{selectedEmployee.points}</p>
          </div>
        ) : null}

        {mode === "moment" ? (
          <div className="mt-6 grid gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b41920]">Experience Moment</p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-[#102631]">What happened?</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {momentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setRecognitionTypeId(type.id)}
                  className={`flex min-h-20 items-center justify-between gap-4 rounded-lg border-2 p-4 text-left transition ${
                    selectedRecognition?.id === type.id
                      ? "border-[#d71920] bg-[#fff1ed] shadow-md"
                      : "border-[#ded2a7] bg-white hover:border-[#c8a958]"
                  }`}
                >
                  <span className="font-black text-[#102631]">{type.name}</span>
                  <span className="shrink-0 rounded-full bg-[#102631] px-3 py-1 text-sm font-black text-[#f4d678]">
                    +{type.milesValue}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {mode === "card" ? (
          <div className="mt-6 grid gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b41920]">Turned-in card</p>
              <h2 className="mt-1 font-serif text-3xl font-bold text-[#102631]">Process Crew Quest</h2>
            </div>
            <label className="grid gap-2 text-sm font-black text-[#102631]">
              Area worked
              <select
                value={cardAreaId}
                onChange={(event) => {
                  setCardAreaId(event.target.value);
                  setSelectedCardTypeIds([]);
                }}
                className="min-h-12 rounded-lg border-2 border-[#d4c27e] bg-white px-3 outline-none focus:border-[#d71920]"
              >
                {cardAreas.map((area) => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </label>
            {availableCardTypes.map((type) => {
              const checked = selectedCardTypeIds.includes(type.id);
              return (
                <label
                  key={type.id}
                  className={`flex min-h-20 cursor-pointer items-center gap-4 rounded-lg border-2 p-4 ${
                    checked ? "border-[#d71920] bg-[#fff1ed]" : "border-[#ded2a7] bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      setSelectedCardTypeIds((current) =>
                        event.target.checked
                          ? [...current, type.id]
                          : current.filter((id) => id !== type.id),
                      )
                    }
                    className="h-6 w-6 shrink-0 accent-[#d71920]"
                  />
                  <span className="flex-1">
                    <span className="block font-black text-[#102631]">{type.name}</span>
                    <span className="mt-1 block text-sm font-semibold text-[#526875]">{type.description}</span>
                  </span>
                  <span className="font-black text-[#b41920]">+{type.milesValue}</span>
                </label>
              );
            })}
          </div>
        ) : null}

        <label className="mt-5 grid gap-2 text-sm font-black text-[#102631]">
          Optional manager note
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            className="resize-none rounded-lg border-2 border-[#d4c27e] bg-white p-3 outline-none focus:border-[#d71920]"
            placeholder="Add a detail only when it helps tell the story."
          />
        </label>

        {status.kind !== "idle" ? (
          <div
            className={`mt-5 flex items-start gap-3 rounded-lg border p-4 text-sm font-bold ${
              status.kind === "error"
                ? "border-[#d71920]/40 bg-[#fff1ed] text-[#9f1117]"
                : status.kind === "success"
                  ? "border-[#b89b48] bg-[#fff8df] text-[#51602e]"
                  : "border-[#d4c27e] bg-white text-[#526875]"
            }`}
            aria-live="polite"
          >
            {status.kind === "working" ? (
              <LoaderCircle className="h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
            ) : status.kind === "success" ? (
              <Check className="h-5 w-5 shrink-0" aria-hidden="true" />
            ) : null}
            {status.message}
          </div>
        ) : null}

        <button
          type="button"
          disabled={
            blocked ||
            !selectedEmployee ||
            !activeManagerId ||
            (mode === "moment" ? !selectedRecognition : !selectedCardTypes.length)
          }
          onClick={mode === "moment" ? submitMoment : submitCard}
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-[#d71920] px-5 text-base font-black text-white shadow-[0_12px_28px_rgba(215,25,32,.24)] transition hover:bg-[#ad1017] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {status.kind === "working" ? (
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : mode === "moment" ? (
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          )}
          {mode === "moment"
            ? `Award ${selectedRecognition?.milesValue ?? 0} Points`
            : `Process Card · ${selectedCardPoints} Points`}
        </button>
      </section>
      )}
    </div>
  );
}
