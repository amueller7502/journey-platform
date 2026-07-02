"use client";

import { Rocket, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  applyFeaturePreset,
  featurePresets,
  mergeFeatureFlags,
} from "@/lib/features";
import { useJourneyState } from "@/lib/journey-state";
import type { FeatureFlag, FeatureFlagId, FeaturePresetId } from "@/lib/types";

const phaseOrder = ["Launch", "Later Season One", "Season Two", "Future Platform"];

function sortFeatures(a: FeatureFlag, b: FeatureFlag) {
  const phaseDelta = phaseOrder.indexOf(a.launchPhase) - phaseOrder.indexOf(b.launchPhase);
  return phaseDelta || a.sortOrder - b.sortOrder;
}

export function FeatureToggleManager() {
  const { state, updateState } = useJourneyState();
  const [saved, setSaved] = useState(false);
  const flags = useMemo(
    () => mergeFeatureFlags(state.featureFlags).slice().sort(sortFeatures),
    [state.featureFlags],
  );

  function setPreset(presetId: FeaturePresetId) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      featurePreset: presetId,
      featureFlags: applyFeaturePreset(current.featureFlags, presetId),
    }));
  }

  function updateFeature(id: FeatureFlagId, patch: Partial<FeatureFlag>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      featurePreset: "custom",
      featureFlags: mergeFeatureFlags(current.featureFlags).map((feature) =>
        feature.id === id ? { ...feature, ...patch } : feature,
      ),
    }));
  }

  return (
    <div className="grid gap-5">
      <Panel className="border-journey-red bg-journey-white">
        <PanelHeader
          title="Feature Toggles"
          eyebrow="Lite Launch Mode"
          action={<Rocket className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <p className="max-w-4xl text-sm font-bold leading-6 text-journey-steel">
          Experience Lite keeps launch simple: Capture Moment, Experience Card Entry,
          Print Daily Experience Cards, Employee Lookup, Employee XP Totals,
          Rewards, and Settings. Advanced work stays preserved and can be enabled later.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {featurePresets.map((preset) => (
            <Button
              key={preset.id}
              type="button"
              variant={state.featurePreset === preset.id ? "dark" : "secondary"}
              onClick={() => setPreset(preset.id)}
            >
              {preset.label}
            </Button>
          ))}
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Toggles
          </Button>
        </div>
        {saved ? (
          <p className="mt-3 text-sm font-black text-journey-red">
            Feature toggles saved.
          </p>
        ) : null}
      </Panel>

      <div className="grid gap-3 lg:hidden">
        {flags.map((feature) => (
          <article
            key={feature.id}
            className="rounded-lg border border-journey-line bg-journey-white p-4 shadow-line"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-journey-black">{feature.label}</p>
                <p className="mt-1 text-xs font-black uppercase text-journey-red">
                  {feature.launchPhase}
                </p>
              </div>
              <Button
                type="button"
                variant={feature.enabled ? "dark" : "secondary"}
                icon={feature.enabled ? ToggleRight : ToggleLeft}
                onClick={() => updateFeature(feature.id, { enabled: !feature.enabled })}
              >
                {feature.enabled ? "On" : "Off"}
              </Button>
            </div>
            <p className="mt-3 text-sm font-bold leading-6 text-journey-steel">
              {feature.description}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-journey-black">
                Minimum Role
                <select
                  value={feature.minimumRole}
                  onChange={(event) =>
                    updateFeature(feature.id, {
                      minimumRole: event.target.value as FeatureFlag["minimumRole"],
                    })
                  }
                  className="focus-ring min-h-11 rounded-md border border-journey-line px-3 text-sm font-bold"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Leader</option>
                  <option value="admin">Experience Builder</option>
                </select>
              </label>
              <div className="grid gap-2 text-sm font-bold text-journey-black">
                Navigation
                <Button
                  type="button"
                  variant={feature.visibleInNavigation ? "secondary" : "ghost"}
                  icon={feature.visibleInNavigation ? ToggleRight : ToggleLeft}
                  onClick={() =>
                    updateFeature(feature.id, {
                      visibleInNavigation: !feature.visibleInNavigation,
                    })
                  }
                >
                  {feature.visibleInNavigation ? "Shown" : "Hidden"}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-journey-line bg-journey-white shadow-line lg:block">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
              <th className="px-4 py-3">Feature</th>
              <th className="px-4 py-3">Phase</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Minimum Role</th>
              <th className="px-4 py-3">Navigation</th>
              <th className="px-4 py-3">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {flags.map((feature) => (
              <tr key={feature.id} className="border-b border-journey-line align-top">
                <td className="px-4 py-4">
                  <p className="font-black text-journey-black">{feature.label}</p>
                  <p className="mt-1 text-sm font-bold leading-5 text-journey-steel">
                    {feature.description}
                  </p>
                </td>
                <td className="px-4 py-4 text-sm font-black text-journey-black">
                  {feature.launchPhase}
                </td>
                <td className="px-4 py-4 text-sm font-bold text-journey-steel">
                  {feature.category}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={feature.minimumRole}
                    onChange={(event) =>
                      updateFeature(feature.id, {
                        minimumRole: event.target.value as FeatureFlag["minimumRole"],
                      })
                    }
                    className="focus-ring min-h-10 rounded-md border border-journey-line px-3 text-sm font-bold"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Leader</option>
                    <option value="admin">Experience Builder</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <Button
                    type="button"
                    variant={feature.visibleInNavigation ? "secondary" : "ghost"}
                    icon={feature.visibleInNavigation ? ToggleRight : ToggleLeft}
                    onClick={() =>
                      updateFeature(feature.id, {
                        visibleInNavigation: !feature.visibleInNavigation,
                      })
                    }
                  >
                    {feature.visibleInNavigation ? "Shown" : "Hidden"}
                  </Button>
                </td>
                <td className="px-4 py-4">
                  <Button
                    type="button"
                    variant={feature.enabled ? "dark" : "secondary"}
                    icon={feature.enabled ? ToggleRight : ToggleLeft}
                    onClick={() => updateFeature(feature.id, { enabled: !feature.enabled })}
                  >
                    {feature.enabled ? "On" : "Off"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
