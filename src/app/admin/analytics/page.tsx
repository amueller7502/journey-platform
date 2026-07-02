import { BarChart3, PieChart, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  recognitionTypes,
  recognitions,
  recognitionStandards,
} from "@/lib/data";
import { formatXp, percent } from "@/lib/utils";

const actionTotals = recognitionTypes
  .map((recognitionType) => ({
    recognitionType,
    miles: recognitions
      .filter((recognition) => recognition.recognitionTypeId === recognitionType.id)
      .reduce((total, recognition) => total + recognition.miles, 0),
  }))
  .filter((item) => item.miles > 0)
  .sort((a, b) => b.miles - a.miles);

const standardTotals = recognitionStandards.map((standard) => ({
  standard,
  count: recognitions.filter((recognition) => recognition.standardId === standard.id).length,
}));

const maxActionXp = Math.max(...actionTotals.map((item) => item.miles), 1);

export default function RecognitionAnalyticsPage() {
  const totalXp = recognitions.reduce((total, recognition) => total + recognition.miles, 0);

  return (
    <AppShell role="admin" title="Recognition Analytics" eyebrow="Insights">
      <div className="grid gap-5 lg:grid-cols-3">
        <MetricCard
          label="Tracked Entries"
          value={`${recognitions.length}`}
          detail="Seed recognition events"
          icon={BarChart3}
        />
        <MetricCard
          label="Tracked XP"
          value={formatXp(totalXp)}
          detail="Recognition feed sample"
          icon={PieChart}
        />
        <MetricCard
          label="Standards Covered"
          value={`${standardTotals.filter((item) => item.count > 0).length}/5`}
          detail="Recognition standards"
          icon={ShieldCheck}
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel>
          <PanelHeader title="Action Mix" eyebrow="XP by rule" />
          <div className="grid gap-4">
            {actionTotals.map(({ recognitionType, miles }) => (
              <div key={recognitionType.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-black text-journey-black">{recognitionType.name}</span>
                  <span className="text-sm font-bold text-journey-steel">
                    {formatXp(miles)} XP
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-sm bg-journey-mist">
                  <div
                    className="h-full bg-journey-red"
                    style={{ width: `${percent(miles, maxActionXp)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Standards Coverage" eyebrow="Entries" />
          <div className="grid gap-3">
            {standardTotals.map(({ standard, count }) => (
              <div
                key={standard.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-journey-line p-4"
              >
                <span className="font-black text-journey-black">{standard.label}</span>
                <span className="text-sm font-bold text-journey-red">{count}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
