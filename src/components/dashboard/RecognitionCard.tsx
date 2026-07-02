import { getAction, getEmployee } from "@/lib/data";
import type { Recognition } from "@/lib/types";
import { formatShortDateTime } from "@/lib/utils";
import { StandardBadge } from "@/components/ui/StandardBadge";

export function RecognitionCard({ recognition }: { recognition: Recognition }) {
  const employee = getEmployee(recognition.employeeId);
  const manager = getEmployee(recognition.managerId);
  const action = getAction(recognition.recognitionTypeId);

  return (
    <article className="rounded-lg border border-journey-line bg-journey-white p-4 shadow-line">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-journey-black text-sm font-black text-journey-white">
          {employee?.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-journey-black">{employee?.name}</h3>
            <StandardBadge standardId={recognition.standardId} />
          </div>
          <p className="mt-1 text-sm font-bold text-journey-steel">
            {action?.name} by {manager?.name}
          </p>
          <p className="mt-3 border-l-4 border-journey-red pl-3 text-sm leading-6 text-journey-black">
            {recognition.note}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase text-journey-steel">
            <span>{formatShortDateTime(recognition.createdAt)}</span>
            <span className="text-journey-red">
              +{recognition.miles} XP Earned
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
