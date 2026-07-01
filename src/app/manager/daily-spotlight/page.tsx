import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DailySpotlightTool } from "@/components/forms/DailySpotlightTool";
import { Panel, PanelHeader } from "@/components/ui/Panel";

export default function DailySpotlightPage() {
  return (
    <AppShell role="manager" title="Daily Spotlight" eyebrow="TV Feature">
      <Panel>
        <PanelHeader
          title="Spotlight Moment"
          eyebrow="Today"
          action={<Sparkles className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <DailySpotlightTool />
      </Panel>
    </AppShell>
  );
}
