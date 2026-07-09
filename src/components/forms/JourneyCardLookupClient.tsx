"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Search } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { useJourneyState } from "@/lib/journey-state";
import type { Employee } from "@/lib/types";

export function JourneyCardLookupClient({ initialAreaId }: { initialAreaId?: string }) {
  const router = useRouter();
  const { state } = useJourneyState();
  const areas = state.journeyCardAreas
    .filter((area) => area.enabled)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const [entrySearch, setEntrySearch] = useState("");
  const [message, setMessage] = useState("");
  const [areaId, setAreaId] = useState(
    initialAreaId && areas.some((area) => area.id === initialAreaId)
      ? initialAreaId
      : areas[0]?.id ?? "",
  );
  const crew = state.employees.filter(
    (employee) => employee.role === "employee" && employee.active !== false,
  );
  const filteredCrew = crew.filter((employee) =>
    `${employee.name} ${employee.title} ${employee.passportId}`
      .toLowerCase()
      .includes(entrySearch.toLowerCase()),
  );

  function openEmployee(employee: Employee) {
    router.push(
      `/manager/passport/${encodeURIComponent(employee.passportId)}?area=${encodeURIComponent(areaId)}`,
    );
  }

  function findEmployeeFromCard() {
    const query = entrySearch.trim().toLowerCase();
    if (!query) {
      setMessage("Type the name written on the card or scan/type their Experience Card ID.");
      return;
    }

    const match =
      crew.find((employee) => employee.passportId.toLowerCase() === query) ??
      crew.find((employee) => employee.name.toLowerCase() === query) ??
      crew.find((employee) =>
        `${employee.name} ${employee.title} ${employee.passportId}`
          .toLowerCase()
          .includes(query),
      );

    if (!match) {
      setMessage("No active employee matched that name or card ID.");
      return;
    }

    openEmployee(match);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Panel>
        <PanelHeader title="Enter Turned-In Experience Card" eyebrow="End-of-shift entry" />
        <div className="rounded-lg border border-journey-line bg-journey-mist p-4">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-journey-red" aria-hidden="true" />
            <div>
              <p className="font-black text-journey-black">Write-in card workflow</p>
              <p className="mt-1 text-sm font-bold text-journey-steel">
                Type the name staff wrote on the card, choose the card type, then enter
                completed checklist items.
              </p>
            </div>
          </div>
        </div>
        <form
          className="mt-5 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            findEmployeeFromCard();
          }}
        >
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Name Written On Card Or Card ID
            <input
              value={entrySearch}
              onChange={(event) => {
                setEntrySearch(event.target.value);
                setMessage("");
              }}
              className="focus-ring min-h-12 rounded-md border border-journey-line px-3 text-lg font-black"
              placeholder="Alex Rivera or ODY-1570-001"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Experience Card Type Worked
            <select
              value={areaId}
              onChange={(event) => setAreaId(event.target.value)}
              className="focus-ring min-h-12 rounded-md border border-journey-line px-3 text-base font-bold"
            >
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-journey-red px-4 py-2 text-sm font-black text-journey-white transition hover:bg-journey-black"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Find Employee
          </button>
        </form>
        {message ? (
          <p className="mt-3 rounded-md border border-journey-line bg-journey-white p-3 text-sm font-black text-journey-red">
            {message}
          </p>
        ) : null}
      </Panel>

      <Panel>
        <PanelHeader title="Crew Lookup" eyebrow="Current roster" />
        <label className="relative mb-4 block">
          <Search
            className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-journey-steel"
            aria-hidden="true"
          />
          <input
            value={entrySearch}
            onChange={(event) => setEntrySearch(event.target.value)}
            className="focus-ring min-h-12 w-full rounded-md border border-journey-line bg-journey-white pl-11 pr-3 text-base font-bold"
            placeholder="Search name, role, or card ID"
          />
        </label>
        <div className="grid gap-3">
          {filteredCrew.map((employee) => (
            <div
              key={employee.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-journey-line p-4"
            >
              <div>
                <p className="font-black text-journey-black">{employee.name}</p>
                <p className="mt-1 text-sm font-bold text-journey-steel">
                  {employee.passportId}
                </p>
              </div>
              <LinkButton
                href={`/manager/passport/${employee.passportId}?area=${areaId}`}
                icon={ClipboardCheck}
                variant="secondary"
              >
                Enter
              </LinkButton>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
