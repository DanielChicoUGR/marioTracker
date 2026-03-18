# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Hybrid architecture with two coexisting systems: a single-file browser PWA and a modular Node.js CLI orchestration engine.

**Key Characteristics:**

- Keep browser runtime logic centralized in `index.html` for tournament UX + domain rules, with offline support delegated to `sw.js`.
- Route all GSD automation through a command-dispatch CLI (`.github/get-shit-done/bin/gsd-tools.cjs`) backed by focused modules in `.github/get-shit-done/bin/lib/*.cjs`.
- Persist project workflow state as markdown/json artifacts under `.planning/`, making docs part of executable workflow state.

## Layers

**Presentation + Interaction Layer (PWA):**

- Purpose: Render UI, handle user actions, and update tournament state.
- Location: `index.html`
- Contains: HTML structure, CSS styling, inline JavaScript render functions (`render`, `getSetupHTML`, `getTournamentHTML`), event-triggered actions (`addPlayer`, `saveScore`, `confirmReset`).
- Depends on: Browser DOM APIs, `localStorage`, `navigator.serviceWorker`, external `html2canvas` CDN.
- Used by: End users in browser.

**Domain Logic Layer (Tournament Engine):**

- Purpose: Encapsulate tournament operations (bracket generation, league generation, ranking, match progression).
- Location: `index.html`
- Contains: `startTournament`, `generateBracket`, `generateLeague`, `updateBracketProgress`, `renderLeagueView`, `getMatchById`.
- Depends on: In-memory global `state` object and static `ROSTER` abstraction.
- Used by: Presentation handlers in `index.html`.

**Offline + Persistence Layer (Client Runtime):**

- Purpose: Persist app data and provide offline-first behavior.
- Location: `index.html`, `sw.js`, `manifest.webmanifest`
- Contains: `saveState`/`loadState` via `localStorage`, service worker install/activate/fetch strategies (`cacheFirst`, `networkFirst`), PWA metadata.
- Depends on: Cache Storage API, Service Worker lifecycle events, manifest declarations.
- Used by: Browser runtime and presentation/domain layers.

**CLI Routing Layer (GSD Entry):**

- Purpose: Parse CLI args and dispatch to domain-specific command modules.
- Location: `.github/get-shit-done/bin/gsd-tools.cjs`
- Contains: `main()` router with command groups (`state`, `phase`, `roadmap`, `init`, `verify`, `template`, `frontmatter`, etc.).
- Depends on: Node.js runtime and library modules in `.github/get-shit-done/bin/lib/`.
- Used by: GSD workflows, skills, and command invocations.

**CLI Domain Services Layer (GSD Core Modules):**

- Purpose: Implement reusable planning operations and document transformations.
- Location: `.github/get-shit-done/bin/lib/`
- Contains:
  - Core utilities: `.github/get-shit-done/bin/lib/core.cjs`
  - Planning state mutation: `.github/get-shit-done/bin/lib/state.cjs`
  - Phase lifecycle: `.github/get-shit-done/bin/lib/phase.cjs`
  - Roadmap parsing/update: `.github/get-shit-done/bin/lib/roadmap.cjs`
  - Init/context hydration: `.github/get-shit-done/bin/lib/init.cjs`
  - Frontmatter parser/serializer: `.github/get-shit-done/bin/lib/frontmatter.cjs`
  - Template scaffolding: `.github/get-shit-done/bin/lib/template.cjs`
  - Standalone ops (commit/progress/stats): `.github/get-shit-done/bin/lib/commands.cjs`
- Depends on: Filesystem under `.planning/`, git CLI, internal helper contracts.
- Used by: CLI routing layer.

**Prompt + Workflow Definition Layer (Declarative Ops):**

- Purpose: Define behavior contracts for agents, skills, and workflow execution.
- Location: `.github/agents/`, `.github/skills/`, `.github/get-shit-done/workflows/`, `.github/get-shit-done/templates/`
- Contains: Agent mode files, command skills, workflow markdown, output templates.
- Depends on: GSD CLI and Copilot instruction loading.
- Used by: Subagents and orchestrator flows.

## Data Flow

**Tournament Runtime Flow (browser):**

1. `window.onload` in `index.html` invokes `loadState()`, `render()`, `setupPwaUi()`, and `registerServiceWorker()`.
2. User actions (buttons/modals/forms in `index.html`) call action functions (`addPlayer`, `startTournament`, `saveScore`).
3. Action functions mutate global `state`, persist via `saveState()`, then re-render via `render()`.
4. For bracket tournaments, score updates trigger `updateBracketProgress()` to propagate winners into later rounds.
5. Export flow calls `html2canvas(...)` and emits a PNG download in `exportToImage()`.

**Offline Request Flow (service worker):**

