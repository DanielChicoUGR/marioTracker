# Research: Social, historial y torneo en vivo

**Feature**: `001-social-realtime-tournament`  
**Date**: 2026-04-01

## 1. Frontend: React + Vite + Bun

**Decision**: SPA con **Vite** como herramienta de build y dev server; **Bun** como gestor de paquetes y ejecutor de scripts (`bun install`, `bun run dev`, `bun run build`). TypeScript en modo estricto.

**Rationale**: Vite ofrece HMR rápido y bundling moderno; Bun reduce latencia de instalación y ejecución en desarrollo. El equipo ya orientó el flujo de desarrollo hacia Bun.

**Alternatives considered**: npm/pnpm only (rechazado para dev por preferencia explícita de Bun); Next.js (no requerido: sin SSR obligatorio en spec).

## 2. Estilos: Tailwind CSS v4

**Decision**: **Tailwind v4** con configuración basada en CSS-first (`@import "tailwindcss"` en entrada CSS) según documentación actual del proyecto.

**Rationale**: v4 simplifica configuración y encaja con shadcn actualizado para v4.

**Alternatives considered**: Tailwind v3 (legacy; evitar si el proyecto arranca limpio); CSS Modules sin sistema de diseño (más trabajo para cumplir NFR de UX).

## 3. UI: shadcn/ui

**Decision**: **shadcn/ui** sobre React + Tailwind para formularios, diálogos, listas y estados vacíos; tema personalizado con variables CSS alineadas a la paleta MarioTracker (`--mario-red`, etc.).

**Rationale**: Componentes accesibles (Radix), consistencia con constitución III (UX), velocidad de implementación.

**Alternatives considered**: Material UI (más peso y estética menos alineada); componentes 100% custom (más coste).

## 4. Backend: Supabase (Postgres + Auth + Realtime)

**Decision**: **Supabase** como único backend: `auth.users` para identidad; tablas en `public` con **RLS habilitado** en todas las tablas de datos de usuario/torneo; cliente **@supabase/supabase-js** en el frontend con clave `anon` y sesión JWT.

**Rationale**: Cumple la spec y la decisión de producto (sin servidor propio); Auth + RLS centraliza el control de acceso (ver Context7: políticas con `auth.uid()` para aislar filas).

**Alternatives considered**: Firebase (menos natural si se desea SQL y RLS explícitas); API propia (fuera de alcance).

## 5. Row Level Security (RLS)

**Decision**: Cada tabla expuesta al cliente tiene `ENABLE ROW LEVEL SECURITY` y políticas explícitas para `SELECT`/`INSERT`/`UPDATE`/`DELETE` según rol `authenticated`. Ejemplos de patrón:

- Datos propios: `using ( (select auth.uid()) = user_id )` o participación en torneo mediante subconsulta a `tournament_participants`.
- Amistades: solo usuarios involucrados pueden ver/aceptar solicitudes.
- Torneos: lectura de estado de torneo si el usuario es participante o según regla de visibilidad definida en políticas.

**Rationale**: La seguridad no depende solo del cliente; alineado con documentación Supabase (políticas por operación).

**Alternatives considered**: Solo filtrado en cliente (inaceptable para datos sensibles).

## 6. Tiempo real: Supabase Realtime (Postgres Changes)

**Decision**: Habilitar **Realtime** para tablas relevantes (p. ej. `tournaments` y/o `tournament_events`) y suscribirse con `supabase.channel(...).on('postgres_changes', { event, schema, table, filter }, callback)` para reducir tráfico.

**Rationale**: Cumple FR-006 y SC-002 con latencia de red + propagación WebSocket; documentación oficial recomienda filtrar por tabla/evento.

**Alternatives considered**: Polling periódico (peor latencia y carga); Broadcast sin persistencia (no sustituye historial consistente).

## 7. Testing y calidad

**Decision**: **Vitest** + **RTL** para componentes y hooks; tests de integración que mockean Supabase o usan proyecto de test; validación manual de RLS con usuarios de prueba en Supabase.

**Rationale**: Constitución II; pruebas deterministas sin red en CI salvo job opcional E2E.

## Referencias (documentación)

- Supabase: políticas RLS con `auth.uid()` y `ENABLE ROW LEVEL SECURITY` (docs oficiales / blog).
- Supabase Realtime: `postgres_changes` con `schema: 'public'`, eventos `INSERT`/`UPDATE`/`*` (guía Postgres Changes).
