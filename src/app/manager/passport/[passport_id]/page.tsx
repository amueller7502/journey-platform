import { AppShell } from "@/components/AppShell";
import { JourneyCardEntryClient } from "@/components/forms/JourneyCardEntryClient";

export default async function PassportEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ passport_id: string }>;
  searchParams: Promise<{ area?: string }>;
}) {
  const { passport_id } = await params;
  const { area } = await searchParams;

  return (
    <AppShell role="manager" title="Experience Card Entry" eyebrow={passport_id}>
      <JourneyCardEntryClient passportId={passport_id} areaId={area} />
    </AppShell>
  );
}
