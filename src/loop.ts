import { randomUUID } from "node:crypto";
import { Error as ToolError } from "@opencode/plugin/promise/tool";
import type { Plugin } from "@opencode/plugin";
import { DEFAULT_MAX_ITERATIONS, stateStore, type StateStore } from "./state.ts";
import {
  abortContinuationRequests,
  hasPendingContinuationAdmission,
} from "./continuation-control.ts";
import { withStateLock } from "./state-lock.ts";

export const HELP_TEXT = `# Ralph Loop Help

## Available Commands

- \`/ralph-loop <task>\` - Start an auto-continuation loop
- \`/cancel-ralph\` - Stop an active loop
- \`/help\` - Show this help

## How It Works

1. Start with: /ralph-loop "Build a REST API"
2. The plugin continues the initiating session when it goes idle
3. The loop stops at \`<promise>DONE</promise>\` or the max iteration count
4. Cancellation stops future continuations; it cannot retract a prompt already admitted by OpenCode.

## State File

Located at: .opencode/ralph-loop.local.md

## Limits

- Use one OpenCode runtime per project; concurrent processes do not share loop locks.
- Cancellation stops future continuations but cannot retract a prompt OpenCode already admitted.
- If a prompt admission never settles, restart OpenCode before starting another loop.`;

export interface StartLoopResult {
  task: string;
  maxIterations: number;
  content: string;
}

export function parseStartInput(input: unknown): { task: unknown; maxIterations: unknown } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new ToolError({ message: "Ralph Loop requires an object with a task." });
  }

  const args = input as Record<string, unknown>;
  return { task: args.task, maxIterations: args.maxIterations };
}

export async function startLoop(
  ctx: Plugin.Context,
  sessionID: string,
  task: unknown,
  maxIterations: unknown = DEFAULT_MAX_ITERATIONS,
  store: StateStore = stateStore,
): Promise<StartLoopResult> {
  if (typeof task !== "string" || task.trim().length === 0) {
    throw new ToolError({ message: "Ralph Loop requires a non-empty task." });
  }

  const limit = maxIterations === undefined ? DEFAULT_MAX_ITERATIONS : maxIterations;
  if (typeof limit !== "number" || !Number.isSafeInteger(limit) || limit < 1) {
    throw new ToolError({ message: "Maximum iterations must be a positive integer." });
  }

  const directory = await getSessionDirectory(ctx, sessionID);
  abortContinuationRequests(directory);
  await withStateLock(directory, () => {
    const current = store.read(directory);
    if (current.pendingRequestID || current.continuationBlocked) {
      throw new ToolError({
        message:
          "Cancel the blocked Ralph Loop before starting another. A prior continuation request may still be pending or have an uncertain outcome.",
      });
    }
    if (hasPendingContinuationAdmission(directory)) {
      throw new ToolError({
        message:
          "A Ralph Loop continuation may still be entering the session. Wait for that request to settle before starting another loop in this project.",
      });
    }
    store.write(directory, {
      active: true,
      iteration: 0,
      maxIterations: limit,
      sessionId: sessionID,
      loopID: randomUUID(),
      loopStartedAt: Date.now(),
      prompt: task,
    });
  });

  return {
    task,
    maxIterations: limit,
    content: `Ralph Loop started (max ${limit} iterations).\n\nTask: ${task}\n\nI will auto-continue until the task is complete. When fully done, I will output \`<promise>DONE</promise>\` to signal completion.\n\nUse /cancel-ralph to stop early.`,
  };
}

export async function cancelLoop(
  ctx: Plugin.Context,
  sessionID: string,
  store: StateStore = stateStore,
): Promise<string> {
  const directory = await getSessionDirectory(ctx, sessionID);
  abortContinuationRequests(directory, sessionID);
  return withStateLock(directory, () => {
    const state = store.read(directory);
    if (!state.active || (state.sessionId !== undefined && state.sessionId !== sessionID)) {
      return "No active Ralph Loop to cancel.";
    }

    store.clear(directory);
    return `Ralph Loop cancelled after ${state.iteration} iteration(s).`;
  });
}

async function getSessionDirectory(ctx: Plugin.Context, sessionID: string): Promise<string> {
  const session = await ctx.session.get({ sessionID });
  return session.location.directory;
}
