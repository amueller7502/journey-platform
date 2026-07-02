"use client";

import type { ReactNode } from "react";
import { FeatureComingSoon } from "@/components/FeatureComingSoon";
import { getFeature, isFeatureEnabled } from "@/lib/features";
import { useJourneyState } from "@/lib/journey-state";
import type { FeatureFlagId } from "@/lib/types";

export function FeatureRouteGuard({
  featureId,
  children,
}: {
  featureId: FeatureFlagId;
  children: ReactNode;
}) {
  const { state } = useJourneyState();
  const feature = getFeature(state.featureFlags, featureId);

  if (feature && !isFeatureEnabled(state.featureFlags, featureId)) {
    return (
      <main className="min-h-screen bg-journey-mist p-5 sm:p-8">
        <div className="mx-auto max-w-4xl">
          <FeatureComingSoon feature={feature} />
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
