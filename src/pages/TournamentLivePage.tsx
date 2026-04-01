import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { joinTournament } from "@/features/tournament/joinTournament";
import { recordTournamentEvent } from "@/features/tournament/recordTournamentEvent";
import { updateTournamentState } from "@/features/tournament/updateTournamentState";
import { useTournamentRealtime } from "@/features/tournament/useTournamentRealtime";
import { supabase } from "@/lib/supabaseClient";

export default function TournamentLivePage() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { row, error, channelStatus } = useTournamentRealtime(tournamentId);
  const [msg, setMsg] = useState<string | null>(null);
  const [role, setRole] = useState<"player" | "spectator">("player");

  async function handleJoin() {
    if (!tournamentId) {
      return;
    }
    try {
      await joinTournament(tournamentId, role);
      setMsg("Te has unido al torneo.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No se pudo unir");
    }
  }

  async function bumpState() {
    if (!tournamentId || !row) {
      return;
    }
    const next = {
      ...(typeof row.state === "object" && row.state !== null
        ? (row.state as Record<string, unknown>)
        : {}),
      tick: Date.now(),
    };
    try {
      await updateTournamentState(tournamentId, next);
      setMsg("Estado actualizado.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sin permiso o error");
    }
  }

  async function completeTournament() {
    if (!tournamentId) {
      return;
    }
    try {
      const { error: e1 } = await supabase
        .from("tournaments")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", tournamentId);
      if (e1) {
        throw e1;
      }
      await recordTournamentEvent(tournamentId, "completed", {
        at: new Date().toISOString(),
      });
      setMsg("Torneo finalizado.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error al finalizar");
    }
  }

  if (!tournamentId) {
    return <p className="p-6 text-white">ID inválido</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{row?.name ?? "Torneo"}</CardTitle>
          <CardDescription>
            Estado Realtime:{" "}
            <span className="font-mono">
              {channelStatus === "subscribed" ? "conectado" : "conectando…"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="font-bold text-red-700">{error}</p>
          ) : null}
          {msg ? <p className="text-sm font-semibold text-green-800">{msg}</p> : null}
          <pre className="max-h-64 overflow-auto rounded-md bg-neutral-900 p-3 text-xs text-green-100">
            {JSON.stringify(row?.state ?? {}, null, 2)}
          </pre>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate("/")}>
              Inicio
            </Button>
            <select
              className="rounded-md border-4 border-[var(--color-dark-border)] bg-white px-2 py-1 text-sm"
              value={role}
              onChange={(e) =>
                setRole(e.target.value === "spectator" ? "spectator" : "player")
              }
            >
              <option value="player">Jugador</option>
              <option value="spectator">Espectador</option>
            </select>
            <Button type="button" onClick={() => void handleJoin()}>
              Unirme
            </Button>
            <Button type="button" variant="secondary" onClick={() => void bumpState()}>
              Actualizar estado (organizador)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void completeTournament()}
            >
              Finalizar torneo
            </Button>
          </div>
          <p className="text-xs text-neutral-600">
            Copia la URL del navegador para compartir este torneo. Los cambios
            deberían verse en segundos para quien esté en la misma sala.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
