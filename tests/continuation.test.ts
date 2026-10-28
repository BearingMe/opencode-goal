import { describe, expect, it, vi } from "vitest";
import type { Plugin } from "@opencode/plugin";
import { continueLoopOnIdle } from "../src/continuation.ts";
import { LoopEventError, subscribeLoopEvents, type IdleLoopContext } from "../src/events.ts";
import { cancelLoop, startLoop } from "../src/loop.ts";
import { type RalphState, type StateStore } from "../src/state.ts";

const directory = "C:/projects/continuation";
const sessionID = "ses_continuation";

class MemoryStateStore implements StateStore {
  state: RalphState | undefined;
  writes = 0;
  clears = 0;
  failWriteAt?: number;

  read(): RalphState {
    return this.state ? { ...this.state } : { active: false, iteration: 0, maxIterations: 100 };
  }

  write(_directory: string, state: RalphState): void {
    this.writes += 1;
    if (this.writes === this.failWriteAt) throw new Error("disk is unavailable");
    this.state = { ...state };
  }

  clear(): boolean {
    this.clears += 1;
    this.state = undefined;
    return true;
  }
}

function activeState(overrides: Partial<RalphState> = {}): RalphState {
  return {
    active: true,
    iteration: 0,
    maxIterations: 4,
    sessionId: sessionID,
    prompt: "Build a useful feature",
    ...overrides,
  };
}

function idleContext(overrides: Partial<IdleLoopContext> = {}): IdleLoopContext {
  return {
    eventID: "evt_idle_1",
    created: 1,
    sessionID,
    directory,
    state: activeState(),
    ...overrides,
  };
}

function assistant(text: string) {
  return {
    id: "msg_assistant",
    time: { created: 1 },
    type: "assistant",
    agent: "build",
    model: { providerID: "test", id: "model" },
    content: [{ type: "text", text }],
  };
}

function context(
  messages: unknown[] = [assistant("Still working")],
  prompt: (...args: unknown[]) => Promise<unknown> = async () => ({ id: "inbox_1" }),
) {
  const sessionContext = vi.fn(async () => messages);
  const sessionPrompt = vi.fn(prompt);
  const ctx = {
    session: {
      context: sessionContext,
      prompt: sessionPrompt,
    },
  } as unknown as Plugin.Context;
  return { ctx, sessionContext, sessionPrompt };
}

