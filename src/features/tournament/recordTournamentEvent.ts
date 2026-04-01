import { supabase } from "@/lib/supabaseClient";

export async function recordTournamentEvent(
  tournamentId: string,
  type: string,
  payload: Record<string, unknown>,
) {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from("tournament_events").insert({
    tournament_id: tournamentId,
    user_id: userData.user?.id ?? null,
    type,
    payload,
  });

  if (error) {
    throw error;
  }
}
