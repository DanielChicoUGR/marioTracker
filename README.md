# Mario Tracker

SPA React + Vite + Bun, Tailwind CSS v4, Supabase (Auth, Postgres, Realtime), **PWA** (`vite-plugin-pwa`).

## Desarrollo

```bash
bun install
cp .env.example .env.local
# Rellena VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
bun run dev
```

En red local: `bun run dev --host` y abre la URL que muestre la consola (p. ej. `http://localhost:5173`).

Aplica la migración SQL en tu proyecto Supabase: `supabase/migrations/20260401120000_init_social_tournament.sql` (ver `supabase/README.md`).

## PWA (instalable)

- El build genera `manifest.webmanifest`, `sw.js` y Workbox en `dist/`. El registro del service worker está en [`src/main.tsx`](src/main.tsx) con `import "virtual:pwa-register"`.
- **Probar instalación**: `bun run build && bun run preview`, abre la URL de preview (p. ej. `http://localhost:4173`), DevTools → **Application** → Manifest / Service Workers. En Chrome puede aparecer “Instalar” en la barra de direcciones.
- **Desarrollo**: `devOptions.enabled: true` en [`vite.config.ts`](vite.config.ts) permite probar el SW en `vite` (modo desarrollo).
- **Datos en vivo**: las peticiones a `*.supabase.co` usan estrategia **NetworkOnly** en Workbox (no se cachean respuestas de API/Auth). Las fuentes de Google pueden cachearse de forma suave. Si algo falla con sesión o Realtime, comprueba la pestaña Network y que haya red.
- **Manifiesto**: la fuente de verdad es la opción `manifest` de `VitePWA` en `vite.config.ts` (no hay `manifest.webmanifest` en la raíz del repo).

## Scripts

| Comando          | Descripción        |
|------------------|--------------------|
| `bun run dev`    | Servidor Vite      |
| `bun run build`  | Build producción   |
| `bun run preview`| Servidor estático del `dist` (ideal para PWA) |
| `bun run test`   | Vitest             |
| `bun run lint`   | ESLint (`src/`)    |

## Legacy

El tracker HTML monolítico está en `legacy/index.html`; la copia servida es `public/legacy/index.html` (`/legacy/index.html`). **No** registra un service worker propio (la PWA la gestiona la SPA en la raíz). Ver [`legacy/README.md`](legacy/README.md).

## Especificación

Feature activa: `specs/001-social-realtime-tournament/`.
