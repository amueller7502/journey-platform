import { AppShell } from "@/components/AppShell";
import { CommunitySnapshot } from "@/components/dashboard/CommunitySnapshot";

export default function CommunityPage() {
  return (
    <AppShell role="employee" title="Community" eyebrow="Every Mile Matters">
      <CommunitySnapshot />
    </AppShell>
  );
}
