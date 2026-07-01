import { BadgeCheck, CalendarDays, ShieldCheck, UserRound } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { employees, getDepartment, journalEvents } from "@/lib/data";

const currentEmployee = employees[0];
const department = getDepartment(currentEmployee.department);

export default function ProfilePage() {
  return (
    <AppShell role="employee" title="Profile" eyebrow={currentEmployee.name}>
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <Panel className="bg-journey-black text-journey-white">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-journey-red text-xl font-black">
              {currentEmployee.initials}
            </div>
            <div>
              <h2 className="text-3xl font-black">{currentEmployee.name}</h2>
              <p className="mt-2 font-bold text-journey-line">{currentEmployee.title}</p>
              <p className="mt-1 text-sm font-bold text-journey-line">
                {department?.name}
              </p>
            </div>
          </div>
        </Panel>
        <div className="grid gap-5 sm:grid-cols-3">
          <MetricCard
            label="Miles"
            value={`${currentEmployee.miles}`}
            detail="Chapter total"
            icon={BadgeCheck}
          />
          <MetricCard
            label="Streak"
            value={`${currentEmployee.reliabilityStreak}`}
            detail="Reliable weeks"
            icon={CalendarDays}
          />
          <MetricCard
            label="Role"
            value="Crew"
            detail="Employee access"
            icon={UserRound}
          />
        </div>
      </div>

      <Panel className="mt-5">
        <PanelHeader title="Recognition Profile" eyebrow="Standards" />
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Guest Welcome", "3 recognitions"],
            ["Presentation", "6 recognitions"],
            ["Teamwork", "2 recognitions"],
            ["Reliability", "4 recognitions"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-lg border border-journey-line p-4"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-journey-red" aria-hidden="true" />
                <span className="font-black text-journey-black">{label}</span>
              </div>
              <span className="text-sm font-bold text-journey-steel">{value}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-5">
        <PanelHeader title="Journey Journal" eyebrow="Timeline" />
        <div className="grid gap-3">
          {journalEvents.map((event) => (
            <div
              key={`${event.date}-${event.title}`}
              className="grid gap-3 rounded-lg border border-journey-line p-4 sm:grid-cols-[90px_1fr]"
            >
              <p className="text-sm font-black uppercase text-journey-red">{event.date}</p>
              <div>
                <p className="font-black text-journey-black">{event.title}</p>
                <p className="mt-1 text-sm leading-6 text-journey-steel">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
