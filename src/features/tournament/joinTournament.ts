import { supabase } from "@/lib/supabaseClient";

export async function joinTournament(
  tournamentId: string,
  role: "player" | "spectator" = "player",
) {
  const { data: userData, error: uErr } = await supabase.auth.getUser();
  if (uErr || !userData.user) {
    throw uErr ?? new Error("Sin usuario");
  }

  const { error } = await supabase.from("tournament_participants").insert({
    tournament_id: tournamentId,
    user_id: userData.user.id,
    role,
  });

  if (error) {
    throw error;
  }
}
