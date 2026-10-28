import { randomUUID } from "node:crypto";
import type { Plugin } from "@opencode/plugin";
import { hasCompletionPromise } from "./completion.ts";
import {
  isContinuationRequestActive,
  markContinuationAdmissionStarted,
  registerContinuationRequest,
} from "./continuation-control.ts";
import { LoopEventError, type IdleLoopContext } from "./events.ts";
import { stateStore, type RalphState, type StateStore } from "./state.ts";
import { withStateLock } from "./state-lock.ts";

export async function continueLoopOnIdle(
  ctx: Plugin.Context,
  idle: IdleLoopContext,
  signal: AbortSignal,
  store: StateStore = stateStore,
): Promise<void> {
  const requestID = randomUUID();
  const controller = new AbortController();
  const abortFromParent = () => controller.abort();
  signal.addEventListener("abort", abortFromParent, { once: true });
  if (signal.aborted) controller.abort();
  const unregister = registerContinuationRequest(
    idle.directory,
    idle.sessionID,
    requestID,
    controller,
  );

  try {
    const pendingState = await withStateLock(idle.directory, () => {
      if (controller.signal.aborted) return;

      let current = store.read(idle.directory);
      if (!sameLoopSnapshot(current, idle.state)) return;
      if (!current.active || (current.sessionId !== undefined && current.sessionId !== idle.sessionID)) {
        return;
      }
      if (current.pendingRequestID) {
        if (
          isContinuationRequestActive(
            idle.directory,
            current.sessionId ?? idle.sessionID,
            current.pendingRequestID,
          )
        ) {
          return;
        }
        throw new LoopEventError(
          "A previous continuation request is still pending or its outcome is unknown; cancel and restart the loop before retrying.",
          undefined,
        );
      }
      if (current.continuationBlocked) {
        throw new LoopEventError(
          "Ralph Loop continuation is blocked after uncertain prompt admission; cancel and restart the loop before retrying.",
          undefined,
        );
      }
      if (current.lastIdleEventID === idle.eventID) return;
      if (current.loopStartedAt !== undefined && idle.created < current.loopStartedAt) return;
      if (
        current.lastIdleEventCreated !== undefined &&
        idle.created < current.lastIdleEventCreated
      ) {
        return;
      }
      if (current.iteration >= current.maxIterations) {
        store.clear(idle.directory);
        return;
      }

      const pending: RalphState = {
        ...current,
        sessionId: idle.sessionID,
        loopID: current.loopID ?? randomUUID(),
        pendingIdleEventID: idle.eventID,
        pendingIdleEventCreated: idle.created,
        pendingRequestID: requestID,
      };
      store.write(idle.directory, pending);
      return pending;
    });
    if (!pendingState) return;

    let messages;
    try {
      messages = await ctx.session.context(
        { sessionID: idle.sessionID },
        { signal: controller.signal },
      );
    } catch (error) {
      if (controller.signal.aborted) {
        await clearPendingRequest(idle.directory, requestID, store);
        return;
      }
      await clearPendingRequest(idle.directory, requestID, store);
      throw new LoopEventError(
        "Could not check Ralph Loop completion; no continuation was submitted and no iteration was consumed. A later idle event can retry the check.",
        error,
      );
    }
    if (controller.signal.aborted) {
      await clearPendingRequest(idle.directory, requestID, store);
      return;
    }

    let reservedState: RalphState | undefined;
    await withStateLock(idle.directory, () => {
      const current = store.read(idle.directory);
      if (!matchesPendingRequest(current, pendingState, requestID)) return;
      if (controller.signal.aborted) {
        store.write(idle.directory, withoutPendingRequest(current));
        return;
      }

      if (hasCompletionPromise(messages)) {
        store.clear(idle.directory);
        return;
      }

      const next: RalphState = {
        ...current,
        iteration: current.iteration + 1,
        lastIdleEventID: idle.eventID,
        lastIdleEventCreated: idle.created,
        continuationBlocked: true,
      };
      store.write(idle.directory, next);
      markContinuationAdmissionStarted(idle.directory, idle.sessionID, requestID);
      reservedState = next;
    });
    if (!reservedState) return;

    if (controller.signal.aborted) {
      throw new LoopEventError(
        "Continuation was interrupted after reserving its iteration; the loop is blocked. Cancel and restart before retrying.",
        undefined,
      );
    }

    try {
      await ctx.session.prompt(
        {
          sessionID: idle.sessionID,
          text: buildContinuationPrompt(reservedState),
          delivery: "queue",
        },
        { signal: controller.signal },
      );
    } catch (error) {
      throw new LoopEventError(
        controller.signal.aborted
          ? "Continuation admission was interrupted; its iteration remains reserved and the loop is blocked. Cancel and restart before retrying."
          : "Continuation prompt admission failed; its iteration remains reserved and the loop is blocked. Cancel and restart before retrying.",
        error,
      );
    }

    if (controller.signal.aborted) {
      throw new LoopEventError(
        "Continuation admission completed during shutdown; its iteration remains reserved and the loop is blocked. Cancel and restart before retrying.",
        undefined,
      );
    }

    await withStateLock(idle.directory, () => {
      const current = store.read(idle.directory);
      if (
        !current.active ||
        current.loopID !== reservedState!.loopID ||
        current.lastIdleEventID !== idle.eventID ||
        current.iteration !== reservedState!.iteration ||
        current.pendingRequestID !== requestID ||
        !current.continuationBlocked
      ) {
        return;
      }
      const admittedState = withoutPendingRequest(current);
      delete admittedState.continuationBlocked;
      store.write(idle.directory, admittedState);
    });
  } finally {
    signal.removeEventListener("abort", abortFromParent);
    unregister();
  }
}

