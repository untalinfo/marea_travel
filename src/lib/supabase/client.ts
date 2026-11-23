import { type SupabaseClient, createClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/**
 * Single shared Supabase client. Using one instance avoids multiple GoTrue clients
 * competing over the same stored session, and makes every request (admin writes
 * included) carry the signed-in user's JWT. On the server there is no localStorage,
 * so supabase-js falls back to an in-memory session (anonymous reads only).
 */
export function getSupabaseClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !rawKey) {
    throw new Error("Faltan las variables de entorno de Supabase en .env.local");
  }

  const supabaseUrl = rawUrl.trim().replace(/^["']|["']$/g, "");
  const supabaseAnonKey = rawKey.trim().replace(/^["']|["']$/g, "");

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  return browserClient;
}
