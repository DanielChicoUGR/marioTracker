# Quickstart: desarrollo local

**Feature**: `001-social-realtime-tournament`  
**Stack**: Bun + Vite + React + Tailwind 4 + shadcn + Supabase

## Prerrequisitos

- [Bun](https://bun.sh) instalado
- Cuenta y proyecto en [Supabase](https://supabase.com) (o CLI + Docker para local)

## 1. Clonar y dependencias

```bash
cd /path/to/marioTracker
bun install
```

El `package.json` incluye `dev`, `build`, `preview`, `test` y `lint`.

## 2. Variables de entorno

Crear `.env.local` en la raíz del proyecto frontend (no commitear secretos):

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Ver [contracts/supabase-client.env.md](./contracts/supabase-client.env.md).

## 3. Supabase: esquema y RLS

- Aplicar migraciones desde `supabase/migrations/` cuando existan (`supabase db push` o SQL editor).
- Habilitar Realtime en las tablas necesarias (`tournaments`, etc.).
- Confirmar políticas RLS con [contracts/rls-expectations.md](./contracts/rls-expectations.md).

## 4. Ejecutar la app

```bash
bun run dev
```

Abrir la URL que indique Vite (típicamente `http://localhost:5173`).

## 5. Migración desde `index.html` actual

- Mantener comportamiento del tracker existente extrayendo vistas a componentes React por fases (auth → torneo en vivo → amistades → historial).
- Conservar assets en `public/` y tema (variables CSS) alineados con Tailwind/shadcn.

## 6. Tests

```bash
bun run test
```

*(Script a añadir con Vitest en la fase de implementación.)*
