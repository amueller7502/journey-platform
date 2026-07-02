"use client";

import { LockKeyhole } from "lucide-react";
import type { FeatureFlag } from "@/lib/types";

export function FeatureComingSoon({ feature }: { feature: FeatureFlag }) {
  return (
    <div className="rounded-lg border border-journey-line bg-journey-white p-6 shadow-line">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-journey-black text-journey-white">
        <LockKeyhole className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="mt-5 text-xs font-black uppercase text-journey-red">
        Coming soon
      </p>
      <h2 className="mt-2 text-3xl font-black text-journey-black">
        {feature.label} is not enabled yet.
      </h2>
      <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-journey-steel">
        Experience is currently running in a simplified launch mode. This feature is
        preserved for a later rollout and can be turned on by an Admin/GM in Feature Toggles.
      </p>
      <p className="mt-4 inline-flex rounded-sm bg-journey-mist px-2 py-1 text-xs font-black uppercase text-journey-black">
        Launch phase: {feature.launchPhase}
      </p>
    </div>
  );
}
