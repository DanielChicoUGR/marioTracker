# Data Model: Social, historial y torneo en vivo

**Feature**: `001-social-realtime-tournament`  
**Storage**: Supabase Postgres (`public` schema)  
**Auth**: `auth.users` (UUID `id`)

## Entity relationship (logical)

```text
auth.users 1 ── 1 profiles
auth.users 1 ── * friend_requests (as requester or addressee)
auth.users * ── * friendships (pares normalizados)
tournaments 1 ── * tournament_participants
tournaments 1 ── * tournament_events (opcional, para historial fino)
auth.users 1 ── * tournament_participants
```

## Tables

### `public.profiles`

Perfil visible controlado por RLS.

| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | `references auth.users(id) on delete cascade` |
| display_name | text | Obligatorio para UX |
| created_at | timestamptz | default `now()` |
| updated_at | timestamptz | trigger opcional |

**RLS (resumen)**: `SELECT/UPDATE` solo donde `id = auth.uid()`; `INSERT` con `check (id = auth.uid())`.

### `public.friend_requests`

| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | default `gen_random_uuid()` |
| from_user_id | uuid | `references auth.users(id)` |
| to_user_id | uuid | `references auth.users(id)` |
| status | text | `pending` \| `accepted` \| `rejected` |
| created_at | timestamptz | |

**Constraints**: `from_user_id <> to_user_id`; índice único parcial para `pending` entre el mismo par (definir orden lexicográfico de UUIDs o usar restricción aplicación + check).

**RLS**:

- **SELECT**: filas donde `auth.uid()` es `from_user_id` o `to_user_id`.
- **INSERT**: `from_user_id = auth.uid()` y destinatario válido.
- **UPDATE**: solo `to_user_id = auth.uid()` para aceptar/rechazar (o ambos en flujos de cancelación si se permiten).

### `public.friendships`

Amistad confirmada (sin duplicar pares).

| Column | Type | Notes |
|--------|------|--------|
| user_a | uuid | `references auth.users(id)` |
| user_b | uuid | `references auth.users(id)` |
| created_at | timestamptz | |

**Constraints**: `user_a < user_b` (orden total UUID) + `primary key (user_a, user_b)`.

**RLS**: `SELECT` si `auth.uid()` es `user_a` o `user_b`; `INSERT` solo vía **RPC/trigger** tras aceptar solicitud (recomendado) o políticas muy restrictivas para evitar forja.

### `public.tournaments`

Estado del torneo para tiempo real.

| Column | Type | Notes |
|--------|------|--------|
| id | uuid PK | |
| name | text | |
| status | text | p. ej. `draft`, `active`, `completed` |
| state | jsonb | ronda, puntuaciones, payload acordado con la app actual |
| updated_at | timestamptz | para orden y “freshness” |

**RLS**: `SELECT` si existe fila en `tournament_participants` con `user_id = auth.uid()`; `UPDATE` solo roles con permiso (p. ej. `organizer` en `tournament_participants` o política dedicada).

### `public.tournament_participants`

| Column | Type | Notes |
|--------|------|--------|
| tournament_id | uuid | `references tournaments(id) on delete cascade` |
| user_id | uuid | `references auth.users(id)` |
| role | text | `player` \| `spectator` \| `organizer` |
| joined_at | timestamptz | |

**PK**: `(tournament_id, user_id)`.

**RLS**: `SELECT` propio o coparticipantes del mismo torneo según regla de producto (mínimo: ver otros participantes del mismo torneo si el spec exige “varios ven en vivo”).

### `public.tournament_events` (opcional)

Historial append-only para auditoría y pantalla “historial”.

| Column | Type | Notes |
|--------|------|--------|
| id | bigserial PK | |
| tournament_id | uuid | FK |
| user_id | uuid | nullable si evento global |
| type | text | |
| payload | jsonb | |
| created_at | timestamptz | |

**RLS**: `SELECT` si el usuario puede leer el torneo; `INSERT` según rol (jugador/organizador).

## Realtime

- Publicar en `supabase_realtime` las tablas necesarias (p. ej. `tournaments`, `tournament_events`).
- Suscribirse desde el cliente con filtro por `tournament_id` cuando Realtime lo permita para reducir ruido.

## State transitions

- **friend_requests**: `pending` → `accepted` | `rejected`; al `accepted`, crear fila en `friendships` (trigger o RPC `SECURITY DEFINER`).

## Validation rules (aplicación + DB)

- Email/password: validación Supabase Auth + políticas de contraseña en el proveedor.
- No lectura de perfiles/historial de terceros sin política explícita.
