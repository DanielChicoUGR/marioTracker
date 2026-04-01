# Contracts: cliente ↔ Supabase

Este directorio define contratos verificables entre la SPA React y el proyecto Supabase (sin servidor de aplicación intermedio).

| Archivo | Propósito |
|---------|-----------|
| [supabase-client.env.md](./supabase-client.env.md) | Variables de entorno y uso de claves |
| [realtime-subscriptions.md](./realtime-subscriptions.md) | Canales, tablas y eventos esperados |
| [rls-expectations.md](./rls-expectations.md) | Comportamiento obligatorio de RLS por rol |

Los cambios que rompan estos contratos deben actualizar pruebas y migraciones SQL en conjunto.
