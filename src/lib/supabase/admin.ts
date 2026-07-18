import { createClient } from "@supabase/supabase-js";

function supabaseAdminUrl() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim()
  );
}

function supabaseAdminKey() {
  return (
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

export function hasSupabaseAdminEnv() {
  return Boolean(supabaseAdminUrl() && supabaseAdminKey());
}

export function supabaseAdminEnvStatus() {
  return {
    urlConfigured: Boolean(supabaseAdminUrl()),
    serverKeyConfigured: Boolean(supabaseAdminKey()),
  };
}

export function createAdminClient() {
  return createClient(
    supabaseAdminUrl()!,
    supabaseAdminKey()!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
