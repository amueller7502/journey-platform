import { HandHeart, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RecognitionForm } from "@/components/forms/RecognitionForm";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { chapterStats, enabledRecognitionTypes } from "@/lib/data";

export default function RecognizeEmployeePage() {
  return (
    <AppShell role="manager" title="Capture Moment" eyebrow="Manager Tools">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <Panel>
          <PanelHeader title="Recognize Moment" eyebrow="Fast manager entry" />
          <RecognitionForm />
        </Panel>
        <div className="grid gap-5">
          <MetricCard
            label="Enabled Types"
            value={`${enabledRecognitionTypes.length}`}
            detail="Builder-managed library"
            icon={HandHeart}
          />
          <MetricCard
            label="Today"
            value={`+${chapterStats.todayMiles} XP`}
            detail="XP recognized"
            icon={ShieldCheck}
          />
        </div>
      </div>
    </AppShell>
  );
}
