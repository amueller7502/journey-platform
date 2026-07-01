"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { useJourneyState } from "@/lib/journey-state";
import { formatMiles, percent } from "@/lib/utils";

export function ChapterProgress({ inverse = false }: { inverse?: boolean }) {
  const { state } = useJourneyState();
  const communityMiles = state.departments.reduce(
    (total, department) => total + department.progressMiles,
    0,
  );
  const communityGoal = state.chapter.communityGoalMiles;
  const progress = percent(communityMiles, communityGoal);

  return (
    <div className="space-y-5">
      <div>
        <p
          className={
            inverse
              ? "text-sm font-black uppercase text-journey-line"
              : "text-sm font-black uppercase text-journey-red"
          }
        >
          {state.chapter.subtitle}
        </p>
        <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-2">
          <p
            className={
              inverse
                ? "text-5xl font-black text-journey-white"
                : "text-5xl font-black text-journey-black"
            }
          >
            {progress}%
          </p>
          <p
            className={
              inverse
                ? "pb-2 text-lg font-bold text-journey-line"
                : "pb-2 text-lg font-bold text-journey-steel"
            }
          >
            {formatMiles(communityMiles)} of {formatMiles(communityGoal)} miles
          </p>
        </div>
      </div>
      <ProgressBar
        label={state.chapter.phrase}
        value={communityMiles}
        max={communityGoal}
        inverse={inverse}
      />
      <p
        className={
          inverse
            ? "text-sm font-bold text-journey-line"
            : "text-sm font-bold text-journey-steel"
        }
      >
        {state.chapter.imaxReference}
      </p>
    </div>
  );
}
