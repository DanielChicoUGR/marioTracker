# Contrato: variables de entorno (cliente)

## Requeridas (prefijo `VITE_` para Vite)

| Variable | Uso |
|----------|-----|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase (`https://<ref>.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Clave **anon** pública (safe en bundle del cliente) |

## Prohibido en frontend

- `service_role` key o cualquier secreto con bypass de RLS.

## Cliente

- Un único `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)` exportado desde `src/lib/supabaseClient.ts` (ruta objetivo post-migración).
