import { describe, expect, it, vi } from "vitest";
import type { Plugin as OpenCodePlugin } from "@opencode/plugin";
import { subscribeLoopEvents } from "../src/events.ts";
import { type RalphState, type StateStore } from "../src/state.ts";

type TestEvent = {
  id: string;
  created: number;
  type: "session.idle" | "session.deleted" | "session.created";
  data: { sessionID: string };
  location?: { directory: string };
};

const inactiveState: RalphState = { active: false, iteration: 0, maxIterations: 100 };
let nextEventCreated = 0;

class MemoryStateStore implements StateStore {
  readonly states = new Map<string, RalphState>();
  readonly reads: string[] = [];
  readonly clears: string[] = [];
  onClear?: (directory: string) => void;

  read(directory: string): RalphState {
    this.reads.push(directory);
    return { ...(this.states.get(directory) ?? inactiveState) };
  }

  write(directory: string, state: RalphState): void {
    this.states.set(directory, { ...state });
  }

  clear(directory: string): boolean {
    this.clears.push(directory);
    this.states.delete(directory);
    this.onClear?.(directory);
    return true;
  }
}

function event(
  type: TestEvent["type"],
  sessionID: string,
  directory?: string,
  id = `evt_${type}_${sessionID}_${directory ?? "fallback"}`,
): TestEvent {
  return {
    id,
    created: ++nextEventCreated,
    type,
    data: { sessionID },
    ...(directory ? { location: { directory } } : {}),
  };
}

function createContext(
  events: TestEvent[],
  sessionDirectories: Record<string, string> = {},
) {
  let subscriptionOptions: { signal?: AbortSignal } | undefined;
  const sessionGet = vi.fn(async ({ sessionID }: { sessionID: string }) => {
    const directory = sessionDirectories[sessionID];
    if (!directory) throw new Error("Unexpected session lookup.");
    return { location: { directory } };
  });
  const context = {
    location: { directory: "C:/plugin-location" },
    session: { get: sessionGet },
    event: {
      subscribe(options: { signal?: AbortSignal }) {
        subscriptionOptions = options;
        return (async function* () {
          yield* events;
        })();
      },
    },
  } as unknown as OpenCodePlugin.Context;

  return {
    context,
    sessionGet,
    get subscriptionOptions() {
      return subscriptionOptions;
    },
  };
}

