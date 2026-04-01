import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  respondToRequest,
  sendFriendRequest,
} from "@/features/friends/friendRequestsApi";
import { supabase } from "@/lib/supabaseClient";

type FriendRequest = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: string;
  created_at: string;
};

type Friendship = {
  user_a: string;
  user_b: string;
  created_at: string;
};

export default function FriendsPage() {
  const [targetId, setTargetId] = useState("");
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | null>(null);

  async function load() {
    setError(null);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id ?? null;
    setMyId(uid);
    if (!uid) {
      return;
    }

    const { data: reqs, error: rErr } = await supabase
      .from("friend_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (rErr) {
      setError(rErr.message);
      return;
    }

    const list = (reqs ?? []) as FriendRequest[];
    setIncoming(list.filter((r) => r.to_user_id === uid && r.status === "pending"));

    const { data: fr, error: fErr } = await supabase
      .from("friendships")
      .select("*");

    if (fErr) {
      setError(fErr.message);
      return;
    }
    setFriends((fr ?? []) as Friendship[]);
  }

  useEffect(() => {
    // Carga inicial desde Supabase
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch async que actualiza estado al resolver
    void load();
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Amigos</CardTitle>
          <CardDescription>
            Envía solicitudes con el UUID del usuario destino (visible en
            Supabase Auth o perfil de prueba).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="target">UUID destino</Label>
            <Input
              id="target"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>
          <Button
            type="button"
            onClick={async () => {
              try {
                await sendFriendRequest(targetId.trim());
                setTargetId("");
                await load();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Error");
              }
            }}
          >
            Enviar solicitud
          </Button>
          {error ? (
            <p className="text-sm font-bold text-red-700">{error}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Entrantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {incoming.length === 0 ? (
            <p className="text-sm text-neutral-600">Sin solicitudes.</p>
          ) : (
            incoming.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white p-2"
              >
                <span className="text-xs">De {r.from_user_id}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    type="button"
                    onClick={async () => {
                      await respondToRequest(r.id, "accepted");
                      await load();
                    }}
                  >
                    Aceptar
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    onClick={async () => {
                      await respondToRequest(r.id, "rejected");
                      await load();
                    }}
                  >
                    Rechazar
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Amistades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {friends.length === 0 ? (
            <p className="text-sm text-neutral-600">Aún no tienes amigos.</p>
          ) : (
            friends.map((f) => {
              const other =
                myId && f.user_a === myId
                  ? f.user_b
                  : myId && f.user_b === myId
                    ? f.user_a
                    : `${f.user_a} / ${f.user_b}`;
              return (
                <div
                  key={`${f.user_a}-${f.user_b}`}
                  className="rounded-md border border-neutral-200 bg-white p-2 text-sm"
                >
                  {other}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
