import { ClipboardCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { JourneyCardPrintList } from "@/components/admin/JourneyCardPrintList";
import { LinkButton } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";

export default function ManagerExperienceCardsPage() {
  return (
    <AppShell
      role="manager"
      title="Print Daily Experience Cards"
      eyebrow="Daily print run"
      actions={<LinkButton href="/manager/passport" icon={ClipboardCheck}>Lookup Card</LinkButton>}
    >
      <Panel className="bg-journey-black text-journey-white">
        <p className="text-xs font-black uppercase text-journey-red">
          Paper-to-digital shift workflow
        </p>
        <h2 className="mt-2 text-3xl font-black">
          Print generic cards by work area, let staff write their name, then enter
          verified items after shift handoff.
        </h2>
        <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-journey-line">
          Managers choose the employee when the card is turned in, so staff do not
          need to log in or receive a personalized card before the shift starts.
        </p>
      </Panel>
      <JourneyCardPrintList />
    </AppShell>
  );
}
