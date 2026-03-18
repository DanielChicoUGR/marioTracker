# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

**Silent error handling across core CLI modules:**
- Issue: Empty catch blocks (`catch {}`) suppress failures and continue execution without diagnostics.
- Files: `.github/get-shit-done/bin/lib/verify.cjs`, `.github/get-shit-done/bin/lib/init.cjs`, `.github/get-shit-done/bin/lib/state.cjs`, `.github/get-shit-done/bin/lib/phase.cjs`, `.github/get-shit-done/bin/lib/commands.cjs`, `.github/get-shit-done/bin/lib/core.cjs`, `.github/get-shit-done/bin/lib/milestone.cjs`, `.github/get-shit-done/bin/lib/roadmap.cjs`, `.github/get-shit-done/bin/lib/config.cjs`
- Impact: Failures become invisible, making root-cause analysis slow and allowing partial state updates.
- Fix approach: Replace empty catches with structured error return objects or warnings; include operation context (path, phase, command) in all catches.

**Duplicate helper definitions in state engine:**
- Issue: `stateExtractField` is defined twice with overlapping behavior.
- Files: `.github/get-shit-done/bin/lib/state.cjs`
- Impact: Divergence risk during future edits and increased maintenance complexity.
- Fix approach: Keep a single canonical implementation and enforce reuse from one helper section.

**High-complexity monolithic modules:**
- Issue: Core modules are very large and mix parsing, I/O, and business rules in single files.
- Files: `.github/get-shit-done/bin/lib/profile-output.cjs`, `.github/get-shit-done/bin/lib/phase.cjs`, `.github/get-shit-done/bin/lib/verify.cjs`, `.github/get-shit-done/bin/lib/state.cjs`, `.github/get-shit-done/bin/lib/init.cjs`, `.github/get-shit-done/bin/lib/commands.cjs`, `.github/get-shit-done/bin/gsd-tools.cjs`
- Impact: High regression probability when modifying unrelated behavior; difficult targeted testing.
- Fix approach: Split by command domain (parsing, FS mutation, rendering, validation) and isolate pure functions from side-effecting code.

## Known Bugs

**Todo directory naming mismatch (`done` vs `completed`):**
- Symptoms: Workflows direct moves/commits to `.planning/todos/done/`, while CLI init/todo completion use `.planning/todos/completed`.
- Files: `.github/get-shit-done/workflows/add-todo.md`, `.github/get-shit-done/workflows/check-todos.md`, `.github/get-shit-done/workflows/note.md`, `.github/get-shit-done/bin/lib/init.cjs`, `.github/get-shit-done/bin/lib/commands.cjs`
- Trigger: Running workflow steps that move todos and then reading status via CLI init commands.
- Workaround: Standardize manually to one directory name in both docs and code before running todo flows.

**Uncaught JSON parse crash for template fields:**
- Symptoms: Invalid `--fields` JSON can terminate `gsd-tools` abruptly.
- Files: `.github/get-shit-done/bin/gsd-tools.cjs`
- Trigger: `template fill ... --fields` with malformed JSON.
- Workaround: Validate JSON externally before invocation; quote carefully in shell.

**Git commit failures are misclassified as `nothing_to_commit`:**
- Symptoms: Non-empty git errors can be reported with reason `nothing_to_commit`.
- Files: `.github/get-shit-done/bin/lib/commands.cjs`
- Trigger: Any commit error path other than explicit "nothing to commit".
- Workaround: Inspect returned `error` field and git stderr manually; do not rely on `reason` alone.

## Security Considerations

**Path traversal risk in todo completion command:**
- Risk: `filename` is joined into a path without basename validation, enabling `../` traversal patterns.
- Files: `.github/get-shit-done/bin/lib/commands.cjs`
- Current mitigation: Existence check only; no canonical-path boundary enforcement.
- Recommendations: Reject path separators in `filename`, require basename equality (`path.basename(filename) === filename`), and verify resolved path stays under pending directory.

**Third-party script caching in service worker without integrity pinning:**
- Risk: External runtime assets are fetched and cached from remote origins (including an external JS library), increasing supply-chain exposure.
- Files: `sw.js`
- Current mitigation: None detected beyond origin URL usage.
- Recommendations: Self-host pinned versions of external scripts or use build-time vendoring with fixed hashes and controlled update policy.

## Performance Bottlenecks

**Unbounded runtime cache growth in service worker:**
- Problem: `cacheFirst` stores any cacheable GET response without TTL/LRU or cache-size limits.
- Files: `sw.js`
- Cause: Global runtime cache writes are unconditional for cacheable responses.
- Improvement path: Add route-aware caching policy, max-entries pruning, and expiration metadata.

**Heavy full-tree scans in initialization and verification paths:**
- Problem: Repeated directory scans and file reads are performed synchronously across `.planning/phases`.
- Files: `.github/get-shit-done/bin/lib/init.cjs`, `.github/get-shit-done/bin/lib/verify.cjs`, `.github/get-shit-done/bin/lib/state.cjs`, `.github/get-shit-done/bin/lib/commands.cjs`
- Cause: `readdirSync` + `readFileSync` loops in command execution paths.
- Improvement path: Cache computed phase indexes per invocation and reuse parsed metadata rather than re-reading files per check.

## Fragile Areas

**Phase removal and renumbering workflow:**
- Files: `.github/get-shit-done/bin/lib/phase.cjs`
- Why fragile: The command performs destructive delete plus multi-step directory/file renames and roadmap rewrites without transaction/rollback.
- Safe modification: Add preflight dry-run, snapshot backup, and rollback on first failed FS mutation.
- Test coverage: No automated tests detected for renumbering edge cases (decimal + lettered phases).

**State mutation engine based on regex replacements:**
- Files: `.github/get-shit-done/bin/lib/state.cjs`
- Why fragile: State updates depend on markdown text patterns and formatting assumptions.
- Safe modification: Migrate critical state fields to structured frontmatter/JSON source-of-truth, then render markdown from structured data.
- Test coverage: Not detected.

## Scaling Limits

**Synchronous CLI architecture for planning datasets:**
- Current capacity: Suitable for small-to-medium `.planning` trees.
- Limit: Latency and error opacity increase as phase count and artifact volume grow.
- Scaling path: Introduce indexed metadata files, incremental scans, and structured error telemetry.

## Dependencies at Risk

**Remote CDN resources used by offline shell:**
- Risk: Availability and content stability are controlled by external providers.
- Impact: Offline experience and rendering features can degrade unexpectedly.
- Migration plan: Vendor third-party assets into repository build artifacts and serve locally through app shell.

## Missing Critical Features

**No automated regression test suite for CLI behavior:**
- Problem: Critical commands mutate roadmap/state/todo files without test harness protection.
- Blocks: Safe refactors for phase renumbering, state patching, and verification logic.

## Test Coverage Gaps

**CLI command surface is effectively untested:**
- What's not tested: `phase remove/insert/complete`, `state patch/update-progress`, `verify *`, and todo lifecycle commands.
- Files: `.github/get-shit-done/bin/gsd-tools.cjs`, `.github/get-shit-done/bin/lib/phase.cjs`, `.github/get-shit-done/bin/lib/state.cjs`, `.github/get-shit-done/bin/lib/verify.cjs`, `.github/get-shit-done/bin/lib/commands.cjs`, `.github/get-shit-done/bin/lib/init.cjs`
- Risk: Silent regressions in planning state and filesystem mutations.
- Priority: High

---

*Concerns audit: 2026-03-18*
