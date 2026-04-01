# Implementation Plan: Social, historial y torneo en vivo

**Branch**: `001-social-realtime-tournament` | **Date**: 2026-04-01 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-social-realtime-tournament/spec.md`  
**Stack input (usuario)**: React + Vite; desarrollo con **Bun** como runtime/package manager; **Tailwind CSS v4**; **shadcn/ui**; backend **Supabase** (Postgres + Auth + Realtime) con **RLS** explícitas.

**Note**: Este plan amplía la spec con decisiones técnicas documentadas en `research.md`.

## Summary

Migrar la aplicación web actual (HTML monolítico en `index.html`) a una SPA **React** servida por **Vite**, con UI basada en **Tailwind 4** y componentes **shadcn/ui**, desarrollada con **Bun**. La capa de datos y tiempo real es **Supabase**: autenticación, tablas en Postgres con **Row Level Security** obligatoria, y **Realtime** (Postgres Changes) para propagar el estado del torneo a participantes autorizados. Se implementan flujos de registro/sesión, amistades, historial de participación y vista de torneo sincronizada, alineados con `spec.md`.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19.x (o 18.x LTS según plantilla Vite), Node-compatible types.  
**Primary Dependencies**: Vite 6.x+, React, `@supabase/supabase-js`, Tailwind CSS v4, shadcn/ui (Radix UI + class-variance-authority), React Router (o enrutado equivalente).  
**Storage**: Supabase Postgres (proyecto hosteado); sin servidor de aplicación propio.  
**Testing**: Vitest + React Testing Library (unit/integration UI); pruebas de contrato contra esquema SQL/RLS documentado en `contracts/`; E2E opcional (Playwright) para flujos críticos.  
**Target Platform**: Navegadores modernos (ES2022+), PWA mantenible tras migración.  
**Project Type**: Web SPA (frontend) + BaaS (Supabase).  
**Performance Goals**: Actualizaciones de torneo percibidas &lt; 5 s p95 en red estable (spec); bundles con code-splitting por rutas; suscripciones Realtime acotadas a tablas/canales necesarios.  
**Constraints**: Toda lectura/escritura de datos personales y torneo a través de políticas RLS; claves `anon`/`service_role` sin exponer `service_role` en cliente; cumplimiento constitución (lint, tipos, UX coherente con shadcn/tokens).  
**Scale/Scope**: Equipos de torneo y listas de amigos acotados al uso típico de club; dimensionamiento de plan Supabase según despliegue (hobby/pro) sin cifras mínimas obligatorias en v1 salvo requisito explícito futuro.

## Constitution Check

*GATE: Cumplido antes de investigación; revalidado tras diseño.*

Alignment with `.specify/memory/constitution.md` (MarioTracker):

- **Code quality**: TypeScript estricto, estructura por features (`src/features/...`), componentes shadcn reutilizables; migración desde `index.html` por fases documentadas en `quickstart.md`.
- **Testing**: Vitest para lógica y componentes; validación de políticas RLS reproducible (SQL tests o `supabase db test` si se adopta); regresión en flujos auth y amistad.
- **UX**: shadcn + tokens Tailwind alineados con tema MarioTracker (colores existentes migrados a CSS variables); estados de carga/error unificados.
- **Performance**: Presupuesto de latencia Realtime y tamaño de bundle en `research.md`; suscripciones mínimas necesarias (filtro por `tournament_id`).

**Post-design**: Sin violaciones que requieran tabla de complejidad; RLS + cliente Supabase es el patrón mínimo seguro para este alcance.

## Project Structure

### Documentation (this feature)

```text
specs/001-social-realtime-tournament/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md          # /speckit.tasks (no generado por este comando)
```

### Source Code (repository root)

Propuesta tras migración (el repo hoy tiene `index.html` en raíz; se introduce `src/` y `vite.config`):

```text
src/
├── main.tsx
├── App.tsx
├── lib/
│   └── supabaseClient.ts
├── features/
│   ├── auth/
│   ├── friends/
│   ├── tournament/
│   └── history/
├── components/
│   └── ui/             # shadcn
└── index.css           # Tailwind v4 entry

supabase/
├── migrations/         # SQL versionado (RLS, tablas)
└── config.toml         # si se usa CLI local

public/                 # assets estáticos, manifest PWA
index.html              # entrada Vite (mover/reemplazar el HTML monolítico progresivamente)

tests/
├── unit/
├── integration/
└── contract/           # validación RLS / snapshots SQL opcional
```

**Structure Decision**: SPA única en `src/` con features por dominio; Supabase como única API de datos; migraciones SQL en `supabase/migrations` para reproducibilidad y revisión de RLS.

## Complexity Tracking

> Sin violaciones de constitución que requieran justificación formal; tabla omitida.

## Phase 0 & Phase 1 outputs

- **Phase 0**: `research.md` — decisiones de stack (Bun+Vite+React, Tailwind 4, shadcn, Supabase RLS/Realtime).
- **Phase 1**: `data-model.md`, `contracts/`, `quickstart.md` — listo para `/speckit.tasks`.
