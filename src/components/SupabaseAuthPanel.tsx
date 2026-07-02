"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { appRoleForPlatformRole, platformRoleRank, routeForRole } from "@/lib/access-control";
import { createClient, hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import type { PlatformRole, Role } from "@/lib/types";

type AuthMode = "sign_in" | "create_account";

export function SupabaseAuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const hasEnv = hasSupabaseBrowserEnv();

  async function handleSubmit() {
    setMessage("");

    if (!hasEnv) {
      setMessage("Supabase is not connected yet. Use a preview access code below.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setMessage("Email and password are required.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const authResult =
      mode === "sign_in"
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });

    if (authResult.error) {
      setMessage(authResult.error.message);
      setLoading(false);
      return;
    }

    const user = authResult.data.user;
    if (!user) {
      setMessage("Check your email to confirm the account, then sign in.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (profileError) {
      setMessage(profileError.message);
      setLoading(false);
      return;
    }

    let resolvedRole: Role | undefined;
    if (profile) {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role, enabled")
        .eq("profile_id", profile.id)
        .eq("enabled", true);

      if (rolesError) {
        setMessage(rolesError.message);
        setLoading(false);
        return;
      }

      const platformRole = roles
        ?.map((row) => row.role as PlatformRole)
        .sort((a, b) => platformRoleRank(b) - platformRoleRank(a))[0];

      if (platformRole) {
        resolvedRole = appRoleForPlatformRole(platformRole);
      }
    }

    const { data: employeeProfile, error: employeeError } = await supabase
      .from("employees")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (employeeError) {
      setMessage(employeeError.message);
      setLoading(false);
      return;
    }

    resolvedRole = resolvedRole ?? (employeeProfile?.role as Role | undefined);

    if (!resolvedRole) {
      setMessage("Signed in, but no Experience profile is connected to this account yet.");
      setLoading(false);
      return;
    }

    if (employeeProfile?.id) {
      window.localStorage.setItem("journey-active-account-id", employeeProfile.id as string);
    }
    router.push(routeForRole(resolvedRole));
    setLoading(false);
  }

  return (
    <div className="grid gap-3 rounded-lg border border-journey-line bg-journey-mist p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase text-journey-red">
            Production Sign In
          </p>
          <p className="text-sm font-bold text-journey-steel">
            Supabase Auth with role-based routing.
          </p>
        </div>
        <div className="flex rounded-md border border-journey-line bg-journey-white p-1">
          <button
            type="button"
            onClick={() => setMode("sign_in")}
            className={`rounded-sm px-3 py-2 text-xs font-black uppercase ${
              mode === "sign_in"
                ? "bg-journey-black text-journey-white"
                : "text-journey-steel"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("create_account")}
            className={`rounded-sm px-3 py-2 text-xs font-black uppercase ${
              mode === "create_account"
                ? "bg-journey-black text-journey-white"
                : "text-journey-steel"
            }`}
          >
            Create
          </button>
        </div>
      </div>

      <label className="grid gap-2 text-sm font-bold text-journey-black">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
          placeholder="sam.carter@north.example"
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-journey-black">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void handleSubmit();
            }
          }}
          className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
        />
      </label>
      <Button
        type="button"
        icon={mode === "sign_in" ? LogIn : UserPlus}
        onClick={() => void handleSubmit()}
        disabled={loading}
      >
        {loading ? "Working..." : mode === "sign_in" ? "Sign In" : "Create Account"}
      </Button>
      {message ? (
        <p className="text-sm font-black text-journey-red">{message}</p>
      ) : (
        <p className="text-xs font-bold text-journey-steel">
          {hasEnv
            ? "Create Supabase Auth users, then connect them to profiles/user_roles and employees by auth_user_id."
            : "Supabase env vars are not present, so preview access codes remain available."}
        </p>
      )}
    </div>
  );
}
