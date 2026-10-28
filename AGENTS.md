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

- Read `docs/guardrails.md` and `docs/architecture.md` before structural or release changes; consult `docs/errors.md` / `docs/logging.md` when relevant.
- `docs/checkpoints.md` records verified V2 migration evidence and operational limits; do not treat migration snapshots as runtime code.
- Use `docs/definition-of-done.md` before marking a milestone complete.

## Layout

- See `docs/architecture.md` for source-module ownership and dependency boundaries.
- `tests/` uses Vitest; `tests/setup.ts` sandboxes `HOME` to a temp directory.

## Package

- V2-only source; minimum OpenCode 2.1.4 and pinned `@opencode/plugin` 2.1.4.
- No build step; `package.json` exports `src/index.ts` and packages `src/` plus `skills/`.
- Runtime requires Node 18+; tests require Node 20+.
- The npm registry's 1.0.10 artifact is still V1; verify a V2 release exists before recommending package-name installation.

## Runtime limits

- State locks and request tracking are process-local; use one OpenCode runtime per project.
- State is project-local at `.opencode/ralph-loop.local.md`; keep task content out of Git.

## Releases

The inherited master workflow can publish/tag when the package version exceeds npm's latest. This fork's remote and package metadata differ; verify the target and get explicit approval before version, release, publish, or push changes. See `docs/guardrails.md` and `.github/workflows/release.yml`.