1. Install event in `sw.js` preloads app shell (`APP_SHELL`) and external resources (`EXTERNAL_RESOURCES`).
2. Activate event enables navigation preload and clears stale caches.
3. Fetch event routes navigation requests through `networkFirst(...)` and static/runtime assets through `cacheFirst(...)`.
4. On network failure, fallback resolves to cache or returns explicit `503 Offline` response.

**GSD Command Execution Flow (CLI):**

1. CLI invocation enters `main()` in `.github/get-shit-done/bin/gsd-tools.cjs`.
2. Router resolves command/subcommand and delegates to `cmd*` handlers in `.github/get-shit-done/bin/lib/*.cjs`.
3. Handler modules read/transform `.planning` artifacts (`STATE.md`, `ROADMAP.md`, phase docs) and filesystem metadata.
4. Shared utilities in `.github/get-shit-done/bin/lib/core.cjs` normalize paths, parse phase IDs, resolve model profiles, and format output.
5. Result exits through structured JSON or raw channel via `output()`; failures exit via `error()`.

## Key Abstractions

**Tournament State Aggregate:**

- Purpose: Single source of truth for UI and tournament progression.
- Examples: `state` object in `index.html` (`status`, `type`, `format`, `players`, `teams`, `matches`, `bracket`).
- Pattern: Mutable global state with explicit save+render cycle.

**Roster Catalog:**

- Purpose: Domain catalog of playable characters and stats.
- Examples: `ROSTER` constant in `index.html`.
- Pattern: Static in-memory dataset with ID-based lookup through `getChar`.

**Phase Identity + Navigation:**

- Purpose: Resolve, compare, and locate planning phases robustly.
- Examples: `normalizePhaseName`, `comparePhaseNum`, `findPhaseInternal` in `.github/get-shit-done/bin/lib/core.cjs`.
- Pattern: Canonical identifier normalization + directory discovery across active and archived milestones.

**Frontmatter Document Model:**

- Purpose: Parse and reconstruct YAML-like metadata in planning markdown files.
- Examples: `extractFrontmatter`, `reconstructFrontmatter`, `spliceFrontmatter` in `.github/get-shit-done/bin/lib/frontmatter.cjs`.
- Pattern: Lightweight parser/serializer tailored to GSD document schemas.

**Command Handler Contract:**

- Purpose: Expose composable operations through `cmd*` functions.
- Examples: exports in `.github/get-shit-done/bin/lib/commands.cjs`, `.github/get-shit-done/bin/lib/state.cjs`, `.github/get-shit-done/bin/lib/phase.cjs`, `.github/get-shit-done/bin/lib/init.cjs`.
- Pattern: Side-effecting file ops wrapped in deterministic command signatures.

## Entry Points

**Browser App Bootstrap:**

- Location: `index.html`
- Triggers: Browser load lifecycle (`window.onload`).
- Responsibilities: Hydrate local state, render UI, initialize connectivity/install UX, register service worker.

**Service Worker Lifecycle:**

- Location: `sw.js`
- Triggers: `install`, `activate`, `fetch` events.
- Responsibilities: Precache shell, manage cache versions, route offline/online fetch behavior.

**CLI Router:**

- Location: `.github/get-shit-done/bin/gsd-tools.cjs`
- Triggers: `node gsd-tools.cjs <command> ...` execution.
- Responsibilities: Parse args/options (`--cwd`, `--raw`), dispatch subcommands, terminate with structured outputs.

**Workflow Declarations:**

- Location: `.github/get-shit-done/workflows/*.md`
- Triggers: GSD command routing in agent environment.
- Responsibilities: Orchestrate which subagent/focus runs and what artifacts are expected.

## Error Handling

**Strategy:** Defensive fail-soft in browser; fail-fast with explicit process exit in CLI.

**Patterns:**

- Browser runtime: `try/catch` around unsafe operations (`loadState`, service worker registration) and user-facing fallback toasts/alerts in `index.html`.
- Offline network fallback: `networkFirst` catches failures and returns cache or synthetic `503` response in `sw.js`.
- CLI runtime: centralized `error()` in `.github/get-shit-done/bin/lib/core.cjs` writes stderr and exits with non-zero status.
- CLI write safety: commands guard file existence and return structured skip/error states (`nothing_to_commit`, `not found`, etc.).

## Cross-Cutting Concerns

**Logging:** Browser uses `console.error` minimally in `index.html`; CLI emits structured JSON via `output()` and stderr via `error()` from `.github/get-shit-done/bin/lib/core.cjs`.
**Validation:** CLI validates command arguments and config keys in `.github/get-shit-done/bin/gsd-tools.cjs` and `.github/get-shit-done/bin/lib/config.cjs`; domain validation for tournament constraints is in `startTournament` and `saveScore` in `index.html`.
**Authentication:** Not detected for app or CLI operations.

---

_Architecture analysis: 2026-03-18_
