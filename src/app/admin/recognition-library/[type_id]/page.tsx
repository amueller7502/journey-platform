import { AppShell } from "@/components/AppShell";
import { RecognitionTypeForm } from "@/components/admin/RecognitionTypeForm";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { getRecognitionType } from "@/lib/data";

export default async function EditRecognitionTypePage({
  params,
}: {
  params: Promise<{ type_id: string }>;
}) {
  const { type_id } = await params;
  const recognitionType = getRecognitionType(type_id);

  return (
    <AppShell
      role="admin"
      title="Edit Recognition Type"
      eyebrow={recognitionType?.name ?? "Recognition Library"}
    >
      <Panel>
        <PanelHeader title={recognitionType?.name ?? "Recognition Type"} eyebrow="Edit" />
        <RecognitionTypeForm typeId={type_id} />
      </Panel>
    </AppShell>
  );
}
