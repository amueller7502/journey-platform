"use client";

import { Megaphone, Plus, Save, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { makeSlugId, useJourneyState } from "@/lib/journey-state";
import type { DepartmentId, ExperienceEvent, ExperienceEventType } from "@/lib/types";

const eventTypes: ExperienceEventType[] = [
  "Today's Focus",
  "Community Challenge",
  "Bonus XP Event",
  "Flash Event",
  "Surprise Drop",
  "Mystery Mission",
  "Premiere Event",
  "Season Finale Event",
];

function formatDateTimeLocal(value: string) {
  return value.slice(0, 16);
}

export function ExperienceEventsManager() {
  const { state, updateState } = useJourneyState();
  const [selectedEventId, setSelectedEventId] = useState(
    state.experienceEvents[0]?.id ?? "",
  );
  const [saved, setSaved] = useState(false);
  const events = useMemo(
    () => state.experienceEvents.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [state.experienceEvents],
  );
  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ?? events[0];
  const departments = state.departments.filter((department) => department.id !== "leadership");
  const recognitionOptions = state.recognitionTypes
    .filter((type) => type.enabled)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);

  function updateEvent(id: string, patch: Partial<ExperienceEvent>) {
    setSaved(false);
    updateState((current) => ({
      ...current,
      experienceEvents: current.experienceEvents.map((event) =>
        event.id === id ? { ...event, ...patch } : event,
      ),
    }));
  }

  function addEvent() {
    setSaved(false);
    updateState((current) => {
      const title = "New Experience Event";
      const id = `${makeSlugId(title, "experience_event")}-${Date.now()}`;
      const nextOrder =
        Math.max(0, ...current.experienceEvents.map((event) => event.sortOrder)) + 10;
      const nextEvent: ExperienceEvent = {
        id,
        type: "Today's Focus",
        title,
        description: "Describe the focus, challenge, or reward drop.",
        startAt: "2026-07-24T10:00:00",
        endAt: "2026-07-24T23:59:59",
        xpModifier: 1,
        eligibleRecognitionTypeIds: [],
        departmentIds: [],
        tvAnnouncement: "New Experience event is live.",
        banner: "Recognize the Moments that matter today.",
        enabled: true,
        sortOrder: nextOrder,
      };

      setSelectedEventId(id);
      return {
        ...current,
        experienceEvents: [...current.experienceEvents, nextEvent],
      };
    });
  }

  function deleteEvent(id: string) {
    setSaved(false);
    const nextEvent = events.find((event) => event.id !== id);
    setSelectedEventId(nextEvent?.id ?? "");
    updateState((current) => ({
      ...current,
      experienceEvents: current.experienceEvents.filter((event) => event.id !== id),
    }));
  }

  function toggleDepartment(event: ExperienceEvent, departmentId: DepartmentId) {
    const nextIds = event.departmentIds.includes(departmentId)
      ? event.departmentIds.filter((id) => id !== departmentId)
      : [...event.departmentIds, departmentId];
    updateEvent(event.id, { departmentIds: nextIds });
  }

  function toggleRecognitionType(event: ExperienceEvent, recognitionTypeId: string) {
    const nextIds = event.eligibleRecognitionTypeIds.includes(recognitionTypeId)
      ? event.eligibleRecognitionTypeIds.filter((id) => id !== recognitionTypeId)
      : [...event.eligibleRecognitionTypeIds, recognitionTypeId];
    updateEvent(event.id, { eligibleRecognitionTypeIds: nextIds });
  }

  if (!selectedEvent) {
    return (
      <Panel>
        <PanelHeader title="Events" eyebrow="Season engine" />
        <Button type="button" icon={Plus} onClick={addEvent}>
          Add Event
        </Button>
      </Panel>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
      <Panel>
        <PanelHeader
          title="Events"
          eyebrow="Season engine"
          action={<Megaphone className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="mb-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" icon={Plus} onClick={addEvent}>
            Add Event
          </Button>
          <Button type="button" icon={Save} onClick={() => setSaved(true)}>
            Save Events
          </Button>
        </div>
        {saved ? (
          <p className="mb-4 rounded-md border border-journey-red bg-journey-white p-3 text-sm font-black text-journey-black">
            Event configuration saved for this workspace.
          </p>
        ) : null}
        <div className="grid gap-2">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => setSelectedEventId(event.id)}
              className={`focus-ring rounded-lg border p-4 text-left transition ${
                event.id === selectedEvent.id
                  ? "border-journey-red bg-journey-black text-journey-white"
                  : "border-journey-line bg-journey-white text-journey-black hover:bg-journey-mist"
              }`}
            >
              <p className="text-xs font-black uppercase text-journey-red">
                {event.enabled ? event.type : "Disabled"}
              </p>
              <h3 className="mt-1 font-black">{event.title}</h3>
            </button>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHeader title={selectedEvent.title} eyebrow="Configure event" />
        <div className="grid gap-4">
          <div className="flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant={selectedEvent.enabled ? "dark" : "secondary"}
              icon={selectedEvent.enabled ? ToggleRight : ToggleLeft}
              onClick={() =>
                updateEvent(selectedEvent.id, { enabled: !selectedEvent.enabled })
              }
            >
              {selectedEvent.enabled ? "Enabled" : "Disabled"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              icon={Trash2}
              onClick={() => deleteEvent(selectedEvent.id)}
            >
              Delete Event
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Event Type
              <select
                value={selectedEvent.type}
                onChange={(event) =>
                  updateEvent(selectedEvent.id, {
                    type: event.target.value as ExperienceEventType,
                  })
                }
                className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              XP Modifier
              <input
                type="number"
                step="0.05"
                min="0"
                value={selectedEvent.xpModifier}
                onChange={(event) =>
                  updateEvent(selectedEvent.id, {
                    xpModifier: Math.max(0, Number(event.target.value)),
                  })
                }
                className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Event Name
            <input
              value={selectedEvent.title}
              onChange={(event) =>
                updateEvent(selectedEvent.id, { title: event.target.value })
              }
              className="focus-ring min-h-11 rounded-md border border-journey-line px-3 text-lg font-black"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Description
            <textarea
              value={selectedEvent.description}
              onChange={(event) =>
                updateEvent(selectedEvent.id, { description: event.target.value })
              }
              rows={3}
              className="focus-ring resize-none rounded-md border border-journey-line px-3 py-2"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Start
              <input
                type="datetime-local"
                value={formatDateTimeLocal(selectedEvent.startAt)}
                onChange={(event) =>
                  updateEvent(selectedEvent.id, { startAt: event.target.value })
                }
                className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              End
              <input
                type="datetime-local"
                value={formatDateTimeLocal(selectedEvent.endAt)}
                onChange={(event) =>
                  updateEvent(selectedEvent.id, { endAt: event.target.value })
                }
                className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-journey-black">
            TV Announcement
            <input
              value={selectedEvent.tvAnnouncement}
              onChange={(event) =>
                updateEvent(selectedEvent.id, { tvAnnouncement: event.target.value })
              }
              className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Banner Copy
            <input
              value={selectedEvent.banner}
              onChange={(event) =>
                updateEvent(selectedEvent.id, { banner: event.target.value })
              }
              className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
            />
          </label>

          <section className="rounded-lg border border-journey-line p-4">
            <p className="text-xs font-black uppercase text-journey-red">
              Eligible Departments
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {departments.map((department) => {
                const checked = selectedEvent.departmentIds.includes(department.id);
                return (
                  <button
                    key={department.id}
                    type="button"
                    onClick={() => toggleDepartment(selectedEvent, department.id)}
                    className={`focus-ring rounded-md border px-3 py-2 text-sm font-black ${
                      checked
                        ? "border-journey-red bg-journey-red text-journey-white"
                        : "border-journey-line bg-journey-white text-journey-black"
                    }`}
                  >
                    {department.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-journey-line p-4">
            <p className="text-xs font-black uppercase text-journey-red">
              Eligible Experience Moments
            </p>
            <p className="mt-1 text-sm font-bold text-journey-steel">
              Leave empty when the event applies to all recognition types.
            </p>
            <div className="mt-3 grid max-h-72 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
              {recognitionOptions.map((recognitionType) => {
                const checked = selectedEvent.eligibleRecognitionTypeIds.includes(
                  recognitionType.id,
                );
                return (
                  <button
                    key={recognitionType.id}
                    type="button"
                    onClick={() => toggleRecognitionType(selectedEvent, recognitionType.id)}
                    className={`focus-ring rounded-md border p-3 text-left text-sm font-bold ${
                      checked
                        ? "border-journey-red bg-journey-mist text-journey-black"
                        : "border-journey-line bg-journey-white text-journey-black"
                    }`}
                  >
                    <span className="block font-black">{recognitionType.name}</span>
                    <span className="text-xs text-journey-steel">
                      {recognitionType.milesValue} XP / {recognitionType.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </Panel>
    </div>
  );
}
