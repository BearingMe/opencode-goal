# OpenCode V2 conversion milestones

## Goal

Convert the current OpenCode V1 Ralph Loop plugin to V2 while preserving its user-visible commands, loop behavior, and project-local state. The runtime is still V1; V2 references are planning input, not evidence of a completed port.

## Planning format

- A **milestone** is one small, reviewable outcome.
- Each milestone is divided into **phases**; each phase groups work at epic scale.
- A milestone is complete only when every acceptance checkbox and [`definiotion-of-done.md`](definiotion-of-done.md) gate is verified. Do not mark planned or assumed work complete.
- Keep changes within the milestone. Preserve the fork/package identity and do not publish as part of this conversion without explicit approval.

## Milestones

### M0 — Confirm the V2 compatibility contract

**Outcome:** Decisions that constrain implementation are recorded before changing the runtime.

**Phases (epics)**

1. **Support contract:** choose V2-only or temporary V1/V2 support; confirm minimum OpenCode and `@opencode/plugin` versions and package entrypoint requirements.
2. **Behavior contract:** confirm plugin ID, command/tool names, state path and format, completion promise, event/session ownership, error policy, and skill/command delivery approach.

**Acceptance criteria**

- [x] Minimum supported versions are OpenCode 2.1.4 and `@opencode/plugin` 2.1.4.
- [x] The package is V2-only; V1 support is outside this conversion.
- [x] Preserve plugin ID `opencode-ralph-loop`, the three command/tool IDs, the `.opencode/ralph-loop.local.md` format/path, max-iteration default 100, and `<promise>DONE</promise>`. Bind new loops to their initiating session; allow legacy state without `sessionId` to bind to the first idle session in the same project. Scope state changes to that project. Register commands and packaged skills through V2 transforms, skipping IDs already returned by `ctx.command.list()` / `ctx.skill.list()`; never copy skills globally.
- [x] State and API failures are explicit per [`errors.md`](errors.md). Publishing/package identity is separate; no release metadata or target changes are authorized.

### M1 — Port the plugin package entrypoint

**Outcome:** OpenCode V2 can load the plugin package using the selected support contract.

**Phases (epics)**

1. **Plugin lifecycle:** replace the V1 entrypoint with the V2 definition and setup lifecycle.
2. **Package contract:** update the SDK dependency and package exports/entrypoint for the selected V2 release.

**Acceptance criteria**

- [x] OpenCode 2.1.4 loaded the installed package and its setup verified ID `opencode-ralph-loop`.
- [x] Package metadata exports `./src/index.ts`; `npm pack` confirms source shipping with no build step.
- [x] The packed package was installed in an isolated project and loaded by OpenCode 2.1.4.

### M2 — Port the three tools

**Outcome:** Ralph Loop tools use the V2 tool registry without changing their intended behavior.

**Phases (epics)**

1. **Tool registration:** register `ralph-loop`, `cancel-ralph`, and `help` through the V2 tool transform.
2. **Tool contract tests:** validate JSON Schema inputs, structured outputs, defaults, and state effects.

**Acceptance criteria**

- [x] All three tools appear exactly once with valid V2 schemas and structured results.
- [x] Starting a loop persists the task, max-iteration value, and invoking session; cancellation and help retain their user-facing behavior.
- [x] Empty-input tools and invalid/missing arguments have tested behavior.
- [x] Start and cancel resolve the invoking session's project directory through `ctx.session.get({ sessionID })`, rather than assuming `ctx.location.directory` is the session location.

### M3 — Port slash commands

**Outcome:** Existing slash commands work in V2 with one clear source of truth.

**Phases (epics)**

1. **Command integration:** register the three slash commands using a V2-supported command mechanism and preserve argument handling.
2. **Command asset audit:** reconcile `commands/*.md` with `src/commands.ts` and choose which is authoritative.

**Acceptance criteria**

- [x] `/ralph-loop`, `/cancel-ralph`, and `/help` register through V2 command transforms; pre-existing IDs are skipped.
- [x] Start/cancel commands use the same tested `startLoop` / `cancelLoop` behavior as the tools.
- [x] Command task text and requested delivery mode are preserved; registration checks `ctx.command.list()` and skips existing IDs.
- [x] A user-owned ID present at setup remains skipped for this plugin lifetime; removal does not silently transfer command ownership until plugin reload/restart.
- [x] `src/commands.ts` is authoritative; obsolete Markdown command files are removed and `commands/` is not packaged.

### M4 — Port skill discovery

