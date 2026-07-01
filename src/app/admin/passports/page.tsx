import { QrCode } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { JourneyCardPrintList } from "@/components/admin/JourneyCardPrintList";
import { LinkButton } from "@/components/ui/Button";

export default function AdminPassportsPage() {
  return (
    <AppShell
      role="admin"
      title="Journey Cards"
      eyebrow="Paper to digital workflow"
      actions={<LinkButton href="/manager/passport" icon={QrCode}>Manager Entry</LinkButton>}
    >
      <JourneyCardPrintList />
    </AppShell>
  );
}
