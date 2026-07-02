"use client";

import Image from "next/image";
import { CheckCircle2, Camera, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { useJourneyState } from "@/lib/journey-state";

export function ProfilePhotoApprovals() {
  const { state, updateState } = useJourneyState();
  const pending = state.employees.filter(
    (employee) =>
      employee.profilePhotoStatus === "pending" && employee.pendingProfilePhotoUrl,
  );

  function approveProfilePhoto(id: string) {
    updateState((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              profilePhotoUrl: employee.pendingProfilePhotoUrl,
              pendingProfilePhotoUrl: undefined,
              profilePhotoStatus: "approved",
            }
          : employee,
      ),
    }));
  }

  function rejectProfilePhoto(id: string) {
    updateState((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              pendingProfilePhotoUrl: undefined,
              profilePhotoStatus: "rejected",
            }
          : employee,
      ),
    }));
  }

  return (
    <Panel>
      <PanelHeader
        title="Profile Photo Approvals"
        eyebrow={`${pending.length} pending`}
        action={<Camera className="h-5 w-5 text-journey-red" aria-hidden="true" />}
      />
      <div className="grid gap-4">
        {!pending.length ? (
          <div className="rounded-lg border border-dashed border-journey-line p-5">
            <p className="font-black text-journey-black">No photos are waiting.</p>
            <p className="mt-2 text-sm font-bold text-journey-steel">
              Employee profile photo uploads will appear here for manager/admin review.
            </p>
          </div>
        ) : null}
        {pending.map((employee) => {
          const department = state.departments.find(
            (item) => item.id === employee.department,
          );

          return (
            <article
              key={employee.id}
              className="grid gap-4 rounded-lg border border-journey-line p-4 md:grid-cols-[120px_1fr_auto]"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-journey-mist">
                <Image
                  src={employee.pendingProfilePhotoUrl ?? ""}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-journey-red">
                  Pending Upload
                </p>
                <h3 className="mt-1 text-2xl font-black text-journey-black">
                  {employee.name}
                </h3>
                <p className="mt-2 text-sm font-bold text-journey-steel">
                  {employee.title} / {department?.name ?? "Unassigned"}
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-2 md:justify-end">
                <Button
                  type="button"
                  icon={CheckCircle2}
                  onClick={() => approveProfilePhoto(employee.id)}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={XCircle}
                  onClick={() => rejectProfilePhoto(employee.id)}
                >
                  Reject
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
