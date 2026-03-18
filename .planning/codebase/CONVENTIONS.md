# Coding Conventions

**Analysis Date:** 2026-03-18

## Naming Patterns

**Files:**

- Flat, root-level web app files with lowercase names and web-standard suffixes: `index.html`, `sw.js`, `manifest.webmanifest`.
- Asset files use kebab-case with numeric size tokens: `icons/icon-192.svg`, `icons/icon-512.svg`.

**Functions:**

- Use camelCase for function names in JavaScript logic inside `index.html` and `sw.js` (examples: `addPlayer`, `startTournament`, `updateBracketProgress`, `registerServiceWorker`, `cacheFirst`, `networkFirst`).
- Utility-style functions are declared as `const fn = (...) => {}` in `sw.js` and a mix of `function fn() {}` plus async function declarations in `index.html`.

**Variables:**

- Global constants use UPPER_SNAKE_CASE for static data and cache names (`ROSTER`, `STATIC_CACHE`, `RUNTIME_CACHE`, `APP_SHELL`, `EXTERNAL_RESOURCES`).
- Mutable app state uses lowerCamelCase (`state`, `currentMatchEditId`, `deferredInstallPrompt`).

**Types:**

- Not applicable. No TypeScript types/interfaces are present.

## Code Style

**Formatting:**

- Tool used: Not detected (no Prettier/Biome config files found).
- Key settings: Not explicitly configured. Formatting appears manually consistent with 2-space indentation, trailing commas in multiline structures, and semicolon usage in JavaScript blocks in `index.html` and `sw.js`.

**Linting:**

- Tool used: Not detected (no ESLint/Biome lint config found).
- Key rules: Not explicitly enforced by repository config.

## Import Organization

**Order:**

1. Not applicable (no ESM/CommonJS import blocks in application source).
2. External browser resources are loaded through `<script src="...">` and `<link href="...">` in `index.html`.
3. Service worker uses browser globals directly without imports in `sw.js`.

**Path Aliases:**

- Not detected.

## Error Handling

**Patterns:**

- Prefer fail-safe `try/catch` around browser APIs and network-sensitive flows.
- Silent recovery is used for non-critical failures in offline preloading (`sw.js` install event catches fetch failures and continues).
- User-facing validation errors are surfaced with UI feedback (`showToast`) and native dialogs (`alert`, `confirm`) in `index.html`.
- Registration and async setup errors are logged with `console.error` (`registerServiceWorker` in `index.html`).

## Logging

**Framework:** console

**Patterns:**

- Logging is minimal and mostly reserved for recoverable operational failures (`console.error("No se pudo registrar el service worker", error)` in `index.html`).
- No centralized logger abstraction detected.

## Comments

**When to Comment:**

- Comments are used sparsely to label high-level sections and non-obvious behavior (examples in `index.html`: "BASE DE DATOS DE PERSONAJES", "LÓGICA DE NEGOCIO", "INICIALIZACIÓN"; in `sw.js`: external preloading failure rationale).

**JSDoc/TSDoc:**

- Not used.

## Function Design

**Size:**

- Small and medium utility functions dominate (`getChar`, `saveState`, `closeModal`).
- Some larger orchestration/UI functions are present in `index.html` (`getSetupHTML`, `renderLeagueView`) with embedded HTML template generation.

**Parameters:**

- Simple positional parameters and IDs are common (`removePlayer(id)`, `openScoreModal(matchId)`).
- For DOM-driven handlers, functions pull values directly from document selectors instead of passing structured DTOs.

**Return Values:**

- Utility functions return primitives/objects/HTML strings.
- UI action handlers mostly mutate global `state`, persist (`saveState`), and trigger `render()`.

## Module Design

**Exports:**

- Not applicable. Application logic is embedded in a single `<script>` in `index.html` and global service worker scope in `sw.js`.

**Barrel Files:**

- Not applicable.

---

_Convention analysis: 2026-03-18_
