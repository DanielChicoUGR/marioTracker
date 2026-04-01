import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppHeader } from "@/components/AppHeader";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const NewTournamentPage = lazy(() => import("@/pages/NewTournamentPage"));
const TournamentLivePage = lazy(() => import("@/pages/TournamentLivePage"));
const FriendsPage = lazy(() => import("@/features/friends/FriendsPage"));
const HistoryPage = lazy(() => import("@/features/history/HistoryPage"));

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center text-white">
            Cargando…
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}

export function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments/new"
          element={
            <ProtectedRoute>
              <NewTournamentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournament/:tournamentId"
          element={
            <ProtectedRoute>
              <TournamentLivePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <FriendsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