describe("continueLoopOnIdle", () => {
  it("clears state when the latest assistant response contains the completion marker", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    const { ctx, sessionPrompt } = context([assistant("Done. <promise>DONE</promise>")]);

    await continueLoopOnIdle(ctx, idleContext(), new AbortController().signal, store);

    expect(store.state).toBeUndefined();
    expect(store.clears).toBe(1);
    expect(sessionPrompt).not.toHaveBeenCalled();
  });

  it("does not continue when the completion context cannot be checked", async () => {
    const store = new MemoryStateStore();
    const original = activeState();
    store.state = original;
    const lookupError = new Error("provider response must not be surfaced");
    const { ctx, sessionContext, sessionPrompt } = context();
    sessionContext.mockRejectedValue(lookupError);

    await expect(
      continueLoopOnIdle(ctx, idleContext(), new AbortController().signal, store),
    ).rejects.toMatchObject({
      name: "LoopEventError",
      message: "Could not check Ralph Loop completion; no continuation was submitted and no iteration was consumed. A later idle event can retry the check.",
      cause: lookupError,
    });
    expect(store.state).toMatchObject({
      ...original,
      sessionId: sessionID,
      loopID: expect.any(String),
    });
    expect(store.state?.continuationBlocked).toBeUndefined();
    expect(store.state?.pendingRequestID).toBeUndefined();
    expect(sessionPrompt).not.toHaveBeenCalled();
  });

  it("reports completion-cleanup failures without submitting a continuation", async () => {
    const baseStore = new MemoryStateStore();
    baseStore.state = activeState();
    const deleteError = new Error("state file is not writable");
    const store: StateStore = {
      read: () => baseStore.read(),
      write: (path, state) => baseStore.write(path, state),
      clear: () => {
        throw deleteError;
      },
    };
    const { ctx, sessionPrompt } = context([assistant("<promise>DONE</promise>")]);

    await expect(
      continueLoopOnIdle(ctx, idleContext(), new AbortController().signal, store),
    ).rejects.toBe(deleteError);
    expect(baseStore.state).toMatchObject({ active: true, iteration: 0 });
    expect(sessionPrompt).not.toHaveBeenCalled();
  });

  it("clears state at the iteration limit without submitting another prompt", async () => {
    const store = new MemoryStateStore();
    const atLimit = activeState({ iteration: 4, maxIterations: 4 });
    store.state = atLimit;
    const { ctx, sessionContext, sessionPrompt } = context();

    await continueLoopOnIdle(
      ctx,
      idleContext({ state: atLimit }),
      new AbortController().signal,
      store,
    );

    expect(store.state).toBeUndefined();
    expect(store.clears).toBe(1);
    expect(sessionContext).not.toHaveBeenCalled();
    expect(sessionPrompt).not.toHaveBeenCalled();
  });

  it("reserves an iteration, binds legacy state, and submits one queued continuation", async () => {
    const store = new MemoryStateStore();
    const legacyState = activeState({ iteration: 1, sessionId: undefined });
    store.state = legacyState;
    const { ctx, sessionContext, sessionPrompt } = context();
    const signal = new AbortController().signal;

    await continueLoopOnIdle(
      ctx,
      idleContext({ eventID: "evt_continue", state: legacyState }),
      signal,
      store,
    );

    expect(sessionContext).toHaveBeenCalledWith(
      { sessionID },
      { signal: expect.any(AbortSignal) },
    );
    expect(sessionPrompt).toHaveBeenCalledOnce();
    expect(sessionPrompt).toHaveBeenCalledWith(
      {
        sessionID,
        delivery: "queue",
        text: expect.stringContaining("[RALPH LOOP - ITERATION 2/4]"),
      },
      { signal: expect.any(AbortSignal) },
    );
    expect(sessionPrompt.mock.calls[0][0]).toMatchObject({
      text: expect.stringContaining("Original task:\nBuild a useful feature"),
    });
    expect(store.state).toMatchObject({ active: true, iteration: 2, sessionId: sessionID });
  });

  it("keeps the reserved iteration and blocks after uncertain prompt admission", async () => {
    const store = new MemoryStateStore();
    const original = activeState();
    store.state = original;
    const promptError = new Error("raw provider details must remain private");
    const { ctx, sessionPrompt } = context([], async () => {
      throw promptError;
    });

    await expect(
      continueLoopOnIdle(ctx, idleContext(), new AbortController().signal, store),
    ).rejects.toMatchObject({
      name: "LoopEventError",
      message: "Continuation prompt admission failed; its iteration remains reserved and the loop is blocked. Cancel and restart before retrying.",
      cause: promptError,
    });
    expect(store.state).toMatchObject({
      ...original,
      iteration: 1,
      loopID: expect.any(String),
      lastIdleEventID: "evt_idle_1",
      continuationBlocked: true,
    });
    expect(store.writes).toBe(2);
    expect(sessionPrompt).toHaveBeenCalledOnce();

    const retry = context();
    const blockedState = store.state!;
    await expect(
      continueLoopOnIdle(
        retry.ctx,
        idleContext({ eventID: "evt_retry", created: 2, state: blockedState }),
        new AbortController().signal,
        store,
      ),
    ).rejects.toMatchObject({
      message: expect.stringContaining("previous continuation request is still pending"),
    });
    expect(retry.sessionPrompt).not.toHaveBeenCalled();
  });

  it("keeps an interrupted prompt reservation and surfaces its uncertain admission", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    const controller = new AbortController();
    const { ctx, sessionPrompt } = context([], (_input, options) =>
      new Promise((_resolve, reject) => {
        options && (options as { signal?: AbortSignal }).signal?.addEventListener(
          "abort",
          () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })),
          { once: true },
        );
      }),
    );
    const continuation = continueLoopOnIdle(ctx, idleContext(), controller.signal, store);
    await vi.waitFor(() => expect(sessionPrompt).toHaveBeenCalledOnce());
    controller.abort();

    await expect(continuation).rejects.toMatchObject({
      name: "LoopEventError",
      message: "Continuation admission was interrupted; its iteration remains reserved and the loop is blocked. Cancel and restart before retrying.",
    });
    expect(store.state).toMatchObject({
      iteration: 1,
      sessionId: sessionID,
      continuationBlocked: true,
    });
  });

  it("does not submit a prompt when iteration reservation persistence fails", async () => {
    const store = new MemoryStateStore();
    const original = activeState();
    store.state = original;
    store.failWriteAt = 2;
    const { ctx, sessionContext, sessionPrompt } = context();

    await expect(
      continueLoopOnIdle(
        ctx,
        idleContext({ state: original }),
        new AbortController().signal,
        store,
      ),
    ).rejects.toThrow("disk is unavailable");
    expect(store.state).toMatchObject({
      ...original,
      sessionId: sessionID,
      loopID: expect.any(String),
      pendingIdleEventID: "evt_idle_1",
      pendingIdleEventCreated: 1,
      pendingRequestID: expect.any(String),
    });
    expect(sessionContext).toHaveBeenCalledOnce();
    expect(sessionPrompt).not.toHaveBeenCalled();
  });

  it("does not call the session API when the pending-request write fails", async () => {
    const store = new MemoryStateStore();
    const original = activeState();
    store.state = original;
    store.failWriteAt = 1;
    const { ctx, sessionContext, sessionPrompt } = context();

    await expect(
      continueLoopOnIdle(ctx, idleContext({ state: original }), new AbortController().signal, store),
    ).rejects.toThrow("disk is unavailable");

    expect(store.state).toEqual(original);
    expect(sessionContext).not.toHaveBeenCalled();
    expect(sessionPrompt).not.toHaveBeenCalled();
  });

  it("fails closed on a persisted request ID absent from this runtime", async () => {
    const store = new MemoryStateStore();
    const stale = activeState({
      loopID: "loop_after_reload",
      pendingIdleEventID: "evt_before_reload",
      pendingIdleEventCreated: 10,
      pendingRequestID: "request_from_previous_runtime",
    });
    store.state = stale;
    const { ctx, sessionContext, sessionPrompt } = context();

    await expect(
      continueLoopOnIdle(
        ctx,
        idleContext({ eventID: "evt_after_reload", created: 11, state: stale }),
        new AbortController().signal,
        store,
      ),
    ).rejects.toThrow("previous continuation request is still pending or its outcome is unknown");

    expect(store.state).toEqual(stale);
    expect(sessionContext).not.toHaveBeenCalled();
    expect(sessionPrompt).not.toHaveBeenCalled();
  });

  it("keeps the loop blocked if clearing the successful-admission marker fails", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    store.failWriteAt = 3;
    const { ctx, sessionPrompt } = context();

    await expect(
      continueLoopOnIdle(ctx, idleContext(), new AbortController().signal, store),
    ).rejects.toThrow("disk is unavailable");

    expect(sessionPrompt).toHaveBeenCalledOnce();
    expect(store.state).toMatchObject({
      iteration: 1,
      lastIdleEventID: "evt_idle_1",
      continuationBlocked: true,
    });
  });

  it("reports max-iteration cleanup failure without checking context", async () => {
    const baseStore = new MemoryStateStore();
    const atLimit = activeState({ iteration: 4, maxIterations: 4 });
    baseStore.state = atLimit;
    const deleteError = new Error("state file is not writable");
    const store: StateStore = {
      read: () => baseStore.read(),
      write: (_directory, state) => baseStore.write("", state),
      clear: () => {
        throw deleteError;
      },
    };
    const { ctx, sessionContext, sessionPrompt } = context();

    await expect(
      continueLoopOnIdle(
        ctx,
        idleContext({ state: atLimit }),
        new AbortController().signal,
        store,
      ),
    ).rejects.toBe(deleteError);

    expect(baseStore.state).toEqual(atLimit);
    expect(sessionContext).not.toHaveBeenCalled();
    expect(sessionPrompt).not.toHaveBeenCalled();
  });

  it("serializes cancellation after an already-admitted continuation", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    let resolvePrompt!: (value: unknown) => void;
    const promptResult = new Promise((resolve) => {
      resolvePrompt = resolve;
    });
    const { ctx, sessionPrompt } = context([], () => promptResult);
    const continuation = continueLoopOnIdle(ctx, idleContext(), new AbortController().signal, store);
    await vi.waitFor(() => expect(sessionPrompt).toHaveBeenCalledOnce());

    const cancelContext = {
      session: { get: async () => ({ location: { directory } }) },
    } as unknown as Plugin.Context;
    const cancellation = cancelLoop(cancelContext, sessionID, store);
    await vi.waitFor(() =>
      expect((sessionPrompt.mock.calls[0][1] as { signal?: AbortSignal }).signal?.aborted).toBe(true),
    );
    resolvePrompt({ id: "inbox_1" });

    await expect(continuation).rejects.toMatchObject({
      name: "LoopEventError",
      message: expect.stringContaining("admission completed during shutdown"),
    });
    await expect(cancellation).resolves.toBe("Ralph Loop cancelled after 1 iteration(s).");
    expect(store.state).toBeUndefined();
  });

  it("does not replace a loop while an aborted prompt admission is unsettled", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    let resolvePrompt!: (value: unknown) => void;
    const promptResult = new Promise((resolve) => {
      resolvePrompt = resolve;
    });
    const { ctx: baseContext, sessionPrompt } = context([], () => promptResult);
    const ctx = {
      ...baseContext,
      session: {
        ...baseContext.session,
        get: async () => ({ location: { directory } }),
      },
    } as unknown as Plugin.Context;
    const continuation = continueLoopOnIdle(ctx, idleContext(), new AbortController().signal, store);
    await vi.waitFor(() => expect(sessionPrompt).toHaveBeenCalledOnce());

    await expect(startLoop(ctx, sessionID, "new task", 3, store)).rejects.toThrow(
      "Cancel the blocked Ralph Loop before starting another",
    );
    expect(store.state).toMatchObject({ iteration: 1, continuationBlocked: true });

    resolvePrompt({ id: "inbox_1" });
    await expect(continuation).rejects.toMatchObject({
      name: "LoopEventError",
      message: expect.stringContaining("admission completed during shutdown"),
    });
  });

  it("serializes a cancellation that races with a new start", async () => {
    const store = new MemoryStateStore();
    const ctx = {
      session: { get: async () => ({ location: { directory } }) },
    } as unknown as Plugin.Context;

    const starting = startLoop(ctx, sessionID, "new task", 3, store);
    const cancelling = cancelLoop(ctx, sessionID, store);
    const [started, cancelled] = await Promise.all([starting, cancelling]);

    expect(started.content).toContain("Ralph Loop started");
    expect(cancelled).toBe("Ralph Loop cancelled after 0 iteration(s).");
    expect(store.state).toBeUndefined();
  });

  it("cancellation aborts an in-flight completion lookup before clearing state", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    const sessionContext = vi.fn(
      (_input: unknown, { signal }: { signal: AbortSignal }) =>
        new Promise<unknown[]>((_resolve, reject) => {
          signal.addEventListener(
            "abort",
            () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })),
            { once: true },
          );
        }),
    );
    const sessionPrompt = vi.fn();
    const ctx = {
      session: { context: sessionContext, prompt: sessionPrompt },
    } as unknown as Plugin.Context;
    const continuation = continueLoopOnIdle(ctx, idleContext(), new AbortController().signal, store);
    await vi.waitFor(() => expect(sessionContext).toHaveBeenCalledOnce());

    const cancelContext = {
      session: { get: async () => ({ location: { directory } }) },
    } as unknown as Plugin.Context;
    await expect(cancelLoop(cancelContext, sessionID, store)).resolves.toBe(
      "Ralph Loop cancelled after 0 iteration(s).",
    );
    await expect(continuation).resolves.toBeUndefined();

    expect(sessionPrompt).not.toHaveBeenCalled();
    expect(store.state).toBeUndefined();
  });

  it("keeps an aborted but unsettled completion request registered", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    let resolveContext!: (messages: unknown[]) => void;
    const contextResult = new Promise<unknown[]>((resolve) => {
      resolveContext = resolve;
    });
    const firstContext = vi.fn(() => contextResult);
    const firstPrompt = vi.fn(async () => ({ id: "inbox_1" }));
    const first = {
      ctx: {
        session: { context: firstContext, prompt: firstPrompt },
      } as unknown as Plugin.Context,
      sessionContext: firstContext,
      sessionPrompt: firstPrompt,
    };
    const controller = new AbortController();
    const firstContinuation = continueLoopOnIdle(
      first.ctx,
      idleContext(),
      controller.signal,
      store,
    );
    await vi.waitFor(() => expect(first.sessionContext).toHaveBeenCalledOnce());
    controller.abort();

    const pending = store.state!;
    const second = context();
    await continueLoopOnIdle(
      second.ctx,
      idleContext({ eventID: "evt_after_abort", created: 2, state: pending }),
      new AbortController().signal,
      store,
    );

    expect(second.sessionContext).not.toHaveBeenCalled();
    expect(second.sessionPrompt).not.toHaveBeenCalled();
    resolveContext([assistant("Still working")]);
    await expect(firstContinuation).resolves.toBeUndefined();
    expect(store.state).toMatchObject({ active: true, iteration: 0 });
    expect(store.state?.pendingRequestID).toBeUndefined();
  });

  it("does not wait indefinitely for an abort-ignorant request during plugin cleanup", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    let resolveContext!: (messages: unknown[]) => void;
    const contextResult = new Promise<unknown[]>((resolve) => {
      resolveContext = resolve;
    });
    const sessionContext = vi.fn(() => contextResult);
    const sessionPrompt = vi.fn(async () => ({ id: "inbox_1" }));
    const event = {
      id: "evt_cleanup_pending",
      created: 1,
      type: "session.idle",
      data: { sessionID },
      location: { directory },
    };
    const ctx = {
      session: { context: sessionContext, prompt: sessionPrompt },
      event: {
        subscribe: () =>
          (async function* () {
            yield event;
          })(),
      },
    } as unknown as Plugin.Context;
    const cleanup = subscribeLoopEvents(ctx, {
      store,
      onIdle: (idle, signal) => continueLoopOnIdle(ctx, idle, signal, store),
    });
    await vi.waitFor(() => expect(sessionContext).toHaveBeenCalledOnce());

    await expect(cleanup()).resolves.toBeUndefined();
    expect(store.state?.pendingRequestID).toEqual(expect.any(String));
    resolveContext([assistant("Still working")]);
    await vi.waitFor(() => expect(store.state?.pendingRequestID).toBeUndefined());

    expect(sessionPrompt).not.toHaveBeenCalled();
  });

  it("admits at most one continuation for a repeated idle event ID", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    const duplicateIdle = {
      id: "evt_duplicate_idle",
      created: 1,
      type: "session.idle",
      data: { sessionID },
      location: { directory },
    };
    const sessionContext = vi.fn(async () => [assistant("Still working")]);
    const sessionPrompt = vi.fn(async () => ({ id: "inbox_1" }));
    const ctx = {
      session: { context: sessionContext, prompt: sessionPrompt },
      event: {
        subscribe: () =>
          (async function* () {
            yield duplicateIdle;
            yield duplicateIdle;
          })(),
      },
    } as unknown as Plugin.Context;
    const onError = vi.fn();
    const cleanup = subscribeLoopEvents(ctx, {
      store,
      onIdle: (idle, signal) => continueLoopOnIdle(ctx, idle, signal, store),
      onError,
    });

    await vi.waitFor(() => expect(sessionPrompt).toHaveBeenCalledOnce());
    await cleanup();

    expect(sessionContext).toHaveBeenCalledOnce();
    expect(sessionPrompt).toHaveBeenCalledOnce();
    expect(store.state).toMatchObject({ iteration: 1, sessionId: sessionID });
    expect(onError).not.toHaveBeenCalled();
  });

  it("ignores an idle event replayed after its event ID was persisted", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    const first = context();
    const eventID = "evt_persisted_once";
    await continueLoopOnIdle(
      first.ctx,
      idleContext({ eventID }),
      new AbortController().signal,
      store,
    );
    const replay = context();

    await continueLoopOnIdle(
      replay.ctx,
      idleContext({ eventID, state: store.state! }),
      new AbortController().signal,
      store,
    );

    expect(first.sessionPrompt).toHaveBeenCalledOnce();
    expect(replay.sessionContext).not.toHaveBeenCalled();
    expect(replay.sessionPrompt).not.toHaveBeenCalled();
    expect(store.state).toMatchObject({ iteration: 1, lastIdleEventID: eventID });
  });

  it("does not let an idle snapshot from an older loop advance a restarted loop", async () => {
    const store = new MemoryStateStore();
    const oldState = activeState();
    store.state = oldState;
    const ctx = {
      session: {
        get: async () => ({ location: { directory } }),
        context: vi.fn(async () => [assistant("Still working")]),
        prompt: vi.fn(async () => ({ id: "inbox_1" })),
      },
    } as unknown as Plugin.Context;
    await startLoop(ctx, sessionID, "replacement task", 3, store);

    await continueLoopOnIdle(
      ctx,
      idleContext({ eventID: "evt_from_old_loop", state: oldState }),
      new AbortController().signal,
      store,
    );

    expect(ctx.session.context).not.toHaveBeenCalled();
    expect(ctx.session.prompt).not.toHaveBeenCalled();
    expect(store.state).toMatchObject({
      active: true,
      iteration: 0,
      sessionId: sessionID,
      loopID: expect.any(String),
      prompt: "replacement task",
    });
  });

  it("ignores an idle event created before the current loop started", async () => {
    const store = new MemoryStateStore();
    const current = activeState({ loopID: "loop_current", loopStartedAt: 500 });
    store.state = current;
    const { ctx, sessionContext, sessionPrompt } = context();

    await continueLoopOnIdle(
      ctx,
      idleContext({ eventID: "evt_before_start", created: 499, state: current }),
      new AbortController().signal,
      store,
    );

    expect(sessionContext).not.toHaveBeenCalled();
    expect(sessionPrompt).not.toHaveBeenCalled();
    expect(store.state).toEqual(current);
  });

  it("accepts a distinct idle event with the same millisecond timestamp", async () => {
    const store = new MemoryStateStore();
    const current = activeState({
      loopID: "loop_current",
      loopStartedAt: 500,
      lastIdleEventID: "evt_prior",
      lastIdleEventCreated: 500,
    });
    store.state = current;
    const { ctx, sessionPrompt } = context();

    await continueLoopOnIdle(
      ctx,
      idleContext({ eventID: "evt_equal_time", created: 500, state: current }),
      new AbortController().signal,
      store,
    );

    expect(sessionPrompt).toHaveBeenCalledOnce();
    expect(store.state).toMatchObject({ iteration: 1, lastIdleEventID: "evt_equal_time" });
  });

  it("a deleted-session event aborts its in-flight completion lookup", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    let resolveContextStarted!: () => void;
    const contextStarted = new Promise<void>((resolve) => {
      resolveContextStarted = resolve;
    });
    const sessionContext = vi.fn(
      (_input: unknown, { signal }: { signal: AbortSignal }) =>
        new Promise<unknown[]>((_resolve, reject) => {
          resolveContextStarted();
          signal.addEventListener(
            "abort",
            () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })),
            { once: true },
          );
        }),
    );
    const sessionPrompt = vi.fn();
    const events = [
      {
        id: "evt_idle_before_delete",
        created: 1,
        type: "session.idle",
        data: { sessionID },
        location: { directory },
      },
      {
        id: "evt_delete_during_lookup",
        created: 2,
        type: "session.deleted",
        data: { sessionID },
        location: { directory },
      },
    ];
    const ctx = {
      session: { context: sessionContext, prompt: sessionPrompt },
      event: {
        subscribe: () =>
          (async function* () {
            yield events[0];
            await contextStarted;
            yield events[1];
          })(),
      },
    } as unknown as Plugin.Context;
    const onError = vi.fn();
    const cleanup = subscribeLoopEvents(ctx, {
      store,
      onIdle: (idle, signal) => continueLoopOnIdle(ctx, idle, signal, store),
      onError,
    });

    await vi.waitFor(() => expect(sessionContext).toHaveBeenCalledOnce());
    await cleanup();
    await vi.waitFor(() => expect(store.state).toBeUndefined());

    expect(sessionContext).toHaveBeenCalledOnce();
    expect(sessionPrompt).not.toHaveBeenCalled();
    expect(store.state).toBeUndefined();
    expect(onError).not.toHaveBeenCalled();
  });

  it("aborts by session before a missing-location delete lookup fails", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    let resolveContextStarted!: () => void;
    const contextStarted = new Promise<void>((resolve) => {
      resolveContextStarted = resolve;
    });
    const sessionContext = vi.fn(
      (_input: unknown, { signal }: { signal: AbortSignal }) =>
        new Promise<unknown[]>((_resolve, reject) => {
          signal.addEventListener(
            "abort",
            () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })),
            { once: true },
          );
          resolveContextStarted();
        }),
    );
    const sessionPrompt = vi.fn();
    const sessionGet = vi.fn(async () => {
      throw new Error("deleted session is no longer available");
    });
    const ctx = {
      session: { context: sessionContext, prompt: sessionPrompt, get: sessionGet },
      event: {
        subscribe: () =>
          (async function* () {
            yield {
              id: "evt_idle_before_unlocated_delete",
              created: 1,
              type: "session.idle",
              data: { sessionID },
              location: { directory },
            };
            await contextStarted;
            yield {
              id: "evt_unlocated_delete",
              created: 2,
              type: "session.deleted",
              data: { sessionID },
            };
          })(),
      },
    } as unknown as Plugin.Context;
    const onError = vi.fn();
    const cleanup = subscribeLoopEvents(ctx, {
      store,
      onIdle: (idle, signal) => continueLoopOnIdle(ctx, idle, signal, store),
      onError,
    });

    await vi.waitFor(() => expect(sessionContext).toHaveBeenCalledOnce());
    await cleanup();
    await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());

    expect(sessionGet).toHaveBeenCalledWith({ sessionID });
    expect(sessionPrompt).not.toHaveBeenCalled();
    expect(store.state).toMatchObject({ active: true, sessionId: sessionID });
  });

  it("does not let an unrelated session cancel a bound loop", async () => {
    const store = new MemoryStateStore();
    store.state = activeState();
    const ctx = {
      session: { get: async () => ({ location: { directory } }) },
    } as unknown as Plugin.Context;

    await expect(cancelLoop(ctx, "ses_unrelated", store)).resolves.toBe(
      "No active Ralph Loop to cancel.",
    );
    expect(store.state).toMatchObject({ active: true, sessionId: sessionID });
    expect(store.clears).toBe(0);
  });
});
