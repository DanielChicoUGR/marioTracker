# Contrato: suscripciones Realtime

## Objetivo

Cumplir FR-006 / SC-002: los participantes autorizados reciben cambios del torneo sin depender solo de recarga manual.

## Patrón mínimo (Postgres Changes)

- **Tabla principal de estado**: `public.tournaments` (eventos `UPDATE` como mínimo; `INSERT` si se crean torneos en vivo).
- **Tabla opcional de eventos**: `public.tournament_events` (eventos `INSERT` para historial en tiempo real).

## Canal (convención)

- Nombre por instancia: `tournament:{tournament_id}` (string; no usar el literal reservado `realtime` como nombre único si la doc lo restringe).

## Filtros

- Preferir filtro por `tournament_id` en la suscripción cuando la API de Realtime lo permita para la tabla objetivo, para limitar payloads.

## Payload

El callback recibe el payload estándar de `postgres_changes` (`new`/`old` records según evento). La UI debe fusionar el estado con el store local o invalidar query.

## Referencia (implementación)

Ver guía oficial Postgres Changes en documentación Supabase (`postgres_changes`, `schema: 'public'`, `event: '*'` o `UPDATE`).
