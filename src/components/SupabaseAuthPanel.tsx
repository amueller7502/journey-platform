"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  HandHeart,
  LayoutDashboard,
  LogIn,
  Mail,
  UserPlus,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  appRoleForPlatformRole,
  platformRoleRank,
  roleCanAccess,
  routeForRole,
} from "@/lib/access-control";
import { createClient, hasSupabaseBrowserEnv } from "@/lib/supabase/client";
import type { PlatformRole, Role } from "@/lib/types";

type AuthMode = "sign_in" | "create_account" | "reset_password";

const experienceOptions: Array<{
  role: Role;
  label: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    role: "employee",
    label: "Employee",
    description: "Today, My Experience, Rewards, Profile",
    icon: UserRound,
  },
  {
    role: "manager",
    label: "Manager",
    description: "Capture Moments and run shift tools",
    icon: HandHeart,
  },
  {
    role: "admin",
    label: "Builder",
    description: "Recognition, Rewards, Employees, Settings",
    icon: LayoutDashboard,
  },
];

function roleLabel(role: Role) {
  if (role === "admin") {
    return "Experience Builder";
  }

  if (role === "manager") {
    return "Manager";
  }

  return "Employee";
}

export function SupabaseAuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [selectedRole, setSelectedRole] = useState<Role>("employee");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const hasEnv = hasSupabaseBrowserEnv();

  async function handleSubmit() {
    setMessage("");

    if (!hasEnv) {
      setMessage("Supabase environment variables are required before accounts can be used.");
      return;
    }

    const supabase = createClient();
    const cleanEmail = email.trim().toLowerCase();

    if (mode === "reset_password") {
      if (!cleanEmail) {
        setMessage("Email is required to send a reset link.");
        return;
      }

      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "If an Experience account exists for that email, a reset link is on the way.",
      );
      return;
    }

    if (mode === "create_account" && !fullName.trim()) {
      setMessage("Name is required to create an account.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setMessage("Email and password are required.");
      return;
    }

    setLoading(true);

    if (mode === "create_account") {
      const createResponse = await fetch("/api/auth/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: cleanEmail,
          password,
          role: selectedRole,
        }),
      });

      const createPayload = (await createResponse.json()) as {
        error?: string;
        employeeId?: string;
      };

      if (!createResponse.ok) {
        setMessage(createPayload.error ?? "Unable to create account.");
        setLoading(false);
        return;
      }

      if (createPayload.employeeId) {
        window.localStorage.setItem("journey-active-account-id", createPayload.employeeId);
      }
    }

    const authResult = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authResult.error) {
      setMessage(`${authResult.error.message}. Use Forgot Password if you need a new one.`);
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
      .select("id, app_id, role")
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

    if (!roleCanAccess(resolvedRole, selectedRole)) {
      setMessage(
        `${roleLabel(resolvedRole)} accounts cannot open the ${roleLabel(
          selectedRole,
        )} experience.`,
      );
      setLoading(false);
      return;
    }

    if (employeeProfile?.id || employeeProfile?.app_id) {
      window.localStorage.setItem(
        "journey-active-account-id",
        (employeeProfile.app_id as string | null) ?? (employeeProfile.id as string),
      );
    }
    router.push(routeForRole(selectedRole));
    setLoading(false);
  }

  return (
    <div className="grid gap-3 rounded-lg border border-journey-line bg-journey-mist p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase text-journey-red">
            Account Access
          </p>
          <p className="text-sm font-bold text-journey-steel">
            {mode === "reset_password"
              ? "Enter your email and we will send a password reset link."
              : "Choose the experience you want to open."}
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

      {mode === "reset_password" ? (
        <button
          type="button"
          onClick={() => {
            setMode("sign_in");
            setMessage("");
          }}
          className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-black text-journey-red"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to sign in
        </button>
      ) : null}

      {mode !== "reset_password" ? (
        <div className="grid gap-2">
          {experienceOptions.map((option) => {
            const Icon = option.icon;
            const selected = selectedRole === option.role;
            return (
              <button
                key={option.role}
                type="button"
                onClick={() => setSelectedRole(option.role)}
                className={`focus-ring flex min-h-16 items-center gap-3 rounded-lg border p-3 text-left transition ${
                  selected
                    ? "border-journey-red bg-journey-black text-journey-white"
                    : "border-journey-line bg-journey-white text-journey-black hover:bg-journey-mist"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
                    selected
                      ? "bg-journey-red text-journey-white"
                      : "bg-journey-mist text-journey-red"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-black">{option.label}</span>
                  <span
                    className={`mt-1 block text-xs font-bold ${
                      selected ? "text-journey-line" : "text-journey-steel"
                    }`}
                  >
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {mode === "create_account" ? (
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Name
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
            placeholder="Sam Carter"
          />
        </label>
      ) : null}

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
      {mode !== "reset_password" ? (
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
      ) : null}
      {mode === "sign_in" ? (
        <button
          type="button"
          onClick={() => {
            setMode("reset_password");
            setMessage("");
          }}
          className="focus-ring justify-self-start rounded-md text-sm font-black text-journey-red"
        >
          Forgot password?
        </button>
      ) : null}
      <Button
        type="button"
        icon={
          mode === "sign_in" ? LogIn : mode === "reset_password" ? Mail : UserPlus
        }
        onClick={() => void handleSubmit()}
        disabled={loading}
      >
        {loading
          ? "Working..."
          : mode === "sign_in"
            ? "Sign In"
            : mode === "reset_password"
              ? "Send Reset Link"
              : "Create Account"}
      </Button>
      {message ? (
        <p
          className={`text-sm font-black ${
            message.startsWith("If an Experience account")
              ? "text-journey-black"
              : "text-journey-red"
          }`}
        >
          {message}
        </p>
      ) : (
        <p className="text-xs font-bold text-journey-steel">
          {hasEnv
            ? mode === "reset_password"
              ? "Reset links expire for safety. If one expires, request another."
              : mode === "create_account"
                ? "Creating an account also creates the matching Experience profile and role."
                : "Your account role controls which experiences you can open."
            : "Supabase env vars are not present, so live account access is unavailable."}
        </p>
      )}
    </div>
  );
}
