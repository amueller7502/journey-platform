"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode, Search } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { useJourneyState } from "@/lib/journey-state";

export function JourneyCardLookupClient() {
  const router = useRouter();
  const { state } = useJourneyState();
  const [passportId, setPassportId] = useState("ODY-1570-001");
  const crew = state.employees.filter(
    (employee) => employee.role === "employee" && employee.active !== false,
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Panel>
        <PanelHeader title="Scan or Type Journey Card ID" eyebrow="Paper to digital" />
        <div className="rounded-lg border border-journey-line bg-journey-mist p-4">
          <div className="flex items-center gap-3">
            <QrCode className="h-8 w-8 text-journey-red" aria-hidden="true" />
            <div>
              <p className="font-black text-journey-black">QR URL format</p>
              <p className="mt-1 text-sm font-bold text-journey-steel">
                /manager/passport/[journey_card_id]
              </p>
            </div>
          </div>
        </div>
        <form
          className="mt-5 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(`/manager/passport/${encodeURIComponent(passportId.trim())}`);
          }}
        >
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Journey Card ID
            <input
              value={passportId}
              onChange={(event) => setPassportId(event.target.value)}
              className="focus-ring min-h-12 rounded-md border border-journey-line px-3 text-lg font-black"
              placeholder="ODY-1570-001"
            />
          </label>
          <button
            type="submit"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-journey-red px-4 py-2 text-sm font-black text-journey-white transition hover:bg-journey-black"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Open Journey Card
          </button>
        </form>
      </Panel>

      <Panel>
        <PanelHeader title="Crew Journey Cards" eyebrow="Current roster" />
        <div className="grid gap-3">
          {crew.map((employee) => (
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
                href={`/manager/passport/${employee.passportId}`}
                icon={QrCode}
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
