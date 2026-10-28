# OpenCode V2 conversion checkpoints

Checkpoints record verified progress and the next useful place to resume. Milestone acceptance criteria in [`milestones.md`](milestones.md) remain the completion authority; do not mark a checkpoint complete from intention alone.

**Snapshot:** 2026-10-28. The runtime is still V1. V2 research, source snapshots, migration notes, and milestones exist; no V2 implementation or V2 runtime validation has been done. All milestone acceptance checklists remain unchecked.

## M0 — Confirm the V2 compatibility contract

**Decisions**
- Preserve existing command/tool names and project-local state as migration targets; do not change fork/package identity or publish without explicit approval.
- V2-only versus dual support, minimum versions, plugin ID, and asset strategy are not decided.

**Issues**
- `@opencode/plugin` compatibility and package entrypoint requirements need to be pinned to a target V2 release.
- V1 and V2 differ in plugin, tool, event, command, and session APIs.

**Thoughts**
- Re-verify the saved V2 documentation against live official docs when implementation starts.
- Record decisions before changing `package.json` or runtime behavior.

**Current state**
- Research is captured in `references/`; the compatibility contract itself is incomplete. M0 is not complete.

## M1 — Port the plugin package entrypoint

**Decisions**
- V2 entrypoint is planned as a `Plugin.define` plugin; SDK version and package export shape remain open.

**Issues**
- Current default export is a V1 async function returning hooks/tools. `package.json` uses `main` and `@opencode-ai/plugin`.

**Thoughts**
- Keep the no-build source-shipping approach only if the chosen V2 loader supports it.

**Current state**
- No package or entrypoint changes. Blocked on M0.

## M2 — Port the three tools

**Decisions**
- Preserve `ralph-loop`, `cancel-ralph`, and `help` as the target tool IDs.

**Issues**
- Current tools use V1 `tool()`/Zod argument definitions and return strings; V2 uses tool transforms, JSON Schema, and structured output.

**Thoughts**
- Keep state effects behind the tested tool behavior; avoid parallel command-side state implementations.

**Current state**
- No tool changes or V2 tool tests. Blocked on M1.

## M3 — Port slash commands

**Decisions**
- Preserve `/ralph-loop`, `/cancel-ralph`, and `/help`; select a single authoritative command source during this milestone.

**Issues**
- Active templates are in `src/commands.ts`; `commands/*.md` are packaged but not loaded by the current entrypoint.
- The V1 config hook is not the V2 command transform API.

**Thoughts**
- Preserve argument handling and user-defined precedence; do not let command templates duplicate state transitions.

**Current state**
- No V2 command registration. Blocked on M0 and M1.

## M4 — Port skill discovery

**Decisions**
- Existing user-owned skill files must not be overwritten. V2 discovery versus `ctx.skill.transform` remains open.

**Issues**
- Current `setupSkills()` copies packaged skills globally only when destinations are absent and silently ignores failures.

**Thoughts**
- Test clean install, upgrade, duplicate IDs, and Windows paths before removing or retaining global copying.

**Current state**
- No V2 skill registration/discovery changes. Blocked on M0 and M1.

## M5 — Preserve project-local loop state

**Decisions**
- Keep `.opencode/ralph-loop.local.md` and its existing fields as the compatibility target; plugin storage is not approved as a replacement.

**Issues**
- State read/write/clear helpers currently swallow I/O errors; writes can fail while tools still report success.

**Thoughts**
- Implement the explicit failure distinctions and tests in `errors.md`; preserve CRLF parsing.

**Current state**
- Current V1 parser and persistence remain unchanged. No V2 state work has started; depends on M0 and M1.

## M6 — Subscribe to and scope V2 events

**Decisions**
- Event processing must be scoped to the active loop's session/project and subscription cleanup must follow plugin lifecycle.

**Issues**
- Current `session.deleted` handling clears state without checking the deleted session.
- V2 event names and payloads must be checked against the pinned SDK.

**Thoughts**
- Treat plugin load location and event/session location as distinct until the event contract proves otherwise.

**Current state**
- Current V1 event callback remains in place. No V2 subscription or cleanup implementation; blocked on M1 and M0.

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
