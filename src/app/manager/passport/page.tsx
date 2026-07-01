import { Search, QrCode } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { employees } from "@/lib/data";

export default function PassportLookupPage() {
  const crew = employees.filter((employee) => employee.role === "employee");

  return (
    <AppShell role="manager" title="Journey Card Entry" eyebrow="Fast shift verification">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel>
          <PanelHeader title="Scan or Type Journey Card ID" eyebrow="Paper to digital" />
          <div className="rounded-lg border border-journey-line bg-journey-mist p-4">
            <div className="flex items-center gap-3">
              <QrCode className="h-8 w-8 text-journey-red" aria-hidden="true" />
              <div>
                <p className="font-black text-journey-black">QR URL format</p>
                <p className="mt-1 text-sm font-bold text-journey-steel">
                  /manager/passport/[passport_id]
                </p>
              </div>
            </div>
          </div>
          <label className="mt-5 grid gap-2 text-sm font-bold text-journey-black">
            Journey Card ID
            <input
              className="focus-ring min-h-12 rounded-md border border-journey-line px-3 text-lg font-black"
              placeholder="ODY-1570-001"
            />
          </label>
          <LinkButton href="/manager/passport/ODY-1570-001" icon={Search} className="mt-4 w-full">
            Open Sample Journey Card
          </LinkButton>
        </Panel>

        <Panel>
          <PanelHeader title="Crew Journey Cards" eyebrow="Today" />
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
    </AppShell>
  );
}
