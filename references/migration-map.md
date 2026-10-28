# Plugin V2 migration map

Repository analysis based on the current implementation and the official references linked in [`README.md`](README.md). This is a work plan, not a claim that V1 and V2 APIs are interchangeable.

## Current implementation to V2

| Current code | V2 direction | Notes / decisions |
| --- | --- | --- |
| `src/index.ts`: async default plugin function | Default-export `Plugin.define({ id, setup(ctx) })` from `@opencode/plugin` | Use a stable ID, likely `opencode-ralph-loop`; confirm the ID before implementing. |
| `ctx.directory`, `ctx.client` | `ctx.location` and domain APIs such as `ctx.session` | Plugin location is not necessarily the location of every event/session. Filter by session and location where needed. |
| Returned `tool` map and `tool()` / Zod schemas | `ctx.tool.transform(editor => editor.add(...))` | Use JSON Schema input and return `{ content: string }`. Migrate all three tools and test empty-input schemas. |
| Returned `config` hook mutating `input.command` | `ctx.command.transform(...)` | V2 command transforms use executable command definitions. Port the existing `/ralph-loop`, `/cancel-ralph`, and `/help` behavior, not just the old config object shape. |
| Returned `event` callback | `ctx.event.subscribe({ types, signal })` and an `AbortController` cleanup | Check the installed V2 SDK event union and payloads. The V2 stream may observe events beyond the plugin's own loaded location. |
| `client.session.messages(...)` and V1 `info.role` / `parts` | `ctx.session.context({ sessionID })`; inspect V2 message `type` / `content` | V2 context is the active context after compaction, not necessarily the complete message history. Confirm it meets completion-detection needs. |
| `client.session.prompt({ path, body })` | `ctx.session.prompt({ sessionID, text })` | V2 prompt inputs are direct fields; use the event's session ID and verify behavior for queued/active sessions. |
| Markdown state under `<project>/.opencode/ralph-loop.local.md` | Initially retain the file format and path | Preserves current project-local persistence. Do not switch to plugin storage without confirming its project scoping and a migration strategy. |
| `setupSkills()` copies packaged skills into global config | Prefer V2 skill discovery or `ctx.skill.transform`; retain copy behavior only if needed | Test clean installs, duplicate skill IDs, updates, and Windows paths before choosing. Avoid silently overwriting user-owned skills. |
| `commands/` Markdown and `src/commands.ts` templates | V2 command transforms and/or supported Markdown command files | Determine one source of truth to avoid duplicate slash commands. V2 command transform API is executable; Markdown commands use file discovery. |
| `package.json` `main` and `@opencode-ai/plugin` peer/dev dependencies | V2 package `exports` and compatible `@opencode/plugin` dependency | Select and test an explicit minimum OpenCode V2/plugin SDK version; do not assume the current `>=1.0.0` range expresses V2 compatibility. |
| V1 loader-specific comments and `AGENTS.md` constraints | Reassess against the V2 loader | Do not carry V1 export-loader restrictions forward without a V2 source confirming them. |

## Behavior and lifecycle risks

1. **Bind the loop to its initiating session.** Current state has an optional `sessionId`, but the start tool does not set it. The first matching idle event can therefore claim the loop.
2. **Scope events to the loop.** Current `session.deleted` handling clears the project state for any deleted session. V2 event subscriptions can see server events; only the relevant session/location should change loop state.
3. **Prevent duplicate continuations.** Define what happens if more than one idle event is observed while a continuation prompt is being admitted or processed.
4. **Preserve completion semantics.** The completion marker is checked in the last assistant response in V1. In V2, map message content types and ensure the chosen API can observe the final assistant message after compaction.
5. **Handle prompt failures and cancellation.** Preserve the state and iteration invariants when sending the continuation fails, the session is interrupted/deleted, or the plugin unloads.
6. **Keep project-local persistence.** The Markdown file is user-visible and project-specific. Plugin storage is a separate mechanism; treat changing it as a product decision.

## Suggested validation

- V2 package loads and reports the stable plugin ID.
- Each tool is listed, accepts valid input, and returns the expected output.
- All three commands resolve once and preserve argument handling and agent behavior.
- Start, completion, max-iteration stop, cancellation, and state cleanup work.
- An unrelated session's idle/deleted event cannot start, advance, or clear a loop.
- Completion detection works with text plus non-text assistant content and after compaction.
- Reload/unload stops event consumption without leaking a continuation.
- Skills and commands work on a clean install without overwriting user files.
- Typecheck, tests, and an installed-package smoke test pass on the minimum supported V2 release.

## Open decisions

- V2-only package or temporary V1/V2 dual support.
- Minimum OpenCode V2 and `@opencode/plugin` versions.
- Whether to use V2 command transforms, Markdown command files, or both for distinct commands.
- Whether packaged skills should be dynamically registered or installed as files.
- Whether current state-file format remains indefinitely or is migrated to another project-scoped store.
