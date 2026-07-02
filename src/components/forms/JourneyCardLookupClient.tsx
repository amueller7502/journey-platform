"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Search } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { useJourneyState } from "@/lib/journey-state";

export function JourneyCardLookupClient() {
  const router = useRouter();
  const { state } = useJourneyState();
  const [passportId, setPassportId] = useState("ODY-1570-001");
  const [search, setSearch] = useState("");
  const areas = state.journeyCardAreas
    .filter((area) => area.enabled)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const [areaId, setAreaId] = useState(areas[0]?.id ?? "");
  const crew = state.employees.filter(
    (employee) => employee.role === "employee" && employee.active !== false,
  );
  const filteredCrew = crew.filter((employee) =>
    `${employee.name} ${employee.title} ${employee.passportId}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Panel>
        <PanelHeader title="Enter Turned-In Experience Card" eyebrow="End-of-shift entry" />
        <div className="rounded-lg border border-journey-line bg-journey-mist p-4">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-journey-red" aria-hidden="true" />
            <div>
              <p className="font-black text-journey-black">Paper checklist workflow</p>
              <p className="mt-1 text-sm font-bold text-journey-steel">
                Select the employee and the card type they worked today, then enter
                completed checklist items.
              </p>
            </div>
          </div>
        </div>
        <form
          className="mt-5 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(
              `/manager/passport/${encodeURIComponent(passportId.trim())}?area=${encodeURIComponent(areaId)}`,
            );
          }}
        >
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Experience Card ID
            <input
              value={passportId}
              onChange={(event) => setPassportId(event.target.value)}
              className="focus-ring min-h-12 rounded-md border border-journey-line px-3 text-lg font-black"
              placeholder="ODY-1570-001"
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
            Enter Checklist
          </button>
        </form>
      </Panel>

      <Panel>
        <PanelHeader title="Crew Lookup" eyebrow="Current roster" />
        <label className="relative mb-4 block">
          <Search
            className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-journey-steel"
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
