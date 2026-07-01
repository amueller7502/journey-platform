import { AppShell } from "@/components/AppShell";
import { JourneyCardEntryClient } from "@/components/forms/JourneyCardEntryClient";

export default async function PassportEntryPage({
  params,
}: {
  params: Promise<{ passport_id: string }>;
}) {
  const { passport_id } = await params;

  return (
    <AppShell role="manager" title="Journey Card Entry" eyebrow={passport_id}>
      <JourneyCardEntryClient passportId={passport_id} />
    </AppShell>
  );
}
