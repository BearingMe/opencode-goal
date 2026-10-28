# OpenCode V2 conversion checkpoints

Checkpoints record verified progress and the next useful place to resume. Milestone acceptance criteria in [`milestones.md`](milestones.md) remain the completion authority; do not mark a checkpoint complete from intention alone.

**Snapshot:** 2026-10-28. M0–M6 are complete and committed. M7–M9 have not started. V2 validation targets OpenCode 2.1.4 and `@opencode/plugin` 2.1.4.

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
- M1 is complete in commit `48572b1`.

## M2 — Port the three tools

**Decisions**
- Preserve `ralph-loop`, `cancel-ralph`, and `help` as the target tool IDs.
- Register with `ctx.tool.transform`; use JSON Schema, V2 structured content, `Tool.Error` for invalid start input, and bind state to the invoking session.
- Resolve state paths from `ctx.session.get({ sessionID }).location.directory`; `ctx.location.directory` describes the plugin instance and is not guaranteed to be the session's location.

**Issues**
- Filesystem failure distinctions and injected failure tests remain in M5.

**Thoughts**
- Start and cancel share `src/state.ts`; help is static content. M3 commands must reuse the same state operations.
- Tests exercise the V2 registration callback with a fake editor, including a session directory different from the plugin location; start and cancel both operate in the session's project. Final installed-package behavior is covered in M8.

**Current state**
- M2 is complete in commit `a9b531b`; `npm run typecheck` and all 33 tests pass. Adversary review passed, including the session-versus-plugin location regression.

## M3 — Port slash commands

**Decisions**
- Preserve `/ralph-loop`, `/cancel-ralph`, and `/help`; `src/commands.ts` is the sole runtime source and registers V2 command transforms.
- Command registration reads `ctx.command.list()` and skips existing IDs. Ownership is fixed for the plugin lifetime: a skipped ID is not reclaimed after a user command is removed until plugin reload/restart. This follows the M0 setup-time skip policy and avoids silently shifting command ownership.
- Start/cancel reuse `src/loop.ts`, which is also used by the tools. Task text and delivery mode are preserved; all three commands select the legacy `build` agent.

**Issues**
- V2 command submission can fail after state is written; failure/rollback policy remains for M7.

**Thoughts**
- Removed obsolete `commands/*.md` files and stopped packaging `commands/`; slash commands are executable transform definitions, not Markdown templates.
- Tests cover initial collision skipping and transform replay after removal, argument/delivery preservation, state effects, empty input, cancellation, help, and build-agent selection for all commands.
- Runtime smoke: OpenCode 2.1.4 loaded the packed package. A project `/help` added after setup appeared in `/api/command` and its actual command dispatch produced the user-defined message. Plugin `/ralph-loop` dispatch wrote the invoking session ID to the state file; `/cancel-ralph` dispatch removed it.

**Current state**
- M3 is complete in commit `f603c91`; `npm run typecheck`, all 39 tests, and `npm pack --dry-run` pass. Adversary review passed, including live command-dispatch smoke on OpenCode 2.1.4.

## M4 — Port skill discovery

**Decisions**
- Register packaged `skills/<id>/SKILL.md` files with `ctx.skill.transform`; resolve files relative to `src/skills.ts`, parse their frontmatter, and submit the absolute path plus body as `Skill.Info`.
- Check `ctx.skill.list()` and skip existing IDs. Do not copy skill files to a global directory.

**Issues**
- None identified in M4 scope.

**Thoughts**
- Tests cover all three packaged skill IDs and bodies, absolute Windows paths, and preserving an existing user-owned skill.
- OpenCode 2.1.4 smoke installed the packed package in a fresh project; `ctx.skill.list()` had none of the Ralph IDs before setup and all three after setup, with package-local `SKILL.md` paths. The expected invalid-model error happened after setup.
- Updated `AGENTS.md` and `CONTRIBUTING.md` layout claims; the broader README/architecture V2 documentation pass remains M9.

**Current state**
- M4 is complete in commit `cb39ea6`; `npm run typecheck`, all 41 tests, and `npm pack --dry-run` pass. Adversary review passed; packed-install smoke on OpenCode 2.1.4 discovered all three skills. Depends on M3.

## M5 — Preserve project-local loop state

