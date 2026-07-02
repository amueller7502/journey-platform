import {
  Navigation,
  SlidersHorizontal,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { FeatureVisible } from "@/components/FeatureVisible";
import { ChapterSettingsEditor } from "@/components/admin/ChapterSettingsEditor";
import { ExperienceStudioOverview } from "@/components/admin/ExperienceStudioOverview";
import { FeatureBuildoutPanel } from "@/components/admin/FeatureBuildoutPanel";
import { FeatureToggleManager } from "@/components/admin/FeatureToggleManager";
import { MenuConfigurationPanel } from "@/components/admin/MenuConfigurationPanel";
import { SettingsActionCards } from "@/components/admin/SettingsActionCards";
import { SkinSettingsPanel } from "@/components/admin/SkinSettingsPanel";
import { TvDisplaySettingsPanel } from "@/components/admin/TvDisplaySettingsPanel";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  activeSkin,
  chapterSettings,
  journeySkins,
  menuConfigurations,
} from "@/lib/data";

export default function SettingsPage() {
  return (
    <AppShell role="admin" title="Settings" eyebrow="Experience Builder">
      <FeatureToggleManager />

      <FeatureVisible featureId="experience_studio_advanced">
      <ExperienceStudioOverview />
      </FeatureVisible>

      <FeatureVisible featureId="experience_studio_advanced">
      <div className="mt-5">
        <SettingsActionCards />
      </div>
      </FeatureVisible>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel id="recognition-policy">
          <PanelHeader title="Lite Rules" eyebrow="Launch guardrails" />
          <div className="grid gap-3">
            {[
              ["Employee", "View XP, Rewards, My Experience, and Profile"],
              ["Manager", "Capture Moments, enter cards, print cards, approve rewards"],
              ["Experience Builder", "Configure recognitions, rewards, employees, and settings"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-journey-line p-4"
              >
                <p className="font-black text-journey-black">{label}</p>
                <p className="mt-1 text-sm font-bold text-journey-steel">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
        <FeatureVisible featureId="tv_display">
        <Panel id="tv-dashboard-settings">
          <PanelHeader
            title="TV Dashboard"
            eyebrow="Display loop"
            action={<SlidersHorizontal className="h-5 w-5 text-journey-red" aria-hidden="true" />}
          />
          <TvDisplaySettingsPanel />
        </Panel>
        </FeatureVisible>
      </div>

      <FeatureVisible featureId="experience_studio_advanced">
      <div className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel id="skin-developer">
          <PanelHeader title="Skin Developer" eyebrow="Season visuals" />
          <SkinSettingsPanel skins={journeySkins} activeSkinId={activeSkin.id} />
        </Panel>
        <Panel>
          <PanelHeader
            title="Menu Configuration"
            eyebrow="Reusable platform"
            action={<Navigation className="h-5 w-5 text-journey-red" aria-hidden="true" />}
          />
          <MenuConfigurationPanel items={menuConfigurations} />
        </Panel>
      </div>
      </FeatureVisible>

      <FeatureVisible featureId="seasons">
      <Panel className="mt-5">
        <PanelHeader title="Season Settings" eyebrow="Editable fields" />
        <ChapterSettingsEditor settings={chapterSettings} />
      </Panel>
      </FeatureVisible>

      <FeatureVisible featureId="experience_studio_advanced">
      <Panel className="mt-5">
        <PanelHeader title="Feature Buildout" eyebrow="Launch readiness" />
        <FeatureBuildoutPanel />
      </Panel>
      </FeatureVisible>
    </AppShell>
  );
}
