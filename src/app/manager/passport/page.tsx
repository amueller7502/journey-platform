import { AppShell } from "@/components/AppShell";
import { JourneyCardLookupClient } from "@/components/forms/JourneyCardLookupClient";

export default async function PassportLookupPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;

  return (
    <AppShell role="manager" title="Experience Card Entry" eyebrow="Fast shift verification">
      <JourneyCardLookupClient initialAreaId={area} />
    </AppShell>
  );
}