**Decisions**
- Keep `.opencode/ralph-loop.local.md` and its existing fields as the compatibility target; plugin storage is not approved as a replacement.
- Only `ENOENT` means inactive state. Reject malformed existing files; tolerate omitted fields in valid partial frontmatter for compatibility. Wrap non-missing filesystem failures with `StateFileError` and preserve the cause.
- Inject the state operations into loop actions for failure tests; completion cleanup must use the same store and is validated in M7.

**Issues**
- None identified in M5 scope; M7 still owns completion cleanup and prompt-admission behavior.

**Thoughts**
- Tests cover parser/serializer and file round trips, CRLF/BOM, malformed and partial legacy content, missing files, inaccessible read/write/delete paths, and failed start/cancel tool results.

**Current state**
- M5 is complete in commit `d998af6`; `npm run typecheck` and all 52 tests pass. Adversary review passed. M7 must verify completion cleanup through the same `StateStore` contract. Depends on M2.

## M6 — Subscribe to and scope V2 events

**Decisions**
- Event processing must be scoped to the active loop's session/project and subscription cleanup must follow plugin lifecycle.
- In pinned `@opencode/plugin` 2.1.4, `ctx.event.subscribe` accepts `signal` but no `types` filter. Subscribe with the supported signal and locally narrow to `session.idle` / `session.deleted`.
- Both events carry `data.sessionID`; their project `location` is optional. Use the event location when present, otherwise resolve through `ctx.session.get`; never fall back to plugin `ctx.location`.
- Only invoke idle handling for active state in that project whose `sessionId` matches; allow unbound legacy state for M0's first-idle binding. A delete event clears only active state bound to that exact session.
- Plugin cleanup aborts the subscription and awaits its consumer; abort-related stream rejection is treated as shutdown.

**Issues**
- Idle continuation behavior remains for M7; M6 only scopes and dispatches eligible idle events.
- If a delete event omits `location` and `ctx.session.get` can no longer resolve the deleted session, report the failure and leave state untouched rather than guessing a project. Tests cover successful lookup fallback; this post-delete API behavior is not runtime-verified.

**Thoughts**
- Tests cover unrelated project/session events, optional event location, unbound legacy idle state, entrypoint cleanup, and abort rejection.
- `npm run typecheck` and all 57 tests pass. Event names/payloads were checked against `@opencode/schema` and the event API against pinned `@opencode/plugin` 2.1.4 types.

**Current state**
- M6 is complete in commit `b8676b6`; `npm run typecheck`, all 57 tests, and `npm pack --dry-run` pass. Adversary review passed. Post-delete lookup without event location remains explicitly unverified; failure safely leaves state untouched. Depends on M1.

## M7 — Port completion and continuation behavior

**Decisions**
- Preserve `<promise>DONE</promise>`, max-iteration behavior, cancellation, and initiating-session ownership as target semantics.

**Issues**
- Current completion lookup treats API errors as incomplete; continuation errors are swallowed after incrementing the iteration.
- V2 `session.context` covers active context after compaction; confirm it is sufficient for completion detection.

**Thoughts**
- Prevent duplicate continuation admission and do not retry unless duplicate submission is prevented.

**Current state**
- No V2 completion or continuation logic yet. M5 and M6 dependencies are complete; M7 is ready to start. M6 uses `ctx.session.get` only as the fallback for events without `location`.

## M8 — Verify the V2 package

**Decisions**
- Test the packed artifact against the selected minimum V2 version. Do not publish or change release targets as part of verification.

**Issues**
- The fork remote is `BearingMe/opencode-goal`, while package metadata identifies `charfeng1/opencode-ralph-loop`; release identity needs separate approval.

**Thoughts**
- A workspace import is not sufficient; test the npm-packed contents in a clean V2 environment.

**Current state**
- Packed-package smoke has verified entrypoint setup, command dispatch (M3), and skill discovery (M4) on OpenCode 2.1.4. Integrated verification of M5–M7 and the final package matrix remains. Depends on M2–M7.

## M9 — Align repository documentation with V2

**Decisions**
- Update docs only to describe behavior that is implemented and verified. Retain V1 loader rules while V1 support remains.

**Issues**
- README and `docs/architecture.md` still contain stale V1 command/setup claims.

**Thoughts**
- Keep migration snapshots clearly separate from runtime guarantees and update `docs/architecture.md` after the port.

**Current state**
- Harness and migration-planning docs exist, but runtime/user documentation has not been updated for V2. Blocked on implementation and M8.
