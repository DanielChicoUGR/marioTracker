---
description: "Task list for Social, historial y torneo en vivo"
---

# Tasks: Social, historial y torneo en vivo

**Input**: Design documents from `/specs/001-social-realtime-tournament/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: La constitución exige pruebas proporcionales al riesgo; se incluyen tareas Vitest para auth, amistades y torneo (mocks/integration acotada).

**Organization**: Fases por historia de usuario (P1→P4) según spec.md.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralelizable (archivos distintos, sin dependencia de tareas incompletas del mismo lote)
- **[Story]**: [US1]…[US4] solo en fases de historias de usuario
- Rutas relativas al **raíz del repositorio** salvo que se indique `specs/...`

## Path Conventions

- SPA en `src/`; migraciones en `supabase/migrations/`; tests en `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar Vite + React + TypeScript + Bun según plan.md

- [x] T001 Create Vite+React+TS scaffold: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html` (entrada Vite), `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`
- [x] T002 Run `bun install` and add runtime deps: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `typescript`, `@supabase/supabase-js`, `react-router-dom`, `tailwindcss`, `@tailwindcss/vite` (Tailwind v4)
- [x] T003 [P] Add ESLint flat config: `eslint.config.js` with TypeScript + React Hooks rules for `src/`
- [x] T004 [P] Add Vitest: `vitest.config.ts`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`; script `bun run test` in `package.json`
- [x] T005 [P] Extend `.gitignore` with `.env.local`, `dist/`, `coverage/`, and Supabase local artifacts if used

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Esquema Supabase, cliente, shell de app y diseño base — **ninguna historia de usuario puede empezar hasta completar esta fase**

**⚠️ CRITICAL**: Bloquea US1–US4

