"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useJourneyState } from "@/lib/journey-state";

export function ActiveAccountBadge() {
  const { state } = useJourneyState();
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    const load = () =>
      setAccountId(window.localStorage.getItem("journey-active-account-id") ?? "");
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const account = state.employees.find((employee) => employee.id === accountId);

  if (!account) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md border border-journey-steel bg-journey-coal p-3">
      <p className="text-xs font-black uppercase text-journey-red">Signed In</p>
      <p className="mt-1 text-sm font-black text-journey-white">{account.name}</p>
      <p className="text-xs font-bold text-journey-line">{account.title}</p>
      <Link
        href="/"
        className="mt-2 inline-flex text-xs font-black uppercase text-journey-red"
      >
        Switch account
      </Link>
    </div>
  );
}
