# Architecture

## System shape

V2-only TypeScript OpenCode server plugin. `package.json` exports `src/index.ts` directly; there is no build step. Runtime entry and registrations use the pinned `@opencode/plugin` 2.1.4 SDK.

## Module ownership

| Path | Owns |
| --- | --- |
| `src/index.ts` | `Plugin.define` entrypoint and setup wiring |
| `src/tools.ts` | V2 tool registration and adapters |
| `src/commands.ts` | V2 command registration and adapters |
| `src/skills.ts` | Packaged skill loading and V2 skill registration |
| `src/loop.ts` | Shared start/cancel operations and help text |
| `src/events.ts` | Session lifecycle subscription, event filtering, and deletion cleanup |
| `src/continuation.ts` | Idle completion check, iteration reservation, and continuation admission |
| `src/completion.ts` | Completion-marker detection in active session context |
| `src/state.ts` | Loop-state schema, parsing, serialization, and filesystem I/O |
| `src/state-path.ts` | Project-local state path constant |
| `src/state-lock.ts` | Process-local per-project state-transition locks |
| `src/continuation-control.ts` | Process-local continuation request registry and abort controls |
| `skills/` | Packaged skill assets; registered, not copied globally |

## Data flow

1. `src/index.ts` registers tools, commands, and skills, then subscribes to session events.
2. Start/cancel commands and tools resolve the session's project directory and delegate state changes to `src/loop.ts`.
3. `session.idle` is filtered by project state, session ownership, and event identity/time before `src/continuation.ts` reads active context.
4. Completion clears state. Otherwise, continuation reserves an iteration and queues a prompt; session API calls run outside the state lock.
5. `session.deleted`, cancellation, and start abort matching in-flight work before applying their state transition.

## Dependency rules

- Keep `src/index.ts` as wiring only; registration adapters belong in their sibling modules.
- Tools and commands delegate shared start/cancel behavior to `src/loop.ts`; they do not access loop-state files directly.
- `src/state.ts` is the only owner of loop-state filesystem I/O. `src/skills.ts` may read packaged skill assets.
- OpenCode integrations use `@opencode/plugin`; do not add direct server, provider, or client implementations alongside the SDK boundary.
- State locks and request tracking are module-local. Only one OpenCode runtime may operate on a project's loop state at a time.
- Keep the project-local state path and format compatible; a change requires an explicit migration decision.
