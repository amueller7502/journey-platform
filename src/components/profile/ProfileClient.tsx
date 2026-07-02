"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Camera,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import { FeatureVisible } from "@/components/FeatureVisible";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { useJourneyState } from "@/lib/journey-state";
import { journalEvents } from "@/lib/data";
import { createClient, hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import type { Role } from "@/lib/types";

const ACTIVE_ACCOUNT_KEY = "journey-active-account-id";
const ACTIVE_ROLE_KEY = "experience-active-role";

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ProfileClient() {
  const { state, updateState } = useJourneyState();
  const [accountId, setAccountId] = useState("");
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = () => {
      setAccountId(window.localStorage.getItem(ACTIVE_ACCOUNT_KEY) ?? "");
      const storedRole = window.localStorage.getItem(ACTIVE_ROLE_KEY);
      setActiveRole(
        storedRole === "admin" || storedRole === "manager" || storedRole === "employee"
          ? storedRole
          : null,
      );
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadSignedInEmail() {
      if (!hasSupabaseBrowserEnv()) {
        return;
      }

      const { data } = await createClient().auth.getUser();
      if (mounted) {
        setAuthEmail(data.user?.email?.toLowerCase() ?? "");
      }
    }

    void loadSignedInEmail();

    return () => {
      mounted = false;
    };
  }, []);

  const currentEmployee = useMemo(
    () =>
      state.employees.find((employee) => employee.id === accountId) ??
      state.employees.find(
        (employee) => employee.email?.toLowerCase() === authEmail,
      ) ??
      state.employees.find(
        (employee) => activeRole && employee.role === activeRole && employee.active !== false,
      ) ??
      state.employees.find((employee) => employee.active !== false) ??
      state.employees[0],
    [accountId, activeRole, authEmail, state.employees],
  );
  const department = state.departments.find(
    (item) => item.id === currentEmployee.department,
  );
  const isEmployeeProfile = currentEmployee.role === "employee";
  const roleLabel =
    currentEmployee.role === "admin"
      ? "Experience Builder"
      : currentEmployee.role === "manager"
        ? "Manager"
        : "Employee";
  const photoUrl =
    currentEmployee.profilePhotoStatus === "approved"
      ? currentEmployee.profilePhotoUrl
      : currentEmployee.pendingProfilePhotoUrl ?? currentEmployee.profilePhotoUrl;
  const status = currentEmployee.profilePhotoStatus ?? "none";

  async function requestPhotoApproval(file: File | undefined) {
    if (!file) {
      return;
    }

    const dataUrl = await readImageAsDataUrl(file);
    updateState((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === currentEmployee.id
          ? {
              ...employee,
              pendingProfilePhotoUrl: dataUrl,
              profilePhotoStatus: "pending",
            }
          : employee,
      ),
    }));
    setMessage("Photo uploaded for manager/admin approval.");
  }

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <Panel className="bg-journey-black text-journey-white">
          <div className="flex items-start gap-4">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-journey-red text-xl font-black">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                currentEmployee.initials
              )}
            </div>
            <div>
              <h2 className="text-3xl font-black">{currentEmployee.name}</h2>
              <p className="mt-2 font-bold text-journey-line">
                {currentEmployee.title}
              </p>
              <p className="mt-1 text-sm font-bold text-journey-line">
                {department?.name}
              </p>
              <p className="mt-3 inline-flex rounded-sm border border-journey-steel px-2 py-1 text-xs font-black uppercase text-journey-line">
                Photo status: {status}
              </p>
            </div>
          </div>
        </Panel>
        <div className="grid gap-5 sm:grid-cols-3">
          <MetricCard
            label={isEmployeeProfile ? "XP" : "Employee XP"}
            value={isEmployeeProfile ? `${currentEmployee.miles}` : "Not used"}
            detail={isEmployeeProfile ? "Experience total" : "Leaders do not earn employee XP"}
            icon={BadgeCheck}
          />
          <MetricCard
            label={isEmployeeProfile ? "Streak" : "Access"}
            value={isEmployeeProfile ? `${currentEmployee.reliabilityStreak}` : "Active"}
            detail={isEmployeeProfile ? "Reliable weeks" : "Account is in the people list"}
            icon={CalendarDays}
          />
          <MetricCard
            label="Role"
            value={roleLabel}
            detail="Account access"
            icon={UserRound}
          />
        </div>
      </div>

      <Panel className="mt-5">
        <PanelHeader
          title="Profile Photo"
          eyebrow="Approval required"
          action={<Camera className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="grid gap-4 md:grid-cols-[180px_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-journey-line bg-journey-mist">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt=""
                fill
                sizes="180px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-3xl font-black text-journey-red">
                {currentEmployee.initials}
              </div>
            )}
          </div>
          <div className="rounded-lg border border-journey-line p-4">
            <p className="text-sm font-bold leading-6 text-journey-steel">
              Upload a square-ish photo for your Experience profile. It appears as
              pending until a manager or admin approves it from the Employees page.
            </p>
            <label className="mt-4 inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-journey-red bg-journey-red px-4 py-2 text-sm font-bold text-journey-white transition hover:bg-journey-deepRed">
              <Upload className="h-4 w-4" aria-hidden="true" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => requestPhotoApproval(event.currentTarget.files?.[0])}
              />
            </label>
            {message ? (
              <p className="mt-3 text-sm font-black text-journey-red">{message}</p>
            ) : null}
          </div>
        </div>
      </Panel>

      {isEmployeeProfile ? (
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
      ) : (
        <Panel className="mt-5">
          <PanelHeader title="Account Profile" eyebrow={roleLabel} />
          <div className="rounded-lg border border-journey-line p-4">
            <p className="font-black text-journey-black">{currentEmployee.name}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
              {roleLabel} accounts can use their available Experience tools, but they
              do not receive employee XP or employee recognition history.
            </p>
          </div>
        </Panel>
      )}

      {isEmployeeProfile ? (
        <FeatureVisible featureId="moment_history">
          <Panel className="mt-5">
            <PanelHeader title="Experience Journal" eyebrow="Timeline" />
            <div className="grid gap-3">
              {journalEvents.map((event) => (
                <div
                  key={`${event.date}-${event.title}`}
                  className="grid gap-3 rounded-lg border border-journey-line p-4 sm:grid-cols-[90px_1fr]"
                >
                  <p className="text-sm font-black uppercase text-journey-red">{event.date}</p>
                  <div>
                    <p className="font-black text-journey-black">{event.title}</p>
                    <p className="mt-1 text-sm leading-6 text-journey-steel">
                      {event.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </FeatureVisible>
      ) : null}
    </>
  );
}
