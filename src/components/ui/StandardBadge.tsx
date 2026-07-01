import { recognitionStandards } from "@/lib/data";
import type { StandardId } from "@/lib/types";

export function StandardBadge({ standardId }: { standardId: StandardId }) {
  const standard = recognitionStandards.find((item) => item.id === standardId);

  return (
    <span className="inline-flex items-center rounded-sm border border-journey-line bg-journey-mist px-2 py-1 text-xs font-bold text-journey-black">
      {standard?.shortLabel ?? standardId}
    </span>
  );
}