**Outcome:** Packaged Ralph Loop skills are available in V2 without overwriting user-owned files.

**Phases (epics)**

1. **V2 registration:** register packaged skills with `ctx.skill.transform` as decided in M0.
2. **Install behavior:** remove or retain global copying based on compatibility needs and test clean/upgrade installs.

**Acceptance criteria**

- [x] All packaged skills are discoverable on a clean V2 install.
- [x] Registration checks `ctx.skill.list()` and skips existing IDs, preserving user-owned skills.
- [x] The V1 `setupSkills()` copy is removed; the package includes the skill assets, and the plugin registers them without global filesystem writes.

### M5 — Preserve project-local loop state

**Outcome:** State parsing and persistence are compatible, explicit on failure, and isolated to the project.

**Phases (epics)**

1. **State boundary:** port state read/write/clear and parsing without changing the agreed path or format.
2. **Persistence failures:** implement and test the policies in [`errors.md`](errors.md).

**Acceptance criteria**

- [x] Existing `.opencode/ralph-loop.local.md` files remain readable and round-trip fields correctly, including Windows line endings.
- [x] State remains project-relative; no switch to plugin storage occurs without an explicit decision and migration path.
- [x] Missing state is distinct from read failure; write/delete failures propagate, and start/cancel tools do not report success when required I/O fails. M7 verifies completion cleanup against the same policy.
- [x] Tests cover malformed, missing, and inaccessible state files.

### M6 — Subscribe to and scope V2 events

**Outcome:** The V2 plugin observes relevant session events and releases its subscription on unload.

**Phases (epics)**

1. **Event subscription:** use the V2 event API and process only the required event types supported by the pinned SDK.
2. **Ownership and cleanup:** validate event/session/project scope and abort the subscription on plugin cleanup.

**Acceptance criteria**

- [x] `session.idle` and `session.deleted` payloads typecheck against the pinned SDK; unsupported server-side type filtering is replaced by local type narrowing.
- [x] Events from unrelated sessions/projects cannot mutate this loop's state.
- [x] Plugin cleanup aborts the subscription and handles abort rejection without an unhandled error.

### M7 — Port completion and continuation behavior

**Outcome:** The loop state machine preserves completion, iteration, and cancellation semantics under V2.

**Phases (epics)**

1. **Completion detection:** map V2 assistant message types/content and verify the selected context/history API, including compaction.
2. **Continuation state machine:** bind to the initiating session, enforce iteration limits, and handle prompt admission failures without duplicate work.

**Acceptance criteria**

- [ ] Completion is detected from the correct assistant response and verified after compaction.
- [ ] A session receives at most one continuation for an idle transition; unrelated or deleted sessions cannot advance or clear the loop.
- [ ] Max-iteration, completion, and cancellation paths clear or preserve state as specified.
- [ ] Failed completion checks or prompt admissions are visible and do not silently consume an iteration or trigger an unsafe retry.

### M8 — Verify the V2 package

**Outcome:** The packed artifact works on the minimum supported V2 release.

**Phases (epics)**

1. **Automated checks:** run typecheck and the complete test suite, including failure paths.
2. **Installed-package smoke test:** pack and install the artifact into a clean V2 test environment.

**Acceptance criteria**

- [ ] `npm run typecheck` and `npm test` pass; tests cover tool, command, state, event, completion, and failure behavior.
- [ ] The packed package loads and works on the minimum supported V2 release.
- [ ] No publish, push, package identity change, or release-target change occurs without explicit approval.

### M9 — Align repository documentation with V2

**Outcome:** Project documentation describes the implemented V2 runtime, not the inherited V1 behavior.

**Phases (epics)**

1. **User/contributor docs:** update README and contributing instructions for actual V2 install, commands, state, and support policy.
2. **Agent docs:** update architecture and remove V1-only rules only when V1 support is dropped and the V2 loader contract is verified.

**Acceptance criteria**

- [ ] `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, and `docs/architecture.md` agree with runtime behavior and supported versions.
- [ ] V1-specific loader constraints are removed only if V1 support is dropped and the V2 loader contract is verified.
- [ ] Migration references remain clearly identified as snapshots and are not presented as runtime implementation.

## References

- [V2 migration map](../references/migration-map.md)
- [V2 plugin migration guide snapshot](../references/opencode-v2/plugin-migrate-v1.md)
- [V2 server plugin guide snapshot](../references/opencode-v2/server-plugins.md)
- [Agent guardrails](guardrails.md)
