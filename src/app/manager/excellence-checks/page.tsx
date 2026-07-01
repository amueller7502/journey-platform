import { ClipboardCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExcellenceCheckBoard } from "@/components/forms/ExcellenceCheckBoard";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { excellenceCheckTypes } from "@/lib/data";

export default function ExcellenceChecksPage() {
  return (
    <AppShell role="manager" title="Excellence Checks" eyebrow="Building Presentation">
      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <Panel>
          <PanelHeader title="Check Areas" eyebrow="10 Miles each" />
          <ExcellenceCheckBoard />
        </Panel>
        <div className="grid gap-5">
          <MetricCard
            label="Logged Today"
            value="2"
            detail="Lobby and theater"
            icon={ClipboardCheck}
          />
          <MetricCard
            label="Available"
            value={`${excellenceCheckTypes.length}`}
            detail="Enabled checks"
            icon={Sparkles}
          />
        </div>
      </div>
    </AppShell>
  );
}
