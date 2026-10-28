# Architecture

## Current system

Standalone TypeScript OpenCode **V1 server plugin**. It ships source directly (`package.json` has no build step). Runtime wiring, state-file I/O, tools, command registration, and event handling are concentrated in `src/index.ts`; this is the inherited implementation, not a claim that the code is already well-layered. V2 migration references in `references/` are guidance only; the runtime remains V1 until ported.

## Runtime flow

1. OpenCode loads the default export in `src/index.ts` with `directory` and `client`.
2. Plugin setup copies each packaged skill into `~/.config/opencode/skills/` only when that destination is absent. Copy failures are currently ignored.
3. The `config` hook adds missing command definitions from `src/commands.ts`; existing user definitions win. The `tool` map registers `ralph-loop`, `cancel-ralph`, and `help`.
4. `/ralph-loop` is a prompt template that asks the agent to create state through shell commands. The `ralph-loop` tool independently creates the same state through Node file I/O. These are two entry paths to one loop.
5. State lives at `<project>/.opencode/ralph-loop.local.md`. Its Markdown frontmatter stores `active`, `iteration`, `maxIterations`, and optional `sessionId`; its body stores the task prompt.
6. On `session.idle`, the event handler reads the state, checks session ownership if set, fetches messages through the V1 client, and scans the last assistant text for `<promise>DONE</promise>`. It clears on completion or iteration limit; otherwise it increments state and submits a continuation prompt.
7. On `session.deleted`, the handler currently clears the project state without checking which session was deleted.

## Module and directory ownership

| Path | Current responsibility |
| --- | --- |
| `src/index.ts` | V1 plugin entrypoint, skill installation, command/tool/event wiring, state parsing and file I/O, completion check, continuation flow |
| `src/commands.ts` | State path constants and inline command templates registered by the `config` hook |
| `src/completion.ts` | Completion-tag regular expression; kept outside the plugin entry module because the current V1 loader has runtime export restrictions |
| `commands/*.md` | Packaged Markdown command assets; the entrypoint does not load or copy these files. Active command templates are currently in `src/commands.ts`. |
| `skills/*/SKILL.md` | Packaged agent guidance copied into the global OpenCode skills directory when absent |
| `tests/` | Vitest tests for state serialization, completion matching, plugin tools, and HOME isolation |
| `references/` | OpenCode V2 source snapshots and migration analysis; not runtime code |
| `docs/` | Repository-specific agent guidance |

`README.md` and `CONTRIBUTING.md` say both skills and commands are copied on first run. The runtime only copies skills; use `src/index.ts` and `src/commands.ts` as the source of truth until those docs are reconciled.

## Structural constraints

- Keep the shipped plugin entrypoint's export shape compatible with the V1 loader until the V2 port is implemented and verified; see the current loader rule in `AGENTS.md`.
- Keep OpenCode registration and event lifecycle at the plugin boundary. Put reusable parsing/completion logic in sibling modules rather than adding unrelated responsibilities to the entrypoint.
- Keep loop persistence project-relative. Treat a state format or storage-location change as a compatibility change, not an incidental refactor.
- Keep command templates and packaged Markdown assets consistent when both are intentionally supported; first confirm which source is active.
- Do not treat V2 APIs in `references/` as available in this V1 runtime. Update this flow and the V1 loader rules when the port lands.

## Fork boundary

This checkout's `origin` is `BearingMe/opencode-goal`, while `package.json` still identifies `charfeng1/opencode-ralph-loop`. Verify repository and package destinations before release or publishing work; see [`guardrails.md`](guardrails.md).
