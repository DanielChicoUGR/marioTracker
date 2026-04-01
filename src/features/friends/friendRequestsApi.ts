import { supabase } from "@/lib/supabaseClient";

export async function sendFriendRequest(toUserId: string) {
  const { data: userData, error: uErr } = await supabase.auth.getUser();
  if (uErr || !userData.user) {
    throw uErr ?? new Error("Sin usuario");
  }

  const { error } = await supabase.from("friend_requests").insert({
    from_user_id: userData.user.id,
    to_user_id: toUserId,
    status: "pending",
  });

  if (error) {
    throw error;
  }
}

export async function respondToRequest(
  requestId: string,
  decision: "accepted" | "rejected",
) {
  const { error } = await supabase
    .from("friend_requests")
    .update({ status: decision })
    .eq("id", requestId);

  if (error) {
    throw error;
  }
}
