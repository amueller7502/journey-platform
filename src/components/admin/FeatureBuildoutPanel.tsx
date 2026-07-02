import { CheckCircle2, Clock, Database, ShieldCheck } from "lucide-react";

const featureRows = [
  {
    area: "Employee roster",
    status: "Configurable",
    detail: "Add, edit, disable, and change Experience Card IDs.",
    icon: CheckCircle2,
  },
  {
    area: "Recognition library",
    status: "Configurable",
    detail: "Edit Moments, Excellence Checks, Miles, standards, and enabled state.",
    icon: CheckCircle2,
  },
  {
    area: "Trading Post",
    status: "Configurable",
    detail: "Edit reward catalog, costs, inventory, spotlight, and visibility.",
    icon: CheckCircle2,
  },
  {
    area: "Skin Developer",
    status: "Configurable",
    detail: "Draft skins, edit palettes, enable/disable skin mode, and set active skin.",
    icon: CheckCircle2,
  },
  {
    area: "Supabase writes",
    status: "Next",
    detail: "Schema is ready; UI currently writes to browser-saved configuration.",
    icon: Database,
  },
  {
    area: "Authentication",
    status: "Next",
    detail: "Role buttons work now; production auth and permissions are the next hardening pass.",
    icon: ShieldCheck,
  },
  {
    area: "Shared multi-device state",
    status: "Next",
    detail: "Use Supabase mutations so managers, admin, and TV share the same live data.",
    icon: Clock,
  },
];

export function FeatureBuildoutPanel() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {featureRows.map((row) => (
        <article
          key={row.area}
          className="rounded-lg border border-journey-line bg-journey-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-journey-red">
                {row.status}
              </p>
              <h3 className="mt-1 font-black text-journey-black">{row.area}</h3>
            </div>
            <row.icon className="h-5 w-5 text-journey-red" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-bold leading-6 text-journey-steel">
            {row.detail}
          </p>
        </article>
      ))}
    </div>
  );
}
