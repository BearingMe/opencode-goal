# OpenCode V2 references

Official OpenCode documentation snapshots and repository-specific migration notes for the V2 plugin port.

**Snapshot date:** 2026-10-28. Sources are live documentation and may change; verify them against the linked pages before relying on API details. Markdown pages were extracted from the official V2 documentation with Defuddle. OpenCode documentation is authoritative; `migration-map.md` and `session-api.md` are analysis for this repository.

## Sources

| File | Official source | Scope |
| --- | --- | --- |
| [`opencode-v2/migrate-v1.md`](opencode-v2/migrate-v1.md) | [V1 to V2 migration](https://opencode.ai/v2/docs/migrate-v1) | Overall compatibility and migration policy |
| [`opencode-v2/plugin-migrate-v1.md`](opencode-v2/plugin-migrate-v1.md) | [Plugin migration](https://opencode.ai/v2/docs/build/plugins/migrate-v1) | Entrypoints, context, hooks, tools, events, storage |
| [`opencode-v2/plugins.md`](opencode-v2/plugins.md) | [Build plugins](https://opencode.ai/v2/docs/build/plugins) | Plugin parts, package exports, loading, publishing |
| [`opencode-v2/server-plugins.md`](opencode-v2/server-plugins.md) | [Server plugins](https://opencode.ai/v2/docs/build/plugins/server) | Server context, transforms, commands, sessions, tools, events |
| [`opencode-v2/plugin-loading.md`](opencode-v2/plugin-loading.md) | [Configure plugins](https://opencode.ai/v2/docs/plugins) | Plugin configuration and discovery |
| [`opencode-v2/commands.md`](opencode-v2/commands.md) | [Commands](https://opencode.ai/v2/docs/commands) | Command definition, execution, arguments, precedence |
| [`opencode-v2/skills.md`](opencode-v2/skills.md) | [Skills](https://opencode.ai/v2/docs/skills) | Skill files, discovery, transforms, precedence |
| [`opencode-v2/configuration.md`](opencode-v2/configuration.md) | [Configuration](https://opencode.ai/v2/docs/config) | Config locations and native V2 fields |
| [`opencode-v2/api.md`](opencode-v2/api.md) | [API](https://opencode.ai/v2/docs/api) | Server API overview and reference |

## Repository analysis

- [`migration-map.md`](migration-map.md) maps the current plugin to V2 APIs and lists migration decisions.
- [`session-api.md`](session-api.md) summarizes the V2 session/event behavior relevant to this plugin, including compatibility risks.

## Refreshing snapshots

Re-fetch the linked `/v2/docs/` pages before a migration or release. Preserve source URLs, retrieval date, and any behavior-affecting changes. Do not treat a snapshot as current if the live docs disagree.
