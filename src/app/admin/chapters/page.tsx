import { Clapperboard } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ChapterManagementClient } from "@/components/admin/ChapterManagementClient";
import { Panel, PanelHeader } from "@/components/ui/Panel";

export default function ChapterManagementPage() {
  return (
    <AppShell role="admin" title="Activation Management" eyebrow="Experience">
      <ChapterManagementClient />

      <Panel className="mt-5">
        <PanelHeader
          title="Next Activation Draft"
          eyebrow="Planning"
          action={<Clapperboard className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="rounded-lg border border-dashed border-journey-line p-5">
          <p className="font-black text-journey-black">Next Activation</p>
          <p className="mt-2 text-sm font-bold text-journey-steel">
            Use Skin Developer, the Recognition Library, Rewards, Experience Cards,
            and TV Display Settings to prepare the next seasonal activation without
            rebuilding the platform.
          </p>
        </div>
      </Panel>
    </AppShell>
  );
}
