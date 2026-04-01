import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn(
    "[mario-tracker] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Configura .env.local.",
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "");
