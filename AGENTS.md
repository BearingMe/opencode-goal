# AGENTS.md

**Keep this file short.** Add only facts that change agent behavior.

**Whenever you write any comment, documentation, or PR body in this repo:** consider what the next human and their coding agent will get out of it. Less prose, more information density. **Do not write your own diary** — in here, in code comments, in PR descriptions, anywhere. Keep it facts only.

`CLAUDE.md` is a symlink to this file at every directory level. Edit `AGENTS.md` only.

## Commands

```bash
npm install
npm run typecheck   # tsc --noEmit, strict
npm test            # vitest run
```

## Agent docs

- Runtime is an incremental OpenCode V2 port; check `docs/checkpoints.md` before assuming loop-event and continuation behavior is complete.
- Read `docs/guardrails.md`; treat `docs/architecture.md` as the V1 baseline until M9 updates it, and consult `docs/logging.md` / `docs/errors.md` for relevant changes.
- Follow `docs/milestones.md` for the V2 conversion sequence.
- Update `docs/checkpoints.md` at phase boundaries and handoffs; record verified state only.
- Use `docs/definiotion-of-done.md` before marking a milestone complete.

## Layout

- `src/index.ts` — V2 plugin entry; registrations live in sibling modules
- `src/commands.ts`, `src/tools.ts`, `src/skills.ts` — V2 command, tool, and skill registration
- `src/state.ts` — project-local state parsing and I/O; `skills/` contains packaged skill files, never copied globally
- `tests/` — vitest; `tests/setup.ts` sandboxes `HOME` to a tmpdir
- `.github/workflows/release.yml` — CI + auto-publish on master

## Package

- No build step; ships `src/*.ts` directly via `"main": "src/index.ts"`.
- Runtime requires Node 18+; tests require Node 20+ (Vitest 4 imports `node:util.styleText`).

## Legacy V1 migration notes

- These V1 API/loader constraints describe the previous runtime; verify V2 behavior against the pinned SDK and official V2 docs instead of carrying them forward.

## Releases

The workflow auto-publishes on master. This fork's remote and package metadata differ; verify the target and get explicit approval before version or release changes. See `docs/guardrails.md` and `.github/workflows/release.yml`.