async function clearPendingRequest(
  directory: string,
  requestID: string,
  store: StateStore,
): Promise<void> {
  await withStateLock(directory, () => {
    const current = store.read(directory);
    if (current.pendingRequestID !== requestID) return;
    store.write(directory, withoutPendingRequest(current));
  });
}

function withoutPendingRequest(state: RalphState): RalphState {
  const result = { ...state };
  delete result.pendingIdleEventID;
  delete result.pendingIdleEventCreated;
  delete result.pendingRequestID;
  return result;
}

function matchesPendingRequest(
  current: RalphState,
  expected: RalphState,
  requestID: string,
): boolean {
  return (
    current.active &&
    current.loopID === expected.loopID &&
    current.sessionId === expected.sessionId &&
    current.pendingRequestID === requestID &&
    current.pendingIdleEventID === expected.pendingIdleEventID &&
    current.pendingIdleEventCreated === expected.pendingIdleEventCreated &&
    current.iteration === expected.iteration &&
    current.maxIterations === expected.maxIterations &&
    current.prompt === expected.prompt
  );
}

function sameLoopSnapshot(current: RalphState, expected: RalphState): boolean {
  return (
    current.active === expected.active &&
    current.iteration === expected.iteration &&
    current.maxIterations === expected.maxIterations &&
    current.sessionId === expected.sessionId &&
    current.loopID === expected.loopID &&
    current.loopStartedAt === expected.loopStartedAt &&
    current.lastIdleEventID === expected.lastIdleEventID &&
    current.lastIdleEventCreated === expected.lastIdleEventCreated &&
    current.pendingIdleEventID === expected.pendingIdleEventID &&
    current.pendingIdleEventCreated === expected.pendingIdleEventCreated &&
    current.pendingRequestID === expected.pendingRequestID &&
    current.continuationBlocked === expected.continuationBlocked &&
    current.prompt === expected.prompt
  );
}

export function buildContinuationPrompt(state: RalphState): string {
  return [
    `[RALPH LOOP - ITERATION ${state.iteration}/${state.maxIterations}]`,
    "",
    "Your previous attempt did not output the completion promise. Continue working on the task.",
    "",
    "IMPORTANT:",
    "- Review your progress so far",
    "- Continue from where you left off",
    "- When FULLY complete, output: <promise>DONE</promise>",
    "- Do not stop until the task is truly done",
    "",
    "Original task:",
    state.prompt || "(no task specified)",
  ].join("\n");
}
