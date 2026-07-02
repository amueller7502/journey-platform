import {
  Navigation,
  SlidersHorizontal,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ChapterSettingsEditor } from "@/components/admin/ChapterSettingsEditor";
import { ExperienceStudioOverview } from "@/components/admin/ExperienceStudioOverview";
import { FeatureBuildoutPanel } from "@/components/admin/FeatureBuildoutPanel";
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
    <AppShell role="admin" title="Experience Studio" eyebrow="Rules and Display">
      <ExperienceStudioOverview />

      <div className="mt-5">
        <SettingsActionCards />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel id="recognition-policy">
          <PanelHeader title="Recognition Policy" eyebrow="Access" />
          <div className="grid gap-3">
            {[
              ["Employee", "View XP, community progress, rewards, profile"],
              ["Manager", "Capture moments, log checks, review rewards"],
              ["Admin/GM", "Manage seasons, inventory, analytics, settings"],
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
        <Panel id="tv-dashboard-settings">
          <PanelHeader
            title="TV Dashboard"
            eyebrow="Display loop"
            action={<SlidersHorizontal className="h-5 w-5 text-journey-red" aria-hidden="true" />}
          />
          <TvDisplaySettingsPanel />
        </Panel>
      </div>

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

      <Panel className="mt-5">
        <PanelHeader title="Season Settings" eyebrow="Editable fields" />
        <ChapterSettingsEditor settings={chapterSettings} />
      </Panel>

      <Panel className="mt-5">
        <PanelHeader title="Feature Buildout" eyebrow="Launch readiness" />
        <FeatureBuildoutPanel />
      </Panel>
    </AppShell>
  );
}
