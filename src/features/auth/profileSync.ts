import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

/**
 * Garantiza fila en public.profiles tras registro o primer login.
 */
export async function upsertProfileFromUser(user: User, displayName?: string) {
  const name =
    displayName?.trim() ||
    (user.user_metadata?.display_name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "Jugador";

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: name,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw error;
  }
}
