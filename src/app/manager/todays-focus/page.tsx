"use client";

import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { useJourneyState } from "@/lib/journey-state";
import { formatShortDateTime } from "@/lib/utils";

export default function ManagerTodaysFocusPage() {
  const { state } = useJourneyState();
  const activeEvents = state.experienceEvents
    .filter((event) => event.enabled)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const primaryFocus =
    activeEvents.find((event) => event.type === "Today's Focus") ?? activeEvents[0];

  return (
    <AppShell
      role="manager"
      title="Today's Focus"
      eyebrow="Manager shift guide"
      actions={<LinkButton href="/manager/recognize" icon={Sparkles}>Capture Moment</LinkButton>}
    >
      {primaryFocus ? (
        <Panel className="bg-journey-black text-journey-white projection-sweep">
          <p className="text-xs font-black uppercase text-journey-red">
            {primaryFocus.type}
          </p>
          <h2 className="mt-2 text-4xl font-black">{primaryFocus.title}</h2>
          <p className="mt-4 max-w-3xl text-lg font-bold leading-8 text-journey-line">
            {primaryFocus.description}
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-journey-steel bg-journey-coal p-4">
              <p className="text-xs font-black uppercase text-journey-red">Banner</p>
              <p className="mt-2 font-black text-journey-white">{primaryFocus.banner}</p>
            </div>
            <div className="rounded-lg border border-journey-steel bg-journey-coal p-4">
              <p className="text-xs font-black uppercase text-journey-red">TV</p>
              <p className="mt-2 font-black text-journey-white">
                {primaryFocus.tvAnnouncement}
              </p>
            </div>
            <div className="rounded-lg border border-journey-steel bg-journey-coal p-4">
              <p className="text-xs font-black uppercase text-journey-red">XP Modifier</p>
              <p className="mt-2 text-3xl font-black text-journey-white">
                {primaryFocus.xpModifier}x
              </p>
            </div>
          </div>
        </Panel>
      ) : (
        <Panel>
          <p className="text-sm font-bold text-journey-steel">
            No active Events are configured.
          </p>
        </Panel>
      )}

      <Panel className="mt-5">
        <PanelHeader title="Active Events" eyebrow="Configured by Admin" />
        <div className="grid gap-3">
          {!activeEvents.length ? (
            <p className="rounded-lg border border-dashed border-journey-line p-4 text-sm font-bold text-journey-steel">
              Add Today&apos;s Focus or community events in Admin / Events.
            </p>
          ) : null}
          {activeEvents.map((event) => (
            <article key={event.id} className="rounded-lg border border-journey-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-journey-red">
                    {event.type}
                  </p>
                  <h3 className="mt-1 text-xl font-black text-journey-black">
                    {event.title}
                  </h3>
                </div>
                <p className="rounded-sm bg-journey-mist px-2 py-1 text-xs font-black uppercase text-journey-black">
                  {event.xpModifier}x XP
                </p>
              </div>
              <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
                {event.description}
              </p>
              <p className="mt-3 text-xs font-black uppercase text-journey-steel">
                {formatShortDateTime(event.startAt)} - {formatShortDateTime(event.endAt)}
              </p>
            </article>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
