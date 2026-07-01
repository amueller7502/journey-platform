import { AppShell } from "@/components/AppShell";
import { RecognitionTypeForm } from "@/components/admin/RecognitionTypeForm";
import { Panel, PanelHeader } from "@/components/ui/Panel";

export default function AddRecognitionTypePage() {
  return (
    <AppShell role="admin" title="Add Recognition Type" eyebrow="Recognition Library">
      <Panel>
        <PanelHeader title="New Recognition Type" eyebrow="Admin managed" />
        <RecognitionTypeForm />
      </Panel>
    </AppShell>
  );
}
