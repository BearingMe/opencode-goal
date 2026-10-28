# opencode-ralph-loop

[![CI](https://github.com/BearingMe/opencode-goal/actions/workflows/release.yml/badge.svg)](https://github.com/BearingMe/opencode-goal/actions/workflows/release.yml)
[![npm version](https://img.shields.io/npm/v/opencode-ralph-loop.svg)](https://www.npmjs.com/package/opencode-ralph-loop)

> This checkout is the `BearingMe/opencode-goal` fork. The npm badge follows the upstream package and does not indicate that this fork's V2 port has been published.

Minimal Ralph Loop plugin for [opencode](https://opencode.ai) - auto-continues until task completion.

Inspired by Anthropic's Ralph Wiggum technique for iterative, self-referential AI development loops.

## Why this plugin?

[oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) is a fantastic, feature-rich plugin that includes Ralph Loop along with many other powerful capabilities like the Sisyphus orchestrator, background agents, and more.

However, we personally found the full suite a bit heavy for our workflow. We also noticed others in the community expressing interest in specific features without needing the complete package. So we extracted just the Ralph Loop functionality into this standalone, lightweight plugin.

If you want the full-featured experience, definitely check out oh-my-opencode. If you just want auto-continuation loops with minimal overhead, this plugin is for you.

## Support and release status

- This source supports OpenCode V2 **2.1.4 or later** and pins `@opencode/plugin` 2.1.4. V1 is not supported. Runtime requires Node.js 18 or later; tests require Node.js 20 or later.
- As of 2026-10-28, npm's `opencode-ralph-loop@1.0.10` is the inherited V1 artifact (`main` entrypoint and `@opencode-ai/plugin` peer dependency). This fork has not published its V2 port. Do not install the npm registry version for V2.

## Installation

### Try the current V2 source

Pack the V2 source from this checkout, install that tarball in your OpenCode project, then add a local plugin wrapper:

```sh
# In this checkout
npm install
npm pack

# In the OpenCode project; use the path to the tarball created above
npm install --prefix /path/to/project /path/to/opencode-ralph-loop-1.0.10.tgz
```

Create `.opencode/plugins/ralph-loop.ts` in the OpenCode project:

```ts
export { default } from "opencode-ralph-loop";
```

OpenCode 2.1.4 loads this local plugin file and its installed package. This tarball-and-wrapper path was smoke-tested; no provider request is needed for setup. Once a V2-compatible release is published, OpenCode can also load the package by adding `"opencode-ralph-loop"` to the `"plugins"` array in `opencode.json(c)`.

## Usage

### Start a loop

```
/ralph-loop "Build a REST API with authentication"
```

The command starts a loop in the current session with a 100-iteration default. The registered `ralph-loop` tool also accepts a custom `maxIterations`.

### Cancel a loop

```
/cancel-ralph
```

### Get help

```
/help
```

## How it works

1. `/ralph-loop` stores the task and session ID in `.opencode/ralph-loop.local.md`.
2. On `session.idle`, the plugin checks the latest assistant text in the active session context for `<promise>DONE</promise>`.
3. If incomplete, it reserves one iteration and queues one continuation prompt.
4. Completion or the iteration limit clears state; prompt-admission uncertainty keeps the iteration reserved and blocks automatic retries.

### Completion Promise

When the AI finishes a task, it outputs:

```
<promise>DONE</promise>
```

**Important:** The AI should ONLY output this when the task is COMPLETELY and VERIFIABLY finished. False promises are not allowed.

## State File

The loop state is stored in your project directory:

```
.opencode/ralph-loop.local.md
```

Format (markdown with YAML frontmatter):

```markdown
---
active: true
iteration: 3
maxIterations: 100
sessionId: ses_abc123
---

Your original task prompt
```

The file can contain the original task prompt. Add `.opencode/ralph-loop.local.md` to `.gitignore`.

## Operational limits

- Use one OpenCode runtime per project; state locks and request tracking are process-local.
- Cancellation stops future loop continuations but cannot retract a prompt OpenCode already admitted.
- If prompt admission remains unsettled, cancel the loop; restart OpenCode before starting another loop if the request never settles.
- Existing commands with the same IDs are left untouched. Skills are registered by the plugin and are not copied to a global directory.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for module ownership and dependency boundaries.

## Contributing

PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Releases

The inherited release workflow can publish to npm and create a GitHub release when a higher package version is pushed to `master`. This fork's Git remote and package publishing metadata still point to different projects; no V2 package has been published. See [`docs/guardrails.md`](docs/guardrails.md) before any release or version change.

## Credits

- Inspired by [Anthropic's Ralph Wiggum](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum) plugin for Claude Code
- Implementation pattern from [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)

## License

MIT
