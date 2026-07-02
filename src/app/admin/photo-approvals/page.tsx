import { Camera } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProfilePhotoApprovals } from "@/components/admin/ProfilePhotoApprovals";
import { LinkButton } from "@/components/ui/Button";

export default function PhotoApprovalsPage() {
  return (
    <AppShell
      role="admin"
      title="Photo Approvals"
      eyebrow="Employee profiles"
      actions={
        <LinkButton href="/admin/employees" icon={Camera} variant="secondary">
          Employee Roster
        </LinkButton>
      }
    >
      <ProfilePhotoApprovals />
    </AppShell>
  );
}
