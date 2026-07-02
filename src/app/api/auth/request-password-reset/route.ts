import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type PasswordResetBody = {
  email?: string;
};

function normalizeBaseUrl(value?: string | null) {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return null;
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isLocalUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "::1"
    );
  } catch {
    return false;
  }
}

function resetBaseUrl(request: Request) {
  const candidates = [
    process.env.EXPERIENCE_APP_URL,
    process.env.NEXT_PUBLIC_EXPERIENCE_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    request.headers.get("origin"),
  ];

  const nonLocal = candidates
    .map(normalizeBaseUrl)
    .find((candidate): candidate is string => Boolean(candidate && !isLocalUrl(candidate)));

  if (nonLocal) {
    return nonLocal;
  }

  return normalizeBaseUrl(request.headers.get("origin"));
}

export async function POST(request: Request) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json(
      { error: "Supabase environment variables are required for password reset." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as PasswordResetBody;
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required to send a reset link." },
      { status: 400 },
    );
  }

  const baseUrl = resetBaseUrl(request);
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Set EXPERIENCE_APP_URL to your deployed Experience URL." },
      { status: 503 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/reset-password`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message:
      "If an Experience account exists for that email, a reset link is on the way.",
  });
}
