# OpenCode V2 conversion checkpoints

Checkpoints record verified progress and the next useful place to resume. Milestone acceptance criteria in [`milestones.md`](milestones.md) remain the completion authority; do not mark a checkpoint complete from intention alone.

**Snapshot:** 2026-10-28. M0 is committed. M1 implementation and checks are verified; its adversary review/commit closeout is pending. M2–M9 have not started. V2 validation targets OpenCode 2.1.4 and `@opencode/plugin` 2.1.4.

## M0 — Confirm the V2 compatibility contract

**Decisions**
- Support is V2-only: minimum OpenCode 2.1.4 and `@opencode/plugin` 2.1.4. V1 compatibility is outside this conversion.
- Preserve plugin ID `opencode-ralph-loop`, existing tool/command IDs, project-local state path/format, 100-iteration default, and `<promise>DONE</promise>`. Bind new loops to their initiating session; legacy state without `sessionId` can bind to the first idle session in the same project.
- Register commands via `ctx.command.transform` and packaged skills via `ctx.skill.transform`; check `ctx.command.list()` / `ctx.skill.list()` and skip existing IDs. Do not copy skills globally.
- Keep state and API failures explicit per `docs/errors.md`; do not change package identity or release targets.

**Issues**
- V1 and V2 differ in plugin, tool, event, command, and session APIs; this port intentionally targets V2 only.

**Thoughts**
- V2 migration and plugin APIs were checked against official docs on 2026-10-28; the installed OpenCode runtime and matching SDK are both 2.1.4.

**Current state**
- Compatibility contract is settled and recorded. M0 is complete in commit `b7cc0c3`.

## M1 — Port the plugin package entrypoint

**Decisions**
- Default export uses `Plugin.define` with ID `opencode-ralph-loop`; package export points to `src/index.ts` and the matching SDK 2.1.4 is a runtime dependency.

**Issues**
- Full `npm audit` reports six vulnerabilities in the development dependency tree; `npm audit --omit=dev` reports none. No automatic dependency upgrades were applied.

**Thoughts**
- `npm pack` created a tarball, which was installed in an isolated temporary project. A temporary `.opencode/plugins` wrapper imported the installed package entrypoint; OpenCode 2.1.4 logged it as loaded and setup wrote `opencode-ralph-loop` to a marker file.
- Smoke command used `opencode run --standalone --model smoke-invalid/no-model ...`; the expected unavailable-model error happened after plugin setup, avoiding a provider call.

**Current state**
- M1 acceptance checks are verified. The DoD review and Conventional Commit remain pending; do not call M1 complete until its commit hash is recorded.

## M2 — Port the three tools

**Decisions**
- Preserve `ralph-loop`, `cancel-ralph`, and `help` as the target tool IDs.

**Issues**
- The V1 tools used `tool()`/Zod arguments; the current V2 entrypoint does not register tools yet. V2 uses tool transforms, JSON Schema, and structured output.

**Thoughts**
- Keep state effects behind the tested tool behavior; avoid parallel command-side state implementations.

**Current state**
- No tool changes or V2 tool tests. Depends on M1.

## M3 — Port slash commands

**Decisions**
- Preserve `/ralph-loop`, `/cancel-ralph`, and `/help`; select a single authoritative command source during this milestone.

**Issues**
- Legacy templates remain in `src/commands.ts`; `commands/*.md` are packaged but not loaded. No V2 commands are registered yet.
- The V1 config hook is not the V2 command transform API.

**Thoughts**
- Preserve argument handling and user-defined precedence; do not let command templates duplicate state transitions.

**Current state**
- No V2 command registration. Depends on M1.

## M4 — Port skill discovery

**Decisions**
- Register packaged skills with `ctx.skill.transform`; check `ctx.skill.list()` and skip existing IDs.

**Issues**
- Packaged `skills/` are not yet registered by the V2 entrypoint; the V1 global-copy behavior was removed.

**Thoughts**
- Test clean install, duplicate IDs, and Windows paths; do not copy skills globally.

**Current state**
- No V2 skill registration/discovery changes. Depends on M1.

## M5 — Preserve project-local loop state

**Decisions**
- Keep `.opencode/ralph-loop.local.md` and its existing fields as the compatibility target; plugin storage is not approved as a replacement.

**Issues**
- State read/write/clear helpers currently swallow I/O errors; writes can fail while tools still report success.

**Thoughts**
- Implement the explicit failure distinctions and tests in `errors.md`; preserve CRLF parsing.

**Current state**
- V1 parsing/serialization now lives in `src/state.ts`; V2 state-file I/O is not implemented. Depends on M1.

## M6 — Subscribe to and scope V2 events

**Decisions**
- Event processing must be scoped to the active loop's session/project and subscription cleanup must follow plugin lifecycle.

**Issues**
- Current `session.deleted` handling clears state without checking the deleted session.
- V2 event names and payloads must be checked against the pinned SDK.

**Thoughts**
- Treat plugin load location and event/session location as distinct until the event contract proves otherwise.

**Current state**
- No V2 event subscription or cleanup implementation yet. Depends on M1.

## M7 — Port completion and continuation behavior

**Decisions**
- Preserve `<promise>DONE</promise>`, max-iteration behavior, cancellation, and initiating-session ownership as target semantics.

**Issues**
- Current completion lookup treats API errors as incomplete; continuation errors are swallowed after incrementing the iteration.
- V2 `session.context` covers active context after compaction; confirm it is sufficient for completion detection.

**Thoughts**
- Prevent duplicate continuation admission and do not retry unless duplicate submission is prevented.

**Current state**
- No V2 session API, completion, or continuation changes. Blocked on M5 and M6.

## M8 — Verify the V2 package

**Decisions**
- Test the packed artifact against the selected minimum V2 version. Do not publish or change release targets as part of verification.

**Issues**
- The fork remote is `BearingMe/opencode-goal`, while package metadata identifies `charfeng1/opencode-ralph-loop`; release identity needs separate approval.

**Thoughts**
- A workspace import is not sufficient; test the npm-packed contents in a clean V2 environment.

**Current state**
- Only the entrypoint smoke test has run; final package behavior remains unverified. Depends on M2–M7.

## M9 — Align repository documentation with V2

**Decisions**
- Update docs only to describe behavior that is implemented and verified. Retain V1 loader rules while V1 support remains.

**Issues**
- README and CONTRIBUTING contain stale setup claims; `AGENTS.md` currently documents V1 loader constraints.

**Thoughts**
- Keep migration snapshots clearly separate from runtime guarantees and update `docs/architecture.md` after the port.

**Current state**
- Harness and migration-planning docs exist, but runtime/user documentation has not been updated for V2. Blocked on implementation and M8.
