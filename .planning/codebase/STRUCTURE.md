# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
[project-root]/
├── index.html                      # Main PWA UI, styles, and tournament runtime logic
├── sw.js                           # Service worker caching and offline fetch strategy
├── manifest.webmanifest            # PWA metadata (name, icons, display, scope)
├── icons/                          # App icon assets used by manifest and favicon links
├── .github/                        # GSD automation system (agents, skills, workflows, CLI)
│   ├── agents/                     # Custom subagent definitions (*.agent.md)
│   ├── skills/                     # GSD command skills (gsd-*/SKILL.md)
│   ├── get-shit-done/              # Core GSD framework assets and Node CLI implementation
│   │   ├── bin/                    # Executable CLI entry and module library
│   │   │   ├── gsd-tools.cjs       # Main CLI router
│   │   │   └── lib/                # Command/domain modules (*.cjs)
│   │   ├── workflows/              # Declarative workflow playbooks (*.md)
│   │   ├── templates/              # Planning and output templates (*.md, *.json)
│   │   └── references/             # Reference docs consumed by workflows
│   └── copilot-instructions.md     # Repository-level Copilot behavior rules
└── .planning/
    └── codebase/                   # Generated codebase map documents (STACK/ARCH/etc.)
```

## Directory Purposes

**Root (`/`):**

- Purpose: Runtime PWA assets served as static site.
- Contains: `index.html`, `sw.js`, `manifest.webmanifest`, `icons/`.
- Key files: `index.html`, `sw.js`, `manifest.webmanifest`.

**`icons/`:**

- Purpose: Visual identity resources for installable app icons.
- Contains: SVG icon variants.
- Key files: `icons/icon-192.svg`, `icons/icon-512.svg`.

**`.github/agents/`:**

- Purpose: Agent mode definitions and execution contracts.
- Contains: `*.agent.md` descriptors (for mapper, planner, executor, verifier, UI auditor, etc.).
- Key files: `.github/agents/gsd-codebase-mapper.agent.md`, `.github/agents/gsd-executor.agent.md`.

**`.github/skills/`:**

- Purpose: Command-specific skills that define workflows and expected outputs.
- Contains: One directory per command (`gsd-...`) with `SKILL.md`.
- Key files: `.github/skills/gsd-map-codebase/SKILL.md`, `.github/skills/gsd-plan-phase/SKILL.md`.

**`.github/get-shit-done/bin/`:**

- Purpose: Executable automation runtime.
- Contains: CLI entrypoint plus modular library.
- Key files: `.github/get-shit-done/bin/gsd-tools.cjs`, `.github/get-shit-done/bin/lib/core.cjs`.

**`.github/get-shit-done/bin/lib/`:**

- Purpose: Reusable command handlers and planning domain services.
- Contains: Focused `.cjs` modules (state, phase, roadmap, verify, template, config, frontmatter, init).
- Key files: `.github/get-shit-done/bin/lib/state.cjs`, `.github/get-shit-done/bin/lib/phase.cjs`, `.github/get-shit-done/bin/lib/roadmap.cjs`, `.github/get-shit-done/bin/lib/init.cjs`, `.github/get-shit-done/bin/lib/commands.cjs`.

**`.github/get-shit-done/workflows/`:**

- Purpose: Orchestration definitions used by GSD command execution.
- Contains: Workflow markdown files for each command.
- Key files: `.github/get-shit-done/workflows/map-codebase.md`, `.github/get-shit-done/workflows/execute-phase.md`.

**`.github/get-shit-done/templates/`:**

- Purpose: Canonical markdown/json templates for planning artifacts.
- Contains: Milestone/phase/summary/verification templates and codebase doc templates.
- Key files: `.github/get-shit-done/templates/codebase/architecture.md`, `.github/get-shit-done/templates/roadmap.md`, `.github/get-shit-done/templates/summary.md`.

**`.planning/codebase/`:**

- Purpose: Generated architectural reference docs for future planning/execution commands.
- Contains: `STACK.md`, `INTEGRATIONS.md`, and mapped docs including this file.
- Key files: `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`.

## Key File Locations

**Entry Points:**

- `index.html`: Browser app bootstrap and full UI/domain runtime via `window.onload`.
- `sw.js`: Service worker lifecycle entry for offline/cache behavior.
- `.github/get-shit-done/bin/gsd-tools.cjs`: CLI command router entry point for all GSD operations.

**Configuration:**

- `manifest.webmanifest`: PWA runtime metadata.
- `.github/copilot-instructions.md`: Agent behavior constraints in this repository.
- `.github/get-shit-done/templates/config.json`: Baseline config template reference for `.planning/config.json` generation.

**Core Logic:**

- `index.html`: Tournament state transitions, bracket/league generation, render functions, persistence hooks.
- `.github/get-shit-done/bin/lib/core.cjs`: Shared utility layer (path, config, phase matching, output/error).
- `.github/get-shit-done/bin/lib/state.cjs`: STATE.md progression and mutation logic.
- `.github/get-shit-done/bin/lib/phase.cjs`: Phase CRUD and lifecycle operations.
- `.github/get-shit-done/bin/lib/roadmap.cjs`: ROADMAP parsing and status updates.

**Testing:**

- Not detected (no test directories, `*.test.*`, `*.spec.*`, or test runner configs found in repository root).

## Naming Conventions

**Files:**

- CLI modules use lowercase `.cjs` names by concern: `core.cjs`, `state.cjs`, `phase.cjs`, `verify.cjs`.
- Agent descriptors use `gsd-<role>.agent.md`: `.github/agents/gsd-codebase-mapper.agent.md`.
- Skill definitions use `gsd-<command>/SKILL.md`: `.github/skills/gsd-map-codebase/SKILL.md`.
- Workflow definitions use kebab-case command names: `.github/get-shit-done/workflows/map-codebase.md`.
- Planning/codebase docs use uppercase filenames: `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`.

**Directories:**

- Domain grouping by responsibility: `agents`, `skills`, `workflows`, `templates`, `references`, `bin/lib`.
- Skill folders mirror command namespace (`gsd-*`) under `.github/skills/`.

## Where to Add New Code

**New Feature (PWA behavior/UI):**

- Primary code: `index.html` (current architecture is single-file app).
- Offline behavior: `sw.js` when feature requires caching/fetch strategy changes.
- Tests: Not applicable in current structure; if introducing tests, create a dedicated test root (for example `.github/get-shit-done/bin/lib/__tests__/` for CLI modules).

**New Component/Module (GSD CLI):**

- Implementation: add module in `.github/get-shit-done/bin/lib/<feature>.cjs`.
- Router integration: register command/subcommand in `.github/get-shit-done/bin/gsd-tools.cjs`.
- Prompt/workflow contract: add/update matching markdown in `.github/get-shit-done/workflows/` and optional skill in `.github/skills/`.

**Utilities:**

- Shared helpers: extend `.github/get-shit-done/bin/lib/core.cjs`.
- Document metadata parsing: extend `.github/get-shit-done/bin/lib/frontmatter.cjs`.
- Template-backed generation: update `.github/get-shit-done/bin/lib/template.cjs` and source template files in `.github/get-shit-done/templates/`.

## Special Directories

**`.planning/`:**

- Purpose: Runtime planning state and generated docs used by GSD commands.
- Generated: Yes.
- Committed: Yes (by design, via commit operations in `.github/get-shit-done/bin/lib/commands.cjs`).

**`.planning/codebase/`:**

- Purpose: Persisted architecture/stack/convention/concern map consumed by planning and execution workflows.
- Generated: Yes.
- Committed: Yes.

**`.github/get-shit-done/templates/`:**

- Purpose: Source templates for generated planning artifacts.
- Generated: No.
- Committed: Yes.

---

_Structure analysis: 2026-03-18_
