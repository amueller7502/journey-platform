import { AppShell } from "@/components/AppShell";
import { ExcellenceCheckBoard } from "@/components/forms/ExcellenceCheckBoard";
import { ExcellenceChecksSummary } from "@/components/forms/ExcellenceChecksSummary";
import { Panel, PanelHeader } from "@/components/ui/Panel";

export default function ExcellenceChecksPage() {
  return (
    <AppShell role="manager" title="Excellence Checks" eyebrow="Building Presentation">
      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <Panel>
          <PanelHeader
            title="Readiness Checks"
            eyebrow="Community progress, not spendable employee Miles"
          />
          <ExcellenceCheckBoard />
        </Panel>
        <ExcellenceChecksSummary />
      </div>
    </AppShell>
  );
}
