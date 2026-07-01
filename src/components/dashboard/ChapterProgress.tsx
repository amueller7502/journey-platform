import { COMMUNITY_GOAL_MILES, chapter, chapterStats } from "@/lib/data";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatMiles, percent } from "@/lib/utils";

export function ChapterProgress({ inverse = false }: { inverse?: boolean }) {
  const progress = percent(chapterStats.communityMiles, COMMUNITY_GOAL_MILES);

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
          {chapter.subtitle}
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
            {formatMiles(chapterStats.communityMiles)} of{" "}
            {formatMiles(COMMUNITY_GOAL_MILES)} miles
          </p>
        </div>
      </div>
      <ProgressBar
        label={chapter.phrase}
        value={chapterStats.communityMiles}
        max={COMMUNITY_GOAL_MILES}
        inverse={inverse}
      />
      <p
        className={
          inverse
            ? "text-sm font-bold text-journey-line"
            : "text-sm font-bold text-journey-steel"
        }
      >
        {chapter.imaxReference}
      </p>
    </div>
  );
}
