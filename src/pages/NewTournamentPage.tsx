import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
import { createTournamentWithOrganizer } from "@/features/tournament/createTournament";

export default function NewTournamentPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("Torneo rápido");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-lg p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo torneo</CardTitle>
          <CardDescription>
            Serás organizador. Comparte el enlace del torneo con amigos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {error ? (
            <p className="text-sm font-bold text-red-700">{error}</p>
          ) : null}
          <Button
            type="button"
            onClick={async () => {
              try {
                const id = await createTournamentWithOrganizer(name.trim());
                navigate(`/tournament/${id}`, { replace: true });
              } catch (e) {
                setError(e instanceof Error ? e.message : "Error");
              }
            }}
          >
            Crear y abrir
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
