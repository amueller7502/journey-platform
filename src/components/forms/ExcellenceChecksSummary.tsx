"use client";

import { ClipboardCheck, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { useJourneyState } from "@/lib/journey-state";

export function ExcellenceChecksSummary() {
  const { state } = useJourneyState();
  const available = state.recognitionTypes.filter(
    (type) => type.enabled && type.type === "excellence_check",
  ).length;
  const today = new Date().toISOString().slice(0, 10);
  const loggedToday = state.excellenceLogs.filter((log) =>
    log.createdAt.startsWith(today),
  ).length;

  return (
    <div className="grid gap-5">
      <MetricCard
        label="Logged Today"
        value={`${loggedToday}`}
        detail="Building readiness logs"
        icon={ClipboardCheck}
      />
      <MetricCard
        label="Available"
        value={`${available}`}
        detail="Enabled checks"
        icon={Sparkles}
      />
    </div>
  );
}
