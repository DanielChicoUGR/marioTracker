import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

type Row = {
  id: string;
  state: unknown;
  updated_at: string;
  status: string;
  name: string;
};

/**
 * Suscripción a cambios de `public.tournaments` filtrados por id.
 * Limpia el canal al desmontar (evita duplicados).
 */
export function useTournamentRealtime(tournamentId: string | undefined) {
  const [row, setRow] = useState<Row | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [channelStatus, setChannelStatus] = useState<
    "idle" | "subscribed" | "error"
  >("idle");
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!tournamentId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const { data, error: loadErr } = await supabase
        .from("tournaments")
        .select("id,state,updated_at,status,name")
        .eq("id", tournamentId)
        .maybeSingle();

      if (cancelled) {
        return;
      }
      if (loadErr) {
        setError(loadErr.message);
        return;
      }
      setRow(data as Row);
    })();

    const channel = supabase
      .channel(`tournament:${tournamentId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tournaments",
          filter: `id=eq.${tournamentId}`,
        },
        (payload) => {
          const next = payload.new as Row;
          setRow(next);
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setChannelStatus("subscribed");
        }
        if (status === "CHANNEL_ERROR") {
          setChannelStatus("error");
        }
      });

    channelRef.current = channel;

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
      channelRef.current = null;
      setChannelStatus("idle");
    };
  }, [tournamentId]);

  return { row, error, channelStatus };
}
