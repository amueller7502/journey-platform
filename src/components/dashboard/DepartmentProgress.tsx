"use client";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { useJourneyState } from "@/lib/journey-state";

export function DepartmentProgress({ inverse = false }: { inverse?: boolean }) {
  const { state } = useJourneyState();

  return (
    <div className="space-y-4">
      {state.departments.map((department) => (
        <ProgressBar
          key={department.id}
          label={department.name}
          value={department.progressMiles}
          max={department.goalMiles}
          inverse={inverse}
        />
      ))}
    </div>
  );
}
