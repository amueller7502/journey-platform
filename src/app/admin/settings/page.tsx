import {
  LockKeyhole,
  MonitorPlay,
  Navigation,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ChapterSettingsEditor } from "@/components/admin/ChapterSettingsEditor";
import { FeatureBuildoutPanel } from "@/components/admin/FeatureBuildoutPanel";
import { MenuConfigurationPanel } from "@/components/admin/MenuConfigurationPanel";
import { SkinSettingsPanel } from "@/components/admin/SkinSettingsPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  activeSkin,
  chapterSettings,
  journeySkins,
  menuConfigurations,
  tvPanels,
} from "@/lib/data";

export default function SettingsPage() {
  return (
    <AppShell role="admin" title="Settings" eyebrow="Rules and Display">
      <div className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          label="Recognition Entry"
          value="Manager"
          detail="Employees cannot self-submit"
          icon={LockKeyhole}
        />
        <MetricCard
          label="TV Mode"
          value={`${tvPanels.length} panels`}
          detail="Community recognition loop"
          icon={MonitorPlay}
        />
        <MetricCard
          label="Active Skin"
          value={activeSkin.name}
          detail="Can be disabled per chapter"
          icon={Palette}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel>
          <PanelHeader title="Recognition Policy" eyebrow="Access" />
          <div className="grid gap-3">
            {[
              ["Employee", "View miles, community progress, rewards, profile"],
              ["Manager", "Create recognitions, log checks, review rewards"],
              ["Admin/GM", "Manage chapters, inventory, analytics, settings"],
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
        <Panel>
          <PanelHeader
            title="TV Dashboard"
            eyebrow="Display loop"
            action={<SlidersHorizontal className="h-5 w-5 text-journey-red" aria-hidden="true" />}
          />
          <div className="grid gap-3">
            {tvPanels.map((panel, index) => (
              <div
                key={panel}
                className="flex items-center justify-between rounded-lg border border-journey-line p-4"
              >
                <span className="font-black text-journey-black">{panel}</span>
                <span className="text-sm font-bold text-journey-steel">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel>
          <PanelHeader title="Skin Developer" eyebrow="Chapter visuals" />
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
        <PanelHeader title="Chapter Settings" eyebrow="Editable fields" />
        <ChapterSettingsEditor settings={chapterSettings} />
      </Panel>

      <Panel className="mt-5">
        <PanelHeader title="Feature Buildout" eyebrow="Launch readiness" />
        <FeatureBuildoutPanel />
      </Panel>
    </AppShell>
  );
}
