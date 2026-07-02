"use client";

import { SupabaseAuthPanel } from "@/components/SupabaseAuthPanel";

export function WorkspaceLoginPanel() {
  return (
    <div className="rounded-lg border border-journey-steel bg-journey-white p-5 text-journey-black shadow-premium">
      <div className="border-b border-journey-line pb-4">
        <p className="text-xs font-black uppercase text-journey-red">
          Welcome / Login
        </p>
        <h2 className="mt-2 text-3xl font-black">Enter Experience</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
          Sign in or create an account, then choose the experience you need for
          today.
        </p>
      </div>

      <div className="mt-5">
        <SupabaseAuthPanel />
      </div>
    </div>
  );
}
