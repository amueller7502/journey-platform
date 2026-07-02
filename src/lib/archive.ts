import type { ConfigLifecycle } from "@/lib/types";

export type ArchiveFilter = "active" | "archived" | "all";

export type ArchivableRecord = {
  id: string;
  enabled?: boolean;
  active?: boolean;
  status?: string;
  lifecycle?: ConfigLifecycle;
  archivedAt?: string;
};

export function isArchived(record: Partial<ArchivableRecord>) {
  return (
    record.status === "archived" ||
    record.lifecycle === "archived" ||
    Boolean(record.archivedAt)
  );
}

export function matchesArchiveFilter(
  record: Partial<ArchivableRecord>,
  filter: ArchiveFilter,
  activeWhenNotArchived = true,
) {
  if (filter === "all") {
    return true;
  }

  const archived = isArchived(record);
  if (filter === "archived") {
    return archived;
  }

  return !archived && activeWhenNotArchived;
}

export function isDraftLikeId(id: string) {
  return (
    id.includes("-draft-") ||
    id.startsWith("emp-new-") ||
    /-\d{12,}$/.test(id)
  );
}

export function archiveConfigPatch(now = new Date().toISOString()) {
  return {
    enabled: false,
    status: "archived" as const,
    lifecycle: "archived" as const,
    archivedAt: now,
  };
}