- [x] T006 Create `supabase/migrations/` with initial SQL migration defining `public.profiles`, `public.friend_requests`, `public.friendships`, `public.tournaments`, `public.tournament_participants`, `public.tournament_events` per `specs/001-social-realtime-tournament/data-model.md`
- [x] T007 Add RLS policies, constraints, indexes, and `accept_friend_request` RPC or trigger to insert into `friendships` when request is accepted per `specs/001-social-realtime-tournament/contracts/rls-expectations.md`
- [x] T008 Enable Realtime publication for `public.tournaments` and `public.tournament_events` (SQL `ALTER PUBLICATION supabase_realtime ADD TABLE ...` or project dashboard) and document steps in `supabase/README.md`
- [x] T009 Implement `src/lib/supabaseClient.ts` using `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY` per `specs/001-social-realtime-tournament/contracts/supabase-client.env.md`
- [x] T010 Add `.env.example` at repo root with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` placeholders (no secrets)
- [x] T011 Add `src/index.css` with Tailwind v4 entry (`@import "tailwindcss"`) and CSS variables for MarioTracker theme (migrate tokens from legacy `index.html` `:root`)
- [x] T012 Initialize shadcn/ui for Vite+React: `components.json`, path aliases in `tsconfig.json`/`vite.config.ts`, and base primitives under `src/components/ui/` (at minimum: `button`, `input`, `card`, `label`, `form`)
- [x] T013 Implement `src/features/auth/AuthProvider.tsx` wrapping the app: `supabase.auth.getSession()`, `onAuthStateChange`, expose session/user to children
- [x] T014 Wire `src/main.tsx` to wrap `<BrowserRouter>` and `<AuthProvider>` and define routes in `src/App.tsx` for `/login`, `/tournament/:tournamentId`, `/friends`, `/history`, and `/` redirect

**Checkpoint**: Proyecto arranca con `bun run dev`; migraciones aplicables al proyecto Supabase; sesión observable en React.

---

## Phase 3: User Story 1 - Cuenta e inicio de sesión (Priority: P1) 🎯 MVP

**Goal**: Registro, inicio y cierre de sesión con perfil mínimo en `public.profiles`.

**Independent Test**: Crear cuenta, cerrar sesión, volver a entrar; perfil visible solo para el usuario autenticado.

- [x] T015 [US1] Build `src/features/auth/LoginPage.tsx`: email+password `signUp`, `signIn`, error states with shadcn + `FR-008`
- [x] T016 [US1] Add `src/features/auth/profileSync.ts` and call from auth flow to `upsert` `public.profiles` (`id`, `display_name`) after sign-up/first login
- [x] T017 [US1] Implement `src/features/auth/ProtectedRoute.tsx` redirecting unauthenticated users to `/login`
- [x] T018 [US1] Add logout control in shared layout/header component (e.g. `src/components/AppHeader.tsx`)
- [x] T019 [US1] Add `tests/unit/auth-session.test.tsx` testing `AuthProvider` state transitions with mocked `supabase.auth` (Vitest)

**Checkpoint**: US1 cumplida: flujo de sesión y perfil acorde a escenarios de aceptación.

---

## Phase 4: User Story 2 - Torneo visible en vivo (Priority: P2)

**Goal**: Participantes autorizados ven actualizaciones del estado del torneo sin recargar manualmente como único mecanismo (`FR-006`, `NFR-002`).

**Independent Test**: Dos sesiones en el mismo torneo; un `UPDATE` en `tournaments` se refleja en la otra vista en &lt; 5s en red estable.

- [x] T020 [US2] Implement `src/features/tournament/useTournamentRealtime.ts` subscribing to `postgres_changes` on `public.tournaments` with filter `id=eq.{tournamentId}` per `specs/001-social-realtime-tournament/contracts/realtime-subscriptions.md`
- [x] T021 [US2] Build `src/features/tournament/TournamentLivePage.tsx`: load row by `tournamentId`, render `state` json + connection/status pill, handle reconnect messaging (`FR-008`)
- [x] T022 [US2] Add `src/features/tournament/joinTournament.ts` inserting into `public.tournament_participants` for current user (role per product default e.g. `player`)
- [x] T023 [US2] Add `src/features/tournament/updateTournamentState.ts` for authorized users to patch `tournaments.state` / `updated_at` consistent with RLS (organizer/player as defined in migration)
- [x] T024 [US2] Add `tests/integration/tournament-channel.test.ts` mocking Supabase `channel().on().subscribe()` to assert handler wiring (Vitest)

**Checkpoint**: US2 verificable con dos cuentas de prueba en el mismo torneo.

---

## Phase 5: User Story 3 - Amistades (Priority: P3)

**Goal**: Solicitudes pendientes, aceptar/rechazar, lista de amigos (`FR-003`, `FR-004`).

**Independent Test**: Cuentas A/B intercambian solicitud; B acepta; ambos ven amistad; rechazo no crea amistad.

- [x] T025 [US3] Build `src/features/friends/FriendsPage.tsx`: tabs or sections for incoming/outgoing `friend_requests` and `friendships` list using shadcn
- [x] T026 [US3] Implement `src/features/friends/friendRequestsApi.ts`: `sendRequest`, `respondToRequest` calling Supabase updates/RPC per migration from T007
- [x] T027 [US3] Add `tests/unit/friend-pair.test.ts` for UUID ordering helper `(user_a, user_b)` if extracted for client-side validation

**Checkpoint**: US3 cumple escenarios de aceptación de spec.md.

---

## Phase 6: User Story 4 - Historial (Priority: P4)

**Goal**: Lista de participación y resultados coherentes con datos persistidos (`FR-005`, `SC-004`).

**Independent Test**: Tras torneo `completed`, historial muestra entrada; usuario sin datos ve empty state explicativo.

- [x] T028 [US4] Implement `src/features/history/historyQueries.ts` selecting user’s tournaments via `tournament_participants` join `tournaments` (and optional `tournament_events`)
- [x] T029 [US4] Build `src/features/history/HistoryPage.tsx` with ordered list, final status, timestamps, empty state (`FR-008` / spec empty case)
- [x] T030 [US4] On tournament completion flow (from US2), insert summary row or event into `tournament_events` if required for `SC-004` consistency

**Checkpoint**: US4 verificable contra datos de prueba en Supabase.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Migración legacy, rendimiento, UX, validación de guía

- [x] T031 [P] Extract or wrap high-value UI from legacy `index.html` into `src/` components; document deprecation path for monolithic file
- [x] T032 Lazy-load route components with `React.lazy` and `Suspense` in `src/App.tsx` per plan performance goals
- [x] T033 [P] Add `bun run lint` script and fix issues in `src/` to satisfy constitution tooling gate
- [x] T034 Run manual validation following `specs/001-social-realtime-tournament/quickstart.md` and fix gaps (scripts, docs)
- [x] T035 [P] UX consistency pass: loading/error strings across `src/features/auth`, `tournament`, `friends`, `history`
- [x] T036 [P] Performance check: verify Realtime subscription teardown on route leave in `useTournamentRealtime.ts` to avoid duplicate channels

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** → **Phases 3–6 (US1→US4)** → **Phase 7**
- **US2** depende de **US1** (sesión para participar)
- **US3** depende de **US1** (identidad)
- **US4** depende de **US1** y datos de torneo (`US2` recomendado para datos realistas)

### User Story Order

| Story | Depends on |
|-------|------------|
| US1 | Foundational only |
| US2 | US1 + Foundational |
| US3 | US1 + Foundational |
| US4 | US1 + Foundational; US2 para poblar datos de ejemplo |

### Parallel Opportunities

- T003, T004, T005 en Phase 1
- T031, T033, T035, T036 en Phase 7 (tras completar historias deseadas)

---

## Parallel Example: User Story 2

```bash
# Tras T019, desarrollador puede paralelizar si hay dos personas:
Task: "T020 [US2] useTournamentRealtime.ts"
Task: "T022 [US2] joinTournament.ts"  # tras contrato de RLS estable
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 + Phase 2  
2. Complete Phase 3 (US1)  
3. **STOP**: validar login/perfil en proyecto Supabase real

### Incremental Delivery

1. +US2 → torneo en vivo  
2. +US3 → amistades  
3. +US4 → historial  
4. Phase 7 → hardening

### Contract Traceability

| Contract / doc | Tasks |
|----------------|-------|
| `contracts/supabase-client.env.md` | T009, T010 |
| `contracts/rls-expectations.md` | T006, T007 |
| `contracts/realtime-subscriptions.md` | T008, T020 |
| `data-model.md` | T006, T007, T022, T028–T030 |
| `quickstart.md` | T034 |

---

## Notes

- IDs T001–T036 secuenciales; marcar `[x]` al completar en implementación.
- No usar `service_role` en el cliente (ver contrato env).
- Si el RPC de amistad difiere del nombre aquí, actualizar T007/T026 juntos.
