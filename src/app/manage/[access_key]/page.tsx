import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OdysseyManagerSubmission } from "@/components/public/OdysseyManagerSubmission";
import { OdysseyMasthead } from "@/components/public/OdysseyMasthead";
import { isArchived } from "@/lib/archive";
import { ODYSSEY_RECOGNITION_TYPE_IDS } from "@/lib/odyssey-config";
import { readExperienceState } from "@/lib/server/experience-state";
import { managerLinkKeyIsValid } from "@/lib/server/public-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manager Submission | The Odyssey Incentive",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ManagerSubmissionPage({
  params,
}: {
  params: Promise<{ access_key: string }>;
}) {
  const { access_key } = await params;
  if (!managerLinkKeyIsValid(access_key)) {
    notFound();
  }

  const { state, mode } = await readExperienceState();
  const crew = state.employees
    .filter((employee) => employee.role === "employee" && employee.active !== false)
    .map((employee) => ({
      id: employee.id,
      name: employee.name,
      title: employee.title,
      passportId: employee.passportId,
      journeyCardAreaId: employee.journeyCardAreaId,
      pointsLookupToken: employee.pointsLookupToken,
      points: employee.miles,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const leaders = state.employees
    .filter((employee) => employee.role !== "employee" && employee.active !== false)
    .map((employee) => ({ id: employee.id, name: employee.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
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
            Award an Experience Moment, process a turned-in Crew Quest card, or copy an
            employee&apos;s private points link. No employee account is required.
          </p>
        </section>
        <div className="relative z-10 pb-6">
          <OdysseyManagerSubmission
            managerKey={access_key}
            initialCrew={crew}
            leaders={leaders}
            recognitionTypes={recognitionTypes}
            cardAreas={cardAreas}
            persistenceReady={mode === "supabase"}
          />
        </div>
      </div>
    </main>
  );
}
