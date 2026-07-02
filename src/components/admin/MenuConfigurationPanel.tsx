"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { MenuConfiguration } from "@/lib/types";

export function MenuConfigurationPanel({
  items,
}: {
  items: MenuConfiguration[];
}) {
  const [menuItems, setMenuItems] = useState(items);
  const [saved, setSaved] = useState(false);

  function updateItem(id: string, patch: Partial<MenuConfiguration>) {
    setSaved(false);
    setMenuItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-journey-steel">
          Menu labels and purposes are modeled as configurable records so future
          activations can reuse the same app with different language.
        </p>
        <Button type="button" icon={Save} onClick={() => setSaved(true)}>
          Save Menu Draft
        </Button>
      </div>

      {saved ? (
        <p className="rounded-lg border border-journey-line bg-journey-mist p-3 text-sm font-black text-journey-black">
          Menu changes saved in this browser session.
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] border-collapse text-left">
          <thead>
            <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
              <th className="py-3 pr-3">Enabled</th>
              <th className="py-3 pr-3">Area</th>
              <th className="py-3 pr-3">Label</th>
              <th className="py-3 pr-3">Route</th>
              <th className="py-3 pr-3">Purpose</th>
              <th className="py-3 pr-3">Reusable</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} className="border-b border-journey-line">
                <td className="py-3 pr-3">
                  <input
                    aria-label={`Enable ${item.label}`}
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(event) =>
                      updateItem(item.id, { enabled: event.currentTarget.checked })
                    }
                    className="h-5 w-5 accent-journey-red"
                  />
                </td>
                <td className="py-3 pr-3 text-sm font-black text-journey-black">
                  {item.area}
                </td>
                <td className="py-3 pr-3">
                  <input
                    value={item.label}
                    onChange={(event) => updateItem(item.id, { label: event.target.value })}
                    className="focus-ring min-h-10 w-full rounded-md border border-journey-line px-3 font-bold"
                  />
                </td>
                <td className="py-3 pr-3 text-sm font-bold text-journey-steel">
                  {item.href}
                </td>
                <td className="py-3 pr-3">
                  <input
                    value={item.purpose}
                    onChange={(event) =>
                      updateItem(item.id, { purpose: event.target.value })
                    }
                    className="focus-ring min-h-10 w-full rounded-md border border-journey-line px-3 text-sm"
                  />
                </td>
                <td className="py-3 pr-3">
                  <span className="rounded-sm bg-journey-mist px-2 py-1 text-xs font-black uppercase text-journey-black">
                    {item.reusable ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
