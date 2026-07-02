import { Gift, Library, Settings, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";

const builderModules = [
  {
    title: "Recognition Builder",
    eyebrow: "What managers can capture",
    description:
      "Create, tune, enable, and disable the Experience Moments managers use every shift.",
    href: "/admin/recognition-library",
    icon: Library,
  },
  {
    title: "Rewards Builder",
    eyebrow: "What employees can earn",
    description:
      "Keep the Lite reward catalog useful, simple, and exciting enough to care about.",
    href: "/admin/rewards",
    icon: Gift,
  },
  {
    title: "Employees",
    eyebrow: "Who can participate",
    description:
      "Add employees, update access, import roster files, and manage card IDs.",
    href: "/admin/employees",
    icon: Users,
  },
  {
    title: "Settings",
    eyebrow: "Lite launch controls",
    description:
      "Control feature toggles, presets, and the few launch settings leaders need now.",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function BuilderHomePage() {
  return (
    <AppShell role="admin" title="Experience Builder" eyebrow="Lite launch setup">
      <Panel className="cinema-doodle-card bg-journey-black text-journey-white">
        <p className="text-xs font-black uppercase text-journey-red">
          Experience Lite First
        </p>
        <h2 className="mt-2 max-w-4xl text-4xl font-black leading-tight">
          Build the simple version managers will actually use every shift.
        </h2>
        <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-journey-line">
          The goal is one new habit: managers consistently capture Experience
          Moments. Advanced modules stay hidden until Lite proves itself.
        </p>
      </Panel>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {builderModules.map((module) => (
          <Panel key={module.href} className="cinema-doodle-card">
            <PanelHeader
              title={module.title}
              eyebrow={module.eyebrow}
              action={<module.icon className="h-5 w-5 text-journey-red" aria-hidden="true" />}
            />
            <p className="min-h-16 text-sm font-bold leading-6 text-journey-steel">
              {module.description}
            </p>
            <div className="mt-5">
              <LinkButton href={module.href} icon={module.icon}>
                Open {module.title}
              </LinkButton>
            </div>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}
