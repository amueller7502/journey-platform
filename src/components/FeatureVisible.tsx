"use client";

import type { ReactNode } from "react";
import { isFeatureEnabled } from "@/lib/features";
import { useJourneyState } from "@/lib/journey-state";
import type { FeatureFlagId } from "@/lib/types";

export function FeatureVisible({
  featureId,
  children,
}: {
  featureId: FeatureFlagId;
  children: ReactNode;
}) {
  const { state } = useJourneyState();

  if (!isFeatureEnabled(state.featureFlags, featureId)) {
    return null;
  }

  return <>{children}</>;
}
