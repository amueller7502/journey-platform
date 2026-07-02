"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MonitorPlay,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { LinkButton, Button } from "@/components/ui/Button";
import { useJourneyState } from "@/lib/journey-state";

function routeForRole(role: string) {
  if (role === "manager") {
    return "/manager/recognize";
  }

  if (role === "admin") {
    return "/admin/dashboard";
  }

  return "/home";
}

export function WorkspaceLoginPanel() {
  const router = useRouter();
  const { state } = useJourneyState();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const activeAccounts = useMemo(
    () =>
      state.employees.filter(
        (employee) =>
          employee.active !== false && employee.accountStatus !== "disabled",
      ),
    [state.employees],
  );

  function signInWithCode() {
    const code = accessCode.trim().toLowerCase();
    const account = activeAccounts.find(
      (employee) => employee.accessCode?.toLowerCase() === code,
    );

    if (!account) {
      setError("Access code not found for this preview workspace.");
      return;
    }

    window.localStorage.setItem("journey-active-account-id", account.id);
    router.push(routeForRole(account.role));
  }

  return (
    <div className="rounded-lg border border-journey-steel bg-journey-white p-5 text-journey-black shadow-premium">
      <div className="border-b border-journey-line pb-4">
        <p className="text-xs font-black uppercase text-journey-red">
          Welcome / Login
        </p>
        <h2 className="mt-2 text-3xl font-black">Choose Workspace</h2>
      </div>

      <div className="mt-5 grid gap-3 rounded-lg border border-journey-line bg-journey-mist p-4">
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Preview Access Code
          <input
            value={accessCode}
            onChange={(event) => {
              setAccessCode(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                signInWithCode();
              }
            }}
            className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3 font-mono font-black uppercase"
            placeholder="AR1570"
          />
        </label>
        <Button type="button" icon={UserRound} onClick={signInWithCode}>
          Enter Journey
        </Button>
        {error ? (
          <p className="text-sm font-black text-journey-red">{error}</p>
        ) : (
          <p className="text-xs font-bold text-journey-steel">
            Admin-created preview accounts route by role. Supabase Auth comes next.
          </p>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        <LinkButton href="/home" icon={UserRound} className="justify-start">
          Employee Demo
        </LinkButton>
        <LinkButton
          href="/manager/recognize"
          icon={ShieldCheck}
          variant="dark"
          className="justify-start"
        >
          Manager Demo
        </LinkButton>
        <LinkButton
          href="/admin/dashboard"
          icon={LayoutDashboard}
          variant="secondary"
          className="justify-start"
        >
          Admin/GM Demo
        </LinkButton>
        <LinkButton
          href="/tv"
          icon={MonitorPlay}
          variant="secondary"
          className="justify-start"
        >
          TV Display
        </LinkButton>
      </div>
    </div>
  );
}
