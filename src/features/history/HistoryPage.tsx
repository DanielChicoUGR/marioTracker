import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchMyTournamentHistory,
  type HistoryRow,
} from "@/features/history/historyQueries";

export default function HistoryPage() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchMyTournamentHistory();
        setRows(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center font-bold text-white">Cargando…</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Historial</CardTitle>
          <CardDescription>Torneos en los que has participado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? (
            <p className="font-bold text-red-700">{error}</p>
          ) : null}
          {rows.length === 0 ? (
            <p className="text-sm text-neutral-600">
              Aún no hay torneos en tu historial. Crea uno o únete con el
              enlace.
            </p>
          ) : (
            <ul className="space-y-2">
              {rows.map((r) => (
                <li
                  key={r.tournament_id}
                  className="rounded-md border border-neutral-200 bg-white p-3 text-sm"
                >
                  <div className="font-bold">{r.name}</div>
                  <div className="text-neutral-600">
                    Estado: {r.status} · Rol: {r.role}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Actualizado: {new Date(r.updated_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
