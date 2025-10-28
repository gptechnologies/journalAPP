import { createClient, type SupabaseClient as SupabaseClientType } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type SupabaseClient = SupabaseClientType<Database>;

let client: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables are not configured.");
    }

    client = createClient<Database, "public">(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });
  }

  return client;
}
