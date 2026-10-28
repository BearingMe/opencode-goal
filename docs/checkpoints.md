# OpenCode V2 conversion checkpoints

Checkpoints record verified progress and the next useful place to resume. Milestone acceptance criteria in [`milestones.md`](milestones.md) remain the completion authority; do not mark a checkpoint complete from intention alone.

**Snapshot:** 2026-10-28. The runtime migration is in progress. M0 is complete; M1–M9 are not complete. V2 validation will target OpenCode 2.1.4 and `@opencode/plugin` 2.1.4.

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
- Compatibility contract is settled and recorded. M0 is complete; implementation has not started.

## M1 — Port the plugin package entrypoint

**Decisions**
- V2 entrypoint is planned as a `Plugin.define` plugin with `@opencode/plugin` 2.1.4; package export shape remains open.

**Issues**
- Current default export is a V1 async function returning hooks/tools. `package.json` uses `main` and `@opencode-ai/plugin`.

**Thoughts**
- Keep the no-build source-shipping approach only if the chosen V2 loader supports it.

**Current state**
- No package or entrypoint changes. M1 is ready to start.

## M2 — Port the three tools

**Decisions**
- Preserve `ralph-loop`, `cancel-ralph`, and `help` as the target tool IDs.

**Issues**
- Current tools use V1 `tool()`/Zod argument definitions and return strings; V2 uses tool transforms, JSON Schema, and structured output.

**Thoughts**
- Keep state effects behind the tested tool behavior; avoid parallel command-side state implementations.

**Current state**
- No tool changes or V2 tool tests. Depends on M1.

## M3 — Port slash commands

**Decisions**
- Preserve `/ralph-loop`, `/cancel-ralph`, and `/help`; select a single authoritative command source during this milestone.

**Issues**
- Active templates are in `src/commands.ts`; `commands/*.md` are packaged but not loaded by the current entrypoint.
- The V1 config hook is not the V2 command transform API.

**Thoughts**
- Preserve argument handling and user-defined precedence; do not let command templates duplicate state transitions.

**Current state**
- No V2 command registration. Depends on M1.

## M4 — Port skill discovery

**Decisions**
- Register packaged skills with `ctx.skill.transform`; check `ctx.skill.list()` and skip existing IDs.

**Issues**
- Current `setupSkills()` copies packaged skills globally only when destinations are absent and silently ignores failures.

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
- Current V1 parser and persistence remain unchanged. No V2 state work has started; depends on M1.

## M6 — Subscribe to and scope V2 events

**Decisions**
- Event processing must be scoped to the active loop's session/project and subscription cleanup must follow plugin lifecycle.

**Issues**
- Current `session.deleted` handling clears state without checking the deleted session.
- V2 event names and payloads must be checked against the pinned SDK.

**Thoughts**
- Treat plugin load location and event/session location as distinct until the event contract proves otherwise.

**Current state**
- Current V1 event callback remains in place. No V2 subscription or cleanup implementation; depends on M1.

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
- No V2 package smoke test has been run. Blocked on M0–M7.

## M9 — Align repository documentation with V2

**Decisions**
- Update docs only to describe behavior that is implemented and verified. Retain V1 loader rules while V1 support remains.

**Issues**
- README and CONTRIBUTING contain stale setup claims; `AGENTS.md` currently documents V1 loader constraints.

**Thoughts**
- Keep migration snapshots clearly separate from runtime guarantees and update `docs/architecture.md` after the port.

**Current state**
- Harness and migration-planning docs exist, but runtime/user documentation has not been updated for V2. Blocked on implementation and M8.
