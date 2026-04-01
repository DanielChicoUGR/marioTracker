import { supabase } from "@/lib/supabaseClient";

export async function updateTournamentState(
  tournamentId: string,
  state: Record<string, unknown>,
) {
  const { error } = await supabase
    .from("tournaments")
    .update({
      state,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tournamentId);

  if (error) {
    throw error;
  }
}
