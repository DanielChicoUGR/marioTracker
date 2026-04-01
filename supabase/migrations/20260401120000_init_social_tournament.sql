-- MarioTracker: perfiles, amistades, torneos, historial (RLS + Realtime)
-- Aplicar en proyecto Supabase (SQL editor o CLI).

-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tournaments (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  status text not null default 'draft',
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.tournament_participants (
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('organizer', 'player', 'spectator')),
  joined_at timestamptz not null default now(),
  primary key (tournament_id, user_id)
);

create index idx_tournament_participants_user on public.tournament_participants (user_id);

create table public.tournament_events (
  id bigserial primary key,
  tournament_id uuid not null references public.tournaments (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_tournament_events_tournament on public.tournament_events (tournament_id);

create table public.friend_requests (
  id uuid primary key default gen_random_uuid (),
  from_user_id uuid not null references auth.users (id) on delete cascade,
  to_user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  constraint friend_requests_distinct check (from_user_id <> to_user_id)
);

create unique index friend_requests_unique_pending on public.friend_requests (
  least(from_user_id, to_user_id),
  greatest(from_user_id, to_user_id)
) where (status = 'pending');

create table public.friendships (
  user_a uuid not null references auth.users (id) on delete cascade,
  user_b uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint friendships_ordered check (user_a < user_b),
  primary key (user_a, user_b)
);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger tournaments_set_updated_at
before update on public.tournaments
for each row execute function public.set_updated_at();

create or replace function public.trg_friend_request_friends()
returns trigger as $$
declare
  ua uuid;
  ub uuid;
begin
  if tg_op = 'UPDATE' and new.status = 'accepted' and old.status = 'pending' then
    if new.to_user_id <> auth.uid() then
      raise exception 'forbidden';
    end if;
    ua := least(new.from_user_id, new.to_user_id);
    ub := greatest(new.from_user_id, new.to_user_id);
    insert into public.friendships (user_a, user_b)
    values (ua, ub)
    on conflict do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger friend_requests_to_friendships
after update on public.friend_requests
for each row execute function public.trg_friend_request_friends();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_participants enable row level security;
alter table public.tournament_events enable row level security;
alter table public.friend_requests enable row level security;
alter table public.friendships enable row level security;

-- profiles
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- tournaments: visible si participas, o si está activo (unirse por enlace)
create policy "tournaments_select_active_or_participant"
on public.tournaments for select
to authenticated
using (
  status = 'active'
  or exists (
    select 1 from public.tournament_participants tp
    where tp.tournament_id = tournaments.id
      and tp.user_id = (select auth.uid())
  )
);

create policy "tournaments_insert_authenticated"
on public.tournaments for insert
to authenticated
with check (true);

create policy "tournaments_update_organizer"
on public.tournaments for update
to authenticated
using (
  exists (
    select 1 from public.tournament_participants tp
    where tp.tournament_id = tournaments.id
      and tp.user_id = (select auth.uid())
      and tp.role = 'organizer'
  )
)
with check (
  exists (
    select 1 from public.tournament_participants tp
    where tp.tournament_id = tournaments.id
      and tp.user_id = (select auth.uid())
      and tp.role = 'organizer'
  )
);

-- tournament_participants
create policy "tp_select_coparticipants"
on public.tournament_participants for select
to authenticated
using (
  exists (
    select 1 from public.tournament_participants me
    where me.tournament_id = tournament_participants.tournament_id
      and me.user_id = (select auth.uid())
  )
);

create policy "tp_insert_self"
on public.tournament_participants for insert
to authenticated
with check (user_id = (select auth.uid()));

-- tournament_events
create policy "te_select_if_tournament_visible"
on public.tournament_events for select
to authenticated
using (
  exists (
    select 1 from public.tournament_participants tp
    where tp.tournament_id = tournament_events.tournament_id
      and tp.user_id = (select auth.uid())
  )
);

create policy "te_insert_if_participant"
on public.tournament_events for insert
to authenticated
with check (
  exists (
    select 1 from public.tournament_participants tp
    where tp.tournament_id = tournament_events.tournament_id
      and tp.user_id = (select auth.uid())
  )
);

-- friend_requests
create policy "fr_select_involved"
on public.friend_requests for select
to authenticated
using (
  from_user_id = (select auth.uid())
  or to_user_id = (select auth.uid())
);

create policy "fr_insert_from_self"
on public.friend_requests for insert
to authenticated
with check (from_user_id = (select auth.uid()));

create policy "fr_update_recipient"
on public.friend_requests for update
to authenticated
using (to_user_id = (select auth.uid()))
with check (to_user_id = (select auth.uid()));

-- friendships
create policy "friendships_select_member"
on public.friendships for select
to authenticated
using (
  user_a = (select auth.uid())
  or user_b = (select auth.uid())
);

-- ---------------------------------------------------------------------------
-- Realtime: añadir tablas a la publicación (idempotente en proyectos nuevos)
-- ---------------------------------------------------------------------------

alter publication supabase_realtime add table public.tournaments;
alter publication supabase_realtime add table public.tournament_events;
