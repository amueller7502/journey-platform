import { AppShell } from "@/components/AppShell";
import { CommunitySnapshot } from "@/components/dashboard/CommunitySnapshot";

export default function CommunityPage() {
  return (
    <AppShell role="employee" title="Community" eyebrow="More Than A Movie Starts With Us.">
      <CommunitySnapshot />
    </AppShell>
  );
}
