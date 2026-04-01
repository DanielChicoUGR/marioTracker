import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido</CardTitle>
          <CardDescription>
            Crea un torneo, comparte el enlace y sigue el estado en vivo con
            amigos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/tournaments/new">Nuevo torneo</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/friends">Amigos</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/history">Historial</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
