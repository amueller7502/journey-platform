"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { KeyRound, LogIn } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { createClient, hasSupabaseBrowserEnv } from "@/lib/supabase/client";

type ResetState = "checking" | "ready" | "complete" | "error";

export function PasswordResetClient() {
  const router = useRouter();
  const hasEnv = hasSupabaseBrowserEnv();
  const [state, setState] = useState<ResetState>(hasEnv ? "checking" : "error");
  const [message, setMessage] = useState(
    hasEnv
      ? "Checking your reset link..."
      : "Supabase environment variables are required to reset passwords.",
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasEnv) {
      return;
    }

    const supabase = createClient();

    async function prepareResetSession() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setState("error");
          setMessage(error.message);
          return;
        }
        window.history.replaceState({}, document.title, "/reset-password");
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          setState("error");
          setMessage(error.message);
          return;
        }
        window.history.replaceState({}, document.title, "/reset-password");
      } else {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setState("error");
          setMessage("This reset link is missing or expired. Request a new one.");
          return;
        }
      }

      setState("ready");
      setMessage("Choose a new password for your Experience account.");
    }

    void prepareResetSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setState("ready");
        setMessage("Choose a new password for your Experience account.");
      }
    });

    return () => subscription.unsubscribe();
  }, [hasEnv]);

  async function updatePassword() {
    setMessage("");

    if (!hasEnv) {
      setState("error");
      setMessage("Supabase environment variables are required to reset passwords.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setState("error");
      setMessage(error.message);
      return;
    }

    setState("complete");
    setMessage("Password updated. You can sign in with your new password.");
    await supabase.auth.signOut();
    window.setTimeout(() => router.push("/"), 1200);
  }

  return (
    <div className="rounded-lg border border-journey-steel bg-journey-white p-5 text-journey-black shadow-premium">
      <div className="border-b border-journey-line pb-4">
        <p className="text-xs font-black uppercase text-journey-red">
          Account Recovery
        </p>
        <h1 className="mt-2 text-3xl font-black">Reset Password</h1>
        <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
          {message}
        </p>
      </div>

      {state === "ready" ? (
        <div className="mt-5 grid gap-3">
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            New Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void updatePassword();
                }
              }}
              className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
            />
          </label>
          <Button
            type="button"
            icon={KeyRound}
            onClick={() => void updatePassword()}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      ) : null}

      {state === "checking" ? (
        <div className="mt-5 rounded-lg border border-journey-line bg-journey-mist p-4 text-sm font-black text-journey-steel">
          Opening the reset link...
        </div>
      ) : null}

      {state === "error" ? (
        <div className="mt-5 grid gap-3">
          <div className="rounded-lg border border-journey-red bg-journey-white p-3 text-sm font-black text-journey-red">
            {message}
          </div>
          <LinkButton href="/" icon={LogIn} variant="dark">
            Back to Sign In
          </LinkButton>
        </div>
      ) : null}

      {state === "complete" ? (
        <div className="mt-5 grid gap-3">
          <div className="rounded-lg border border-journey-line bg-journey-mist p-3 text-sm font-black text-journey-black">
            {message}
          </div>
          <Link className="text-sm font-black text-journey-red" href="/">
            Return to sign in
          </Link>
        </div>
      ) : null}
    </div>
  );
}
