import { AppShell } from "@/components/AppShell";
import { JourneyCardLookupClient } from "@/components/forms/JourneyCardLookupClient";

export default function PassportLookupPage() {
  return (
    <AppShell role="manager" title="Journey Card Entry" eyebrow="Fast shift verification">
      <JourneyCardLookupClient />
    </AppShell>
  );
}
