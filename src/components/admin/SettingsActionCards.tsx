"use client";

import { LockKeyhole, MonitorPlay, Palette } from "lucide-react";

const actions = [
  {
    label: "Recognition Entry",
    value: "Manager",
    detail: "Employees cannot self-submit",
    href: "#recognition-policy",
    icon: LockKeyhole,
  },
  {
    label: "TV Mode",
    value: "Control Loop",
    detail: "Turn slides on/off",
    href: "#tv-dashboard-settings",
    icon: MonitorPlay,
  },
  {
    label: "Active Skin",
    value: "Skin Developer",
    detail: "Edit chapter visuals",
    href: "#skin-developer",
    icon: Palette,
  },
];

export function SettingsActionCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          className="focus-ring rounded-lg border border-journey-line bg-journey-white p-5 shadow-line transition hover:-translate-y-0.5 hover:border-journey-red hover:shadow-premium"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-journey-red">
                {action.label}
              </p>
              <p className="mt-2 text-3xl font-black text-journey-black">
                {action.value}
              </p>
              <p className="mt-2 text-sm font-bold text-journey-steel">
                {action.detail}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-journey-black text-journey-white">
              <action.icon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
