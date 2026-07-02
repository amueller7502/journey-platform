import { AppShell } from "@/components/AppShell";
import { LeadershipExperienceView } from "@/components/leadership/LeadershipExperienceView";

export default function EmployeesAwaitingRecognitionPage() {
  return (
    <AppShell
      role="manager"
      title="Employees Awaiting Recognition"
      eyebrow="Leadership Experience"
    >
      <LeadershipExperienceView view="awaiting" />
    </AppShell>
  );
}

