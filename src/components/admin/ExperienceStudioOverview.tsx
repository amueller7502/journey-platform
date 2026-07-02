import Link from "next/link";
import { CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { studioModules } from "@/lib/data";

const statusLabels = {
  configured: "Configured",
  needs_attention: "Needs Attention",
  planned: "Planned",
};

const statusIcons = {
  configured: CheckCircle2,
  needs_attention: Clock,
  planned: Clock,
};

export function ExperienceStudioOverview() {
  return (
    <div className="grid gap-5">
      <Panel className="cinema-doodle-card bg-journey-black text-journey-white">
        <PanelHeader
          title="What kind of employee experience do you want to create today?"
          eyebrow="Experience Studio"
        />
        <p className="max-w-4xl text-sm font-bold leading-6 text-journey-line">
          Design seasons, recognition, rewards, events, standards, leadership,
          achievements, displays, scoring, and launch readiness from one place.
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {studioModules.map((module) => {
          const StatusIcon = statusIcons[module.status];

          return (
            <Link
              key={module.id}
              href={module.href}
              className="focus-ring rounded-lg border border-journey-line bg-journey-white p-5 shadow-line transition hover:-translate-y-0.5 hover:border-journey-red hover:shadow-premium"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-journey-red">
                    {statusLabels[module.status]}
                  </p>
                  <h2 className="mt-2 text-xl font-black text-journey-black">
                    {module.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-journey-red">
                  <StatusIcon className="h-5 w-5" aria-hidden="true" />
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-journey-steel">
                {module.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
