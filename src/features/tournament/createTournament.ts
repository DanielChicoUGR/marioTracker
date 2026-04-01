import { supabase } from "@/lib/supabaseClient";

export async function createTournamentWithOrganizer(name: string) {
  const { data: t, error: tErr } = await supabase
    .from("tournaments")
    .insert({
      name,
      status: "active",
      state: { round: 1, note: "Empezamos" },
    })
    .select("id")
    .single();

  if (tErr) {
    throw tErr;
  }

  const { data: userData, error: uErr } = await supabase.auth.getUser();
  if (uErr || !userData.user) {
    throw uErr ?? new Error("Sin usuario");
  }

  const { error: pErr } = await supabase.from("tournament_participants").insert({
    tournament_id: t.id,
    user_id: userData.user.id,
    role: "organizer",
  });

  if (pErr) {
    throw pErr;
  }

  return t.id as string;
}
