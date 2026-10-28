# Error handling

## Legacy V1 behavior

The current V1 implementation favors keeping failures out of the TUI by swallowing them. This is inherited behavior and can report success while losing loop state:

| Operation | Current failure behavior | Risk |
| --- | --- | --- |
| Skill copy | Ignores copy errors | A skill may be unavailable with no diagnostic |
| State read | Catches errors and returns inactive defaults | An active loop can appear absent |
| State write / clear | Ignores file errors | Start, cancel, or completion can appear successful when persistence failed |
| Completion check | Treats API errors as “not complete” | An inspection failure can cause an unnecessary continuation |
| Continuation prompt | Ignores API errors after incrementing iteration | The loop can advance without a prompt being accepted |

## V2 state-file policy

- Only `ENOENT` means no state; other read failures throw `StateFileError` with operation and cause.
- An existing state file with missing framing, no recognized fields, duplicate fields, or invalid known values throws `MalformedStateError`; it is never treated as inactive.
- Valid partial frontmatter remains readable with defaults for omitted fields. Windows CRLF and UTF-8 BOM are supported.
- Write and delete failures throw `StateFileError`; deleting an absent file is idempotent. Start/cancel actions report success only after required state operations succeed.
- Completion cleanup must use the same state operations; M7 verifies that path with the V2 state machine.

## Rules for changes

- Never add an empty `catch` or discard an error without an explicit, safe recovery path.
- Catch at an operation boundary that can recover or give the user a useful result. Otherwise let the error reach OpenCode's plugin/tool error handling.
- Distinguish **no state**, **state could not be read**, **task incomplete**, and **completion could not be checked**. Unknown state/API outcomes are not proof that a loop is inactive or incomplete.
- Do not claim that a loop started, was cancelled, or completed until the required state-file operation succeeds. Treat deleting an already-absent state file as idempotent; report other delete failures.
- If completion cannot be checked, do not automatically continue as if it were checked and incomplete. Surface a diagnostic and use a bounded, explicit recovery policy.
- Keep iteration and session state consistent with prompt admission. A failed prompt must not silently consume an iteration or leave the loop in an unrecoverable state.
- Do not retry non-idempotent prompt submissions unless duplicate admission is prevented. Any retry policy must be bounded and cancellation-aware.
- Normalize caught values as `unknown`; preserve the cause for diagnostics. User-facing errors should say what failed and what can be tried next, without exposing prompts, secrets, stack traces, or raw provider responses.
- Test failure paths for filesystem reads/writes/deletes, message lookup, continuation admission, and cancellation. Assert both the returned error/result and persisted state.

## Remaining V2 work

Completion lookup, continuation admission, and cancellation races remain for M7. Verify those paths against the pinned `@opencode/plugin` contract; do not translate V1 catch behavior mechanically. See [`references/opencode-v2/plugin-migrate-v1.md`](../references/opencode-v2/plugin-migrate-v1.md).
