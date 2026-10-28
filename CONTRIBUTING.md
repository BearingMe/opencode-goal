# Contributing

## Runtime contract

- This source is V2-only: OpenCode 2.1.4+ with `@opencode/plugin` 2.1.4; Node.js 18+ at runtime.
- The npm registry's `opencode-ralph-loop@1.0.10` is still the inherited V1 artifact. This fork has not published the V2 port; use the local tarball/wrapper flow in [README](README.md) for runtime checks.
- The package ships TypeScript source directly through `package.json` exports; there is no build step.

## Setup and checks

```bash
git clone https://github.com/BearingMe/opencode-goal
cd opencode-goal
npm install
npm run typecheck
npm test
```

Tests require Node.js 20+. CI runs typecheck and tests on Node.js 20 and 22.

## Layout

- `src/` — V2 plugin entry, registration adapters, loop state machine, and project-local state.
- `skills/` — packaged skill sources registered by the plugin; they are not copied globally.
- `tests/` — Vitest suite; `tests/setup.ts` isolates HOME.
- `docs/architecture.md` — module ownership and dependency boundaries.
- `.github/workflows/release.yml` — CI and inherited conditional release workflow.

## Pull requests

- Branch from `master`; keep each PR focused.
- Add or update tests for tool/command registration, state, events, completion, and failure behavior.
- Do not change package identity, version, remotes, or release configuration without maintainer approval. A higher version pushed to `master` can trigger the inherited publish/tag workflow.
- Match the existing style; do not add dependencies without a concrete need.

## Bug reports

Include OpenCode version, OS, reproduction steps, and relevant logs. Redact prompts, secrets, and credentials.

## License

MIT — by contributing you agree your changes are licensed the same.
