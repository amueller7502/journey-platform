import type { Metadata } from "next";
import { OdysseyManagerSubmission } from "@/components/public/OdysseyManagerSubmission";
import { OdysseyMasthead } from "@/components/public/OdysseyMasthead";
import { isArchived } from "@/lib/archive";
import { ODYSSEY_RECOGNITION_TYPE_IDS } from "@/lib/odyssey-config";
import { readExperienceState } from "@/lib/server/experience-state";
import {
  managerConsolePeople,
  managerConsoleRewards,
} from "@/lib/server/manager-console";
import { createManagerSubmissionCredential } from "@/lib/server/public-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manager Submission | The Odyssey Incentive",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ManagerSubmissionPage() {
  const submissionCredential = createManagerSubmissionCredential();
  const { state, mode } = await readExperienceState();
  const people = managerConsolePeople(state);
  const rewards = managerConsoleRewards(state);
  const odysseyTypeIds = new Set<string>(ODYSSEY_RECOGNITION_TYPE_IDS);
  const recognitionTypes = state.recognitionTypes
    .filter(
      (type) =>
        odysseyTypeIds.has(type.id) &&
        type.enabled &&
        !isArchived(type),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const cardAreas = state.journeyCardAreas
    .filter((area) => area.enabled && !isArchived(area))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="odyssey-public-shell min-h-screen px-3 py-3 text-[#fff8e7] sm:px-6 sm:py-6">
      <div className="odyssey-public-frame mx-auto max-w-5xl p-4 sm:p-7">
        <OdysseyMasthead compact />
        <section className="relative z-10 py-7">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#d71920]">
            Manager Submission
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-[#f3d878] sm:text-6xl">
            Capture the crew&apos;s voyage.
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#fff8e7]/70 sm:text-base">
            Award points, process Crew Quest cards, redeem rewards, and keep the manager
            and employee roster current from one unlisted page.
          </p>
        </section>
        <div className="relative z-10 pb-6">
          <OdysseyManagerSubmission
            submissionCredential={submissionCredential ?? ""}
            initialPeople={people}
            initialRewards={rewards}
            departments={state.departments.map((department) => ({
              id: department.id,
              name: department.name,
            }))}
            recognitionTypes={recognitionTypes}
            cardAreas={cardAreas}
            persistenceReady={mode === "supabase" && Boolean(submissionCredential)}
          />
        </div>
      </div>
    </main>
  );
}
