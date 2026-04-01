import { supabase } from "@/lib/supabaseClient";

export type HistoryRow = {
  tournament_id: string;
  name: string;
  status: string;
  updated_at: string;
  role: string;
};

export async function fetchMyTournamentHistory(): Promise<HistoryRow[]> {
  const { data: userData, error: uErr } = await supabase.auth.getUser();
  if (uErr || !userData.user) {
    throw uErr ?? new Error("Sin usuario");
  }

  const { data, error } = await supabase
    .from("tournament_participants")
    .select(
      `
      role,
      tournaments (
        id,
        name,
        status,
        updated_at
      )
    `,
    )
    .eq("user_id", userData.user.id);

  if (error) {
    throw error;
  }

  type Joined = {
    role: string;
    tournaments: {
      id: string;
      name: string;
      status: string;
      updated_at: string;
    } | null;
  };

  const rows = (data ?? []) as unknown as Joined[];

  return rows
    .filter((r) => r.tournaments)
    .map((r) => ({
      tournament_id: r.tournaments!.id,
      name: r.tournaments!.name,
      status: r.tournaments!.status,
      updated_at: r.tournaments!.updated_at,
      role: r.role,
    }))
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
}
