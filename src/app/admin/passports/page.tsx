import { ClipboardCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { JourneyCardDesigner } from "@/components/admin/JourneyCardDesigner";
import { LinkButton } from "@/components/ui/Button";

export default function AdminPassportsPage() {
  return (
    <AppShell
      role="admin"
      title="Experience Cards"
      eyebrow="Printable shift checklists"
      actions={
        <LinkButton href="/manager/passport" icon={ClipboardCheck}>
          Manager Entry
        </LinkButton>
      }
    >
      <JourneyCardDesigner />
    </AppShell>
  );
}
