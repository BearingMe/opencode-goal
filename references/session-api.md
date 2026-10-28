# V2 session and event API notes

Repository-specific summary of the V2 plugin contract. See the full [server plugin reference](opencode-v2/server-plugins.md), [plugin migration guide](opencode-v2/plugin-migrate-v1.md), and [API reference](opencode-v2/api.md) for authoritative details.

## Plugin context

V2 plugins are defined with `Plugin.define` from `@opencode/plugin`. `setup(ctx)` receives the plugin context; session operations are methods on `ctx.session`, not on the V1 `ctx.client` property. `ctx.location` describes where the plugin loaded, not every session/event it can access.

Relevant documented calls:

```ts
const session = await ctx.session.get({ sessionID })
const messages = await ctx.session.context({ sessionID })
await ctx.session.prompt({ sessionID, text: "Continue working on the task" })
await ctx.session.interrupt({ sessionID })
```

The `context` method returns active context messages after the last compaction. V2 message records use a `type` discriminator; assistant records expose `content` entries such as text and reasoning, rather than V1 `info.role` and `parts`. Confirm exact generated TypeScript types against the pinned SDK before implementing completion detection.

## Event subscription

V2 event consumption is an async subscription. Abort it in the cleanup function returned by `setup`:

```ts
const controller = new AbortController()

void (async () => {
  for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
    // Narrow on event.type and validate the event's session/location.
  }
})()

return () => controller.abort()
```

Pass a `types` filter when the event names are known. The plugin should process only relevant session events. Verify the exact event payload shapes in the SDK type definitions for the supported V2 release; do not infer them from V1 callbacks.

## HTTP contract versus plugin context

The public V2 HTTP API includes session prompt admission at `POST /api/session/{sessionID}/prompt`, active context at `GET /api/session/{sessionID}/context`, paginated messages at `GET /api/session/{sessionID}/message`, session lookup at `GET /api/session/{sessionID}`, and the event stream at `GET /api/event`.

The plugin context is the preferred interface inside a plugin. HTTP endpoint shapes are not interchangeable with plugin-context method signatures. In particular, the V1 call:

```ts
client.session.prompt({
  path: { id: sessionID },
  body: { parts: [{ type: "text", text }] },
})
```

becomes a V2 plugin-context call such as:

```ts
await ctx.session.prompt({ sessionID, text })
```

## Completion detection caveat

V1 currently scans session messages and tests the last assistant message for `<promise>DONE</promise>`. V2 `ctx.session.context` is explicitly the active context after the most recent compaction; it is not documented as complete historical message pagination. Before porting, verify that checking the latest assistant response from this method preserves the behavior. If full history is required, use a documented V2 plugin API or redesign detection around events rather than reaching for undocumented internals.

## Sources

- [V2 server plugins](https://opencode.ai/v2/docs/build/plugins/server#sessions)
- [V2 plugin migration](https://opencode.ai/v2/docs/build/plugins/migrate-v1)
- [V2 API reference](https://opencode.ai/v2/docs/api)
- [V2 OpenAPI document](https://opencode.ai/v2/openapi.json)