describe("V2 session event scoping", () => {
  it("filters the subscribed event stream and scopes changes to event session and project", async () => {
    const pluginDirectory = "C:/plugin-location";
    const projectA = "C:/projects/a";
    const projectB = "C:/projects/b";
    const store = new MemoryStateStore();
    store.states.set(pluginDirectory, {
      active: true,
      iteration: 1,
      maxIterations: 10,
      sessionId: "ses_a",
    });
    store.states.set(projectA, {
      active: true,
      iteration: 2,
      maxIterations: 10,
      sessionId: "ses_a",
    });
    store.states.set(projectB, {
      active: true,
      iteration: 3,
      maxIterations: 10,
      sessionId: "ses_b",
    });

    let resolveMatchingDelete!: () => void;
    const matchingDelete = new Promise<void>((resolve) => {
      resolveMatchingDelete = resolve;
    });
    store.onClear = (directory) => {
      if (directory === projectA) resolveMatchingDelete();
    };

    const setup = createContext(
      [
        event("session.created", "ses_a", projectA),
        event("session.idle", "ses_b", projectA),
        event("session.idle", "ses_a", projectB),
        event("session.idle", "ses_a"),
        event("session.deleted", "ses_b", projectA),
        event("session.deleted", "ses_a", projectB),
        event("session.deleted", "ses_a"),
      ],
      { ses_a: projectA, ses_b: projectB },
    );
    const onIdle = vi.fn();
    const onError = vi.fn();
    const cleanup = subscribeLoopEvents(setup.context, { store, onIdle, onError });

    expect(setup.subscriptionOptions?.signal?.aborted).toBe(false);
    await matchingDelete;
    await cleanup();

    expect(onIdle).toHaveBeenCalledOnce();
    expect(onIdle.mock.calls[0][0]).toMatchObject({
      sessionID: "ses_a",
      directory: projectA,
      eventID: expect.any(String),
      state: { active: true, sessionId: "ses_a" },
    });
    expect(onIdle.mock.calls[0][1]).toBeInstanceOf(AbortSignal);
    expect(store.clears).toEqual([projectA]);
    expect(store.states.get(projectB)?.sessionId).toBe("ses_b");
    expect(store.states.get(pluginDirectory)?.sessionId).toBe("ses_a");
    expect(setup.sessionGet).toHaveBeenCalledTimes(2);
    expect(onError).not.toHaveBeenCalled();
    expect(setup.subscriptionOptions?.signal?.aborted).toBe(true);
  });

  it("allows an unbound legacy loop to reach the first idle in its project", async () => {
    const project = "C:/projects/legacy";
    const store = new MemoryStateStore();
    const legacyState: RalphState = { active: true, iteration: 0, maxIterations: 5 };
    store.states.set(project, legacyState);
    const { context } = createContext([event("session.idle", "ses_first", project)]);
    const onIdle = vi.fn();
    const cleanup = subscribeLoopEvents(context, { store, onIdle });

    await vi.waitFor(() => expect(onIdle).toHaveBeenCalledOnce());
    await cleanup();

    expect(onIdle).toHaveBeenCalledWith(
      {
        eventID: expect.any(String),
        created: expect.any(Number),
        sessionID: "ses_first",
        directory: project,
        state: legacyState,
      },
      expect.anything(),
    );
    expect(onIdle.mock.calls[0][1]).toBeInstanceOf(AbortSignal);
  });

  it("uses the session project when an event has no location", async () => {
    const project = "C:/projects/no-event-location";
    const store = new MemoryStateStore();
    store.states.set(project, {
      active: true,
      iteration: 0,
      maxIterations: 5,
      sessionId: "ses_resolved",
    });
    const { context, sessionGet } = createContext(
      [event("session.idle", "ses_resolved")],
      { ses_resolved: project },
    );
    const onIdle = vi.fn();
    const cleanup = subscribeLoopEvents(context, { store, onIdle });

    await vi.waitFor(() => expect(onIdle).toHaveBeenCalledOnce());
    await cleanup();

    expect(sessionGet).toHaveBeenCalledWith({ sessionID: "ses_resolved" });
    expect(onIdle.mock.calls[0][0]).toMatchObject({ directory: project });
  });

  it("dispatches a repeated idle event ID only once", async () => {
    const project = "C:/projects/duplicate-idle";
    const store = new MemoryStateStore();
    store.states.set(project, {
      active: true,
      iteration: 0,
      maxIterations: 5,
      sessionId: "ses_duplicate",
    });
    const duplicate = event("session.idle", "ses_duplicate", project, "evt_duplicate");
    const { context } = createContext([duplicate, duplicate]);
    const onIdle = vi.fn();
    const cleanup = subscribeLoopEvents(context, { store, onIdle });

    await cleanup();

    expect(onIdle).toHaveBeenCalledOnce();
    expect(onIdle.mock.calls[0][0]).toMatchObject({ eventID: "evt_duplicate" });
  });

  it("aborts the iterator and absorbs abort rejection during cleanup", async () => {
    let streamSignal!: AbortSignal;
    const abortError = Object.assign(new Error("stream aborted"), { name: "AbortError" });
    const context = {
      location: { directory: "C:/plugin-location" },
      session: { get: vi.fn() },
      event: {
        subscribe({ signal }: { signal: AbortSignal }) {
          streamSignal = signal;
          return {
            [Symbol.asyncIterator]() {
              return {
                next: () =>
                  new Promise<IteratorResult<never>>((_resolve, reject) => {
                    signal.addEventListener(
                      "abort",
                      () => reject(abortError),
                      { once: true },
                    );
                  }),
              };
            },
          };
        },
      },
    } as unknown as OpenCodePlugin.Context;
    const onError = vi.fn();
    const cleanup = subscribeLoopEvents(context, { onError });

    await expect(cleanup()).resolves.toBeUndefined();

    expect(streamSignal.aborted).toBe(true);
    expect(onError).not.toHaveBeenCalled();
  });
});
