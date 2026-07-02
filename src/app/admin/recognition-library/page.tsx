import { Library } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RecognitionLibraryManager } from "@/components/admin/RecognitionLibraryManager";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { excellenceCheckTypes, recognitionTypes } from "@/lib/data";

export default function RecognitionLibraryPage() {
  return (
    <AppShell role="admin" title="Recognition Studio" eyebrow="Admin configurable">
      <div className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          label="Recognition Types"
          value={`${recognitionTypes.length}`}
          detail="Season-scoped rules"
          icon={Library}
        />
        <MetricCard
          label="Enabled"
          value={`${recognitionTypes.filter((type) => type.enabled).length}`}
          detail="Available to managers"
          icon={Library}
        />
        <MetricCard
          label="Excellence Checks"
          value={`${excellenceCheckTypes.length}`}
          detail="Subset of recognition types"
          icon={Library}
        />
      </div>

      <Panel className="mt-5">
        <PanelHeader title="Experience Moment Types" eyebrow="Create, edit, enable, disable" />
        <RecognitionLibraryManager />
      </Panel>
    </AppShell>
  );
}
