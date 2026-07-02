"use client";

import { Download, QrCode } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  buildJourneyCardUrl,
  getJourneyCardAreaForEmployee,
  useJourneyState,
} from "@/lib/journey-state";

export function JourneyCardPrintList() {
  const { state } = useJourneyState();
  const rows = state.employees
    .filter((employee) => employee.role === "employee" && employee.active !== false)
    .map((employee) => {
      const area = getJourneyCardAreaForEmployee(employee, state.journeyCardAreas);
      return {
        name: employee.name,
        passportId: employee.passportId,
        qrUrl: employee.passportQrUrl || buildJourneyCardUrl(employee.passportId),
        department:
          state.departments.find((department) => department.id === employee.department)?.name ??
          "",
        area: area?.name ?? "Unassigned",
      };
    });

  return (
    <>
      <Panel className="mt-5">
        <PanelHeader
          title="Printable Journey Card List"
          eyebrow="CSV / PDF-friendly"
          action={<Download className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((employee) => (
            <article
              key={employee.passportId}
              className="rounded-lg border border-journey-line bg-journey-white p-5 shadow-line"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-journey-red">
                    Journey Card
                  </p>
                  <h3 className="mt-2 text-xl font-black text-journey-black">
                    {employee.name}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-journey-steel">
                    {employee.department}
                  </p>
                  <p className="mt-1 text-sm font-black text-journey-red">
                    {employee.area}
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-journey-black text-journey-white">
                  <QrCode className="h-8 w-8" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-5 rounded-md border border-journey-line bg-journey-mist p-3">
                <p className="text-xs font-black uppercase text-journey-steel">
                  Journey Card ID
                </p>
                <p className="mt-1 text-lg font-black text-journey-black">
                  {employee.passportId}
                </p>
              </div>
              <p className="mt-4 break-all text-xs font-bold text-journey-steel">
                {employee.qrUrl}
              </p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel className="mt-5">
        <PanelHeader title="Export Preview" eyebrow="Copy-ready CSV rows" />
        <pre className="overflow-x-auto rounded-lg bg-journey-black p-4 text-xs font-bold text-journey-white">
{`name,journey_card_id,qr_url,department,card_area
${rows
  .map((employee) =>
    [
      employee.name,
      employee.passportId,
      employee.qrUrl,
      employee.department,
      employee.area,
    ].join(","),
  )
  .join("\n")}`}
        </pre>
      </Panel>
    </>
  );
}
