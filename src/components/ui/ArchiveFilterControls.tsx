"use client";

import { Button } from "@/components/ui/Button";
import type { ArchiveFilter } from "@/lib/archive";

const archiveFilters: Array<{ id: ArchiveFilter; label: string }> = [
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
  { id: "all", label: "All" },
];

export function ArchiveFilterControls({
  value,
  onChange,
}: {
  value: ArchiveFilter;
  onChange: (value: ArchiveFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Archive filter">
      {archiveFilters.map((filter) => (
        <Button
          key={filter.id}
          type="button"
          variant={value === filter.id ? "dark" : "secondary"}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
