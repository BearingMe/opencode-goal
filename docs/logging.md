# Logging

## Current state

The plugin has no logging abstraction. The event boundary reports caught lifecycle errors with `console.error`; tool and state failures propagate to OpenCode. It emits no debug or per-iteration logs. V1 migration logging examples below are historical, not runtime behavior.

## Rules for changes

- Use the logging API documented for the plugin API version being changed. The V1 migration example uses `client.app.log({ body: { service, level, message } })`; the V2 plugin examples use `console` calls. Do not carry a V1 logger into V2 or infer that `ctx.app.version` implies a V2 `ctx.app.log` method. Verify the pinned SDK/API and where its output appears.
- Keep debug output opt-in or at a debug level accepted by the pinned SDK. Do not add per-event/per-iteration noise by default, and do not invent an undocumented environment variable or configuration option.
- Log state transitions and actionable failures: operation, outcome, and only the non-sensitive context needed to diagnose them. Avoid logging the task prompt, assistant output, file contents, credentials, tokens, environment values, or full absolute paths.
- Log an error once at the boundary that can recover or report it. Lower-level helpers should preserve or throw the error rather than logging and continuing as if successful.
- Use concise, stable messages. Do not expose stack traces or raw provider/API errors to the user; retain sanitized diagnostic detail in the supported runtime log.
- Logging must not change loop state, swallow failures, or trigger retries.

## Before adding logs

Confirm the target OpenCode/plugin version, supported levels, log destination, and whether the information is safe to retain. Add tests for any debug toggle or redaction behavior.
