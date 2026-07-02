"use client";

import { useEffect, useState } from "react";
import { RecognitionCard } from "@/components/dashboard/RecognitionCard";
import { StandardBadge } from "@/components/ui/StandardBadge";
import {
  type JourneyMoment,
  getJourneyMoments,
  subscribeToJourneyMoments,
} from "@/lib/demo-moments";
import type { Recognition } from "@/lib/types";
import { formatShortDateTime } from "@/lib/utils";

export function RecentMomentsFeed({
  initialRecognitions,
}: {
  initialRecognitions: Recognition[];
}) {
  const [journeyMoments, setJourneyMoments] = useState<JourneyMoment[]>([]);

  useEffect(() => {
    const loadMoments = () => setJourneyMoments(getJourneyMoments());
    loadMoments();
    return subscribeToJourneyMoments(loadMoments);
  }, []);

  return (
    <div className="grid gap-4">
      {journeyMoments.slice(0, 2).map((moment) => (
        <article
          key={moment.id}
          className="rounded-lg border border-journey-red bg-journey-white p-4 shadow-line"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-journey-black text-sm font-black text-journey-white">
              {moment.employeeInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black text-journey-black">
                  {moment.employeeName}
                </h3>
                <StandardBadge standardId={moment.standardId} />
              </div>
              <p className="mt-1 text-sm font-bold text-journey-steel">
                {moment.recognitionTypeName} by {moment.managerName}
              </p>
              <p className="mt-3 border-l-4 border-journey-red pl-3 text-sm leading-6 text-journey-black">
                {moment.note}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase text-journey-steel">
                <span>{formatShortDateTime(moment.createdAt)}</span>
                <span className="text-journey-red">
                  +{moment.miles} XP Earned
                </span>
              </div>
            </div>
          </div>
        </article>
      ))}

      {initialRecognitions.slice(0, 3).map((recognition) => (
        <RecognitionCard key={recognition.id} recognition={recognition} />
      ))}
    </div>
  );
}
