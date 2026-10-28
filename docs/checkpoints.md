# OpenCode V2 conversion checkpoints

Checkpoints record verified progress and the next useful place to resume. Milestone acceptance criteria in [`milestones.md`](milestones.md) remain the completion authority; do not mark a checkpoint complete from intention alone.

**Snapshot:** 2026-10-28. M0–M8 are complete and committed. M9 remains. V2 validation targets OpenCode 2.1.4 and `@opencode/plugin` 2.1.4.

## M0 — Confirm the V2 compatibility contract

**Decisions**
- Support is V2-only: minimum OpenCode 2.1.4 and `@opencode/plugin` 2.1.4. V1 compatibility is outside this conversion.
- Preserve plugin ID `opencode-ralph-loop`, existing tool/command IDs, project-local state path/format, 100-iteration default, and `<promise>DONE</promise>`. Bind new loops to their initiating session; legacy state without `sessionId` can bind to the first idle session in the same project.
- State locks and in-flight request tracking are process-local; concurrent OpenCode runtimes must not operate on the same project's Ralph state file.
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
- `session.context` returns active context after compaction. Detect completion only in text parts of the latest assistant message; do not treat user, reasoning, tool, or compaction-summary text as the completion signal.
- Persist a fresh loop ID and start timestamp for new runs. OpenCode 2.1.4 event `created` values come from `Clock.currentTimeMillis`; compare timestamps only to reject strictly older events (equal millisecond timestamps are valid), and persist the last processed event ID/time and compare captured state snapshots to reject replays or replaced runs.
- Bind legacy unowned state to the first eligible idle session before any asynchronous completion lookup, so lookup failure cannot leave it available to another session.
- Enforce the iteration cap before completion lookup; reaching the cap clears state without another API request or continuation.
- Use a per-project lock only for state transitions; keep V2 session API calls outside it so start/cancel/delete can update state even if a request stalls. Persist a request ID before completion lookup and retain it through prompt admission until the call settles, even after abort, to suppress overlapping idle work. An unrecognized persisted request ID fails closed; a blocked or pending loop must be cancelled before starting another. Start/cancel/delete abort matching requests before their state transition; delete also aborts by session ID before resolving an optional project location. Event cleanup aborts the subscription but does not wait indefinitely for abort-ignorant handlers. Coordination is module-local and assumes one active OpenCode runtime per project.
- A failed completion lookup clears its pending request, consumes no iteration, and reports the error; a later idle event may repeat this read-only check.
- Persist the increment and `continuationBlocked` before calling `session.prompt`. A rejected/interrupted admission has an uncertain outcome; keep the increment reserved and block future continuation until cancel/restart. A successful admission clears the block.

**Issues**
- Prompt admission rejection is not proof that the server did not durably enqueue the input; never roll back and automatically retry that iteration. Cancellation cannot retract a prompt OpenCode already admitted; cancel/restart prevents future loop continuations, but an admitted prompt may still run.

**Thoughts**
- Tests cover active context completion, compaction boundaries, context/prompt failures, persisted replay guards, iteration caps, cancellation/deletion aborts, session ownership, restart snapshots, and state cleanup.
- `npm run typecheck` and all 83 tests pass. Final adversary review passed with no blocking findings in the documented single-runtime scope.

**Current state**
- M7 is complete in local commit `f81b145`. The M6 event-location fallback remains `ctx.session.get`; missing-location lookup failure is reported and cannot safely identify state to clear.

## M8 — Verify the V2 package

**Decisions**
- Test the packed artifact against the selected minimum V2 version. Do not publish or change release targets as part of verification.

**Issues**
- The fork remote is `BearingMe/opencode-goal`, while package metadata identifies `charfeng1/opencode-ralph-loop`; release identity needs separate approval.

**Thoughts**
- Packed `opencode-ralph-loop@1.0.10` into the approved temporary directory and installed that tarball into a clean temporary project; npm resolved the declared `@opencode/plugin@2.1.4` dependency.
- OpenCode `v2.1.4` loaded a temporary `.opencode/plugins` wrapper importing the installed package. With inherited OpenCode/Orca session variables cleared and an isolated config home, setup registered `ralph-loop`, `cancel-ralph`, and `help`; the real V2 `ctx.tool.list()` exposed them.
- The wrapper used a real temporary OpenCode session and called registered tool `execute` handlers directly (not model-directed tool dispatch). It supplied controlled `session.idle` events and deterministic `session.context` results, and captured `session.prompt` to avoid provider execution. Incomplete work produced exactly one queued continuation and a reserved iteration; the completion marker cleared state without another prompt; a second incomplete loop advanced once and cancellation cleared state.
- Smoke evidence: `C:\Users\gomes\AppData\Local\Temp\opencode\ralph-loop-m8-95e6bb813c774b188581f1cd8fe99ef0\project\.opencode\ralph-loop-m8-result.json`. Packed tarball SHA-256: `06A5B9E43AB0917AD34AB9700178E74CB7288DB6D9D3D4BFF58D09F1C6751C54`.
- `opencode run --standalone --print-logs --log-level debug --model smoke-invalid/no-model ...` then failed with the expected unavailable-model error after the package smoke completed; no provider request was made.
- The tarball contains plugin source and all three packaged skills. It was not published, and no package/release identity or target changed.
- `npm run typecheck` and all 83 tests pass. Final adversary review passed with no material blockers. The smoke exercises packaged event logic with controlled inputs, not OpenCode's live event delivery or model-driven execution.

**Current state**
- M8 is complete in local commit `05f5ad0`; it is not pushed. The smoke verifies real tool registration plus packaged continuation, completion, and cancellation logic on OpenCode 2.1.4 using controlled event/session boundaries. Depends on M2–M7.

## M9 — Align repository documentation with V2

**Decisions**
- Describe this checkout as V2-only, while clearly distinguishing it from the still-published V1 npm artifact.
- Remove V1 loader constraints from current-runtime guidance: V1 support is out of scope and OpenCode 2.1.4 loaded the packed V2 export through a discovered `.opencode/plugins` wrapper.

**Issues**
- The fork remote is `BearingMe/opencode-goal`; package and release metadata still identify `charfeng1/opencode-ralph-loop`. Do not publish or change identity without approval.
- npm's current `opencode-ralph-loop@1.0.10` tarball is the legacy V1 artifact; the V2 port remains unpublished.

**Thoughts**
- OpenCode 2.1.4 loaded the installed V2 tarball through `.opencode/plugins/ralph-loop.ts` containing `export { default } from "opencode-ralph-loop";`.
- Registry tarball inspection showed legacy `main: src/index.ts` and peer dependency `@opencode-ai/plugin`; the local V2 package instead exports `src/index.ts` and depends on `@opencode/plugin@2.1.4`.
- Keep official V2 documentation in `references/` labeled as dated snapshots; keep runtime structure in `docs/architecture.md` and operational behavior in README/guardrails.

**Current state**
- README, CONTRIBUTING, AGENTS, architecture, guardrails, errors, and logging are aligned with the implemented V2 source and unpublished-package status. `npm run typecheck`, all 83 tests, and adversary review pass; the local M9 commit remains.
