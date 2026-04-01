# Supabase (MarioTracker)

## Migraciones

1. Crea un proyecto en [Supabase](https://supabase.com).
2. En **SQL Editor**, ejecuta el contenido de `migrations/20260401120000_init_social_tournament.sql` (o usa `supabase db push` si trabajas con CLI local enlazado).

## Realtime

La migración incluye:

```sql
alter publication supabase_realtime add table public.tournaments;
alter publication supabase_realtime add table public.tournament_events;
```

Si alguna tabla ya estaba en la publicación, el comando puede fallar; en ese caso omite la línea correspondiente o usa el dashboard: **Database → Publications → supabase_realtime**.

## Auth

Habilita **Email** en Authentication → Providers (y desactiva confirmación de email en desarrollo si quieres flujos rápidos).

## Variables en el cliente

Ver `contracts/supabase-client.env.md` en la spec de la feature y `.env.example` en la raíz del repo.
