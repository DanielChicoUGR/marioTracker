import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthProvider";

export function AppHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-[var(--color-dark-border)] bg-[var(--color-mario-red)] text-white shadow-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="font-[family-name:var(--font-display)] text-xl">
          Mario Tracker
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <Link
            className="rounded-md px-2 py-1 hover:bg-white/10"
            to="/tournaments/new"
          >
            Torneo
          </Link>
          <Link className="rounded-md px-2 py-1 hover:bg-white/10" to="/friends">
            Amigos
          </Link>
          <Link className="rounded-md px-2 py-1 hover:bg-white/10" to="/history">
            Historial
          </Link>
          <a
            className="rounded-md px-2 py-1 hover:bg-white/10"
            href="/legacy/index.html"
            target="_blank"
            rel="noreferrer"
          >
            Clásico
          </a>
          {user ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => void signOut()}
            >
              Salir ({user.email})
            </Button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
