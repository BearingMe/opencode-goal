import type { Plugin } from "@opencode/plugin";
import {
  MalformedStateError,
  stateStore,
  StateFileError,
  type RalphState,
  type StateStore,
} from "./state.ts";
import {
  abortContinuationRequests,
  abortContinuationRequestsForSession,
} from "./continuation-control.ts";
import { withStateLock } from "./state-lock.ts";

type SessionLifecycleEvent = {
  id: string;
  created: number;
  type: "session.idle" | "session.deleted";
  data: { sessionID: string };
  location?: { directory: string };
};

export interface IdleLoopContext {
  eventID: string;
  created: number;
  sessionID: string;
  directory: string;
  state: RalphState;
}

export interface LoopEventOptions {
  store?: StateStore;
  onIdle?: (context: IdleLoopContext, signal: AbortSignal) => void | Promise<void>;
  onError?: (eventType: string, error: unknown) => void;
}

export class LoopEventError extends Error {
  constructor(message: string, cause: unknown) {
    super(message, { cause });
    this.name = "LoopEventError";
  }
}

export function subscribeLoopEvents(
  ctx: Plugin.Context,
  options: LoopEventOptions = {},
): () => Promise<void> {
  const controller = new AbortController();
  const store = options.store ?? stateStore;
  const consume = consumeLoopEvents(ctx, controller, store, options);

  return async () => {
    controller.abort();
    await consume;
  };
}

async function consumeLoopEvents(
  ctx: Plugin.Context,
  controller: AbortController,
  store: StateStore,
  options: LoopEventOptions,
): Promise<void> {
  const pendingIdleEventIDs = new Set<string>();
  try {
    for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
      if (event.type === "session.idle") {
        if (
          !options.onIdle ||
          pendingIdleEventIDs.has(event.id)
        ) {
          continue;
        }
        pendingIdleEventIDs.add(event.id);
        void handleIdle(
          ctx,
          event,
          store,
          options.onIdle,
          controller.signal,
        )
          .catch((error) => reportError(options, event.type, error))
          .finally(() => pendingIdleEventIDs.delete(event.id));
        continue;
      }

      if (event.type === "session.deleted") {
        void handleDeleted(ctx, event, store).catch((error) =>
          reportError(options, event.type, error),
        );
      }
    }
  } catch (error) {
    if (!controller.signal.aborted) reportError(options, "subscription", error);
  }
}

async function handleIdle(
  ctx: Plugin.Context,
  event: SessionLifecycleEvent & { type: "session.idle" },
  store: StateStore,
  onIdle: NonNullable<LoopEventOptions["onIdle"]>,
  signal: AbortSignal,
): Promise<void> {
  const directory = await getEventSessionDirectory(ctx, event);
  const state = store.read(directory);
  if (!state.active || (state.sessionId !== undefined && state.sessionId !== event.data.sessionID)) {
    return;
  }
  if (state.lastIdleEventID === event.id) return;
  if (state.loopStartedAt !== undefined && event.created < state.loopStartedAt) return;
  if (
    state.lastIdleEventCreated !== undefined &&
    event.created < state.lastIdleEventCreated
  ) {
    return;
  }

  await onIdle(
    { eventID: event.id, created: event.created, sessionID: event.data.sessionID, directory, state },
    signal,
  );
}

async function handleDeleted(
  ctx: Plugin.Context,
  event: SessionLifecycleEvent & { type: "session.deleted" },
  store: StateStore,
): Promise<void> {
  abortContinuationRequestsForSession(event.data.sessionID);
  const directory = await getEventSessionDirectory(ctx, event);
  abortContinuationRequests(directory, event.data.sessionID);
  await withStateLock(directory, () => {
    const state = store.read(directory);
    if (!state.active || state.sessionId !== event.data.sessionID) return;

    store.clear(directory);
  });
}

async function getEventSessionDirectory(
  ctx: Plugin.Context,
  event: SessionLifecycleEvent,
): Promise<string> {
  if (event.location?.directory) return event.location.directory;
  const session = await ctx.session.get({ sessionID: event.data.sessionID });
  return session.location.directory;
}

function reportError(
  options: LoopEventOptions,
  eventType: string,
  error: unknown,
): void {
  if (options.onError) {
    options.onError(eventType, error);
    return;
  }

  const message =
    error instanceof StateFileError ||
    error instanceof MalformedStateError ||
    error instanceof LoopEventError
      ? error.message
      : eventType === "subscription"
        ? "Ralph Loop event subscription failed."
        : "Ralph Loop could not process a session event.";
  console.error(`[opencode-ralph-loop] ${eventType}: ${message}`);
}
