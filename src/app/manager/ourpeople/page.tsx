import { AppShell } from "@/components/AppShell";
import { OurPeopleIntakeClient } from "@/components/forms/OurPeopleIntakeClient";

export default function ManagerOurPeopleIntakePage() {
  return (
    <AppShell role="manager" title="OurPeople Intake" eyebrow="Manager Tools">
      <OurPeopleIntakeClient />
    </AppShell>
  );
}
