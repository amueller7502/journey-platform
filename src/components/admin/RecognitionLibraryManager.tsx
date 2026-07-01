"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { recognitionStandards, recognitionTypes } from "@/lib/data";

export function RecognitionLibraryManager() {
  const [types, setTypes] = useState(recognitionTypes);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-journey-steel">
          Admin-managed recognition rules for Chapter One.
        </p>
        <LinkButton href="/admin/recognition-library/new" icon={Plus}>
          Add Recognition Type
        </LinkButton>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-journey-line text-xs font-black uppercase text-journey-steel">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Type</th>
              <th className="py-3 pr-4">Standard</th>
              <th className="py-3 pr-4">Miles</th>
              <th className="py-3 pr-4">Verification</th>
              <th className="py-3 pr-4">Sort</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Edit</th>
            </tr>
          </thead>
          <tbody>
            {types
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((type) => {
                const standard = recognitionStandards.find(
                  (item) => item.id === type.standardId,
                );
                return (
                  <tr key={type.id} className="border-b border-journey-line">
                    <td className="py-4 pr-4">
                      <p className="font-black text-journey-black">{type.name}</p>
                      <p className="mt-1 max-w-md text-sm leading-6 text-journey-steel">
                        {type.description}
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-sm font-bold text-journey-steel">
                      {type.type}
                    </td>
                    <td className="py-4 pr-4 text-sm font-bold text-journey-steel">
                      {standard?.shortLabel}
                    </td>
                    <td className="py-4 pr-4 text-lg font-black text-journey-black">
                      {type.milesValue}
                    </td>
                    <td className="py-4 pr-4 text-sm font-bold text-journey-steel">
                      {type.requiresManagerVerification ? "Manager" : "None"}
                    </td>
                    <td className="py-4 pr-4 text-sm font-bold text-journey-steel">
                      {type.sortOrder}
                    </td>
                    <td className="py-4 pr-4">
                      <Button
                        type="button"
                        icon={type.enabled ? ToggleRight : ToggleLeft}
                        variant={type.enabled ? "dark" : "secondary"}
                        onClick={() =>
                          setTypes((current) =>
                            current.map((item) =>
                              item.id === type.id
                                ? { ...item, enabled: !item.enabled }
                                : item,
                            ),
                          )
                        }
                      >
                        {type.enabled ? "Enabled" : "Disabled"}
                      </Button>
                    </td>
                    <td className="py-4 pr-4">
                      <Link
                        href={`/admin/recognition-library/${type.id}`}
                        className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md border border-journey-line px-3 py-2 text-sm font-black text-journey-black hover:bg-journey-mist"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
