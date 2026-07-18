"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { Button, LinkButton } from "@/components/ui/Button";
import { createClient, hasSupabaseBrowserEnv } from "@/lib/supabase/client";

type BootstrapResponse = {
  error?: string;
  employeeId?: string;
  message?: string;
  route?: string;
};

export function BuilderAccessClient() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasEnv = hasSupabaseBrowserEnv();

  async function createBuilderAccess() {
    setMessage("");
    setSuccess(false);

    if (!hasEnv) {
      setMessage("Supabase environment variables are required before access can be repaired.");
      return;
    }

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setMessage("Name, email, and password are required.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/bootstrap-builder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        setupKey: setupKey.trim() || undefined,
      }),
    });
    const payload = (await response.json()) as BootstrapResponse;

    if (!response.ok) {
      setLoading(false);
      setMessage(payload.error ?? "Unable to repair Builder access.");
      return;
    }

    if (payload.employeeId) {
      window.localStorage.setItem("journey-active-account-id", payload.employeeId);
    }
    window.localStorage.setItem("experience-active-role", "admin");

    const supabase = createClient();
    const authResult = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);

    if (authResult.error) {
      setSuccess(true);
      setMessage(
        payload.message ??
          "Builder access is ready. Return to sign in and use this email and password.",
      );
      return;
    }

    setSuccess(true);
    setMessage("Builder access is ready. Opening Experience Builder...");
    router.push(payload.route ?? "/admin/dashboard");
  }

  return (
    <main className="cinema-surface film-grain relative min-h-screen text-journey-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 film-perf opacity-30" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 film-perf opacity-30" />
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <BrandLockup size="md" />
          <LinkButton href="/" icon={ArrowLeft} variant="secondary">
            Back to Points
          </LinkButton>
        </header>

        <section className="grid flex-1 items-center py-12">
          <div className="rounded-lg border border-journey-steel bg-journey-white p-5 text-journey-black shadow-premium">
            <div className="border-b border-journey-line pb-4">
              <p className="text-xs font-black uppercase text-journey-red">
                Emergency Access
              </p>
              <h1 className="mt-2 text-3xl font-black">Create Builder Access</h1>
              <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
                Use this if nobody can sign in as an Experience Builder yet. It
                creates or repairs one real Supabase login with Builder access.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="grid gap-2 text-sm font-bold text-journey-black">
                Name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
                  placeholder="Austin Mueller"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-journey-black">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
                  placeholder="you@celebrationcinema.com"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-journey-black">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
                  placeholder="At least 8 characters"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-journey-black">
                Setup Key
                <input
                  type="password"
                  value={setupKey}
                  onChange={(event) => setSetupKey(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void createBuilderAccess();
                    }
                  }}
                  className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
                  placeholder="Only needed if a Builder login already exists"
                />
              </label>

              <Button
                type="button"
                icon={success ? ShieldCheck : KeyRound}
                onClick={() => void createBuilderAccess()}
                disabled={loading}
              >
                {loading ? "Preparing Access..." : "Create Builder Access"}
              </Button>

              {message ? (
                <div
                  className={`rounded-lg border p-3 text-sm font-black ${
                    success
                      ? "border-journey-line bg-journey-mist text-journey-black"
                      : "border-journey-red bg-journey-white text-journey-red"
                  }`}
                >
                  {message}
                </div>
              ) : (
                <p className="text-xs font-bold text-journey-steel">
                  If no connected Builder login exists, you can leave Setup Key
                  blank. If the app says one already exists, set
                  `EXPERIENCE_SETUP_KEY` in Vercel and enter it here.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
