import { Error as ToolError } from "@opencode/plugin/promise/tool";
import type { Plugin } from "@opencode/plugin";
import { DEFAULT_MAX_ITERATIONS, clearState, readState, writeState } from "./state.ts";

export const HELP_TEXT = `# Ralph Loop Help

## Available Commands

- \`/ralph-loop <task>\` - Start an auto-continuation loop
- \`/cancel-ralph\` - Stop an active loop
- \`/help\` - Show this help

## How It Works

1. Start with: /ralph-loop "Build a REST API"
2. The plugin continues the initiating session when it goes idle
3. The loop stops at \`<promise>DONE</promise>\` or the max iteration count

## State File

Located at: .opencode/ralph-loop.local.md`;

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
): Promise<StartLoopResult> {
  if (typeof task !== "string" || task.trim().length === 0) {
    throw new ToolError({ message: "Ralph Loop requires a non-empty task." });
  }

  const limit = maxIterations === undefined ? DEFAULT_MAX_ITERATIONS : maxIterations;
  if (typeof limit !== "number" || !Number.isSafeInteger(limit) || limit < 1) {
    throw new ToolError({ message: "Maximum iterations must be a positive integer." });
  }

  const directory = await getSessionDirectory(ctx, sessionID);
  writeState(directory, {
    active: true,
    iteration: 0,
    maxIterations: limit,
    sessionId: sessionID,
    prompt: task,
  });

  return {
    task,
    maxIterations: limit,
    content: `Ralph Loop started (max ${limit} iterations).\n\nTask: ${task}\n\nI will auto-continue until the task is complete. When fully done, I will output \`<promise>DONE</promise>\` to signal completion.\n\nUse /cancel-ralph to stop early.`,
  };
}

export async function cancelLoop(ctx: Plugin.Context, sessionID: string): Promise<string> {
  const directory = await getSessionDirectory(ctx, sessionID);
  const state = readState(directory);
  if (!state.active) return "No active Ralph Loop to cancel.";

  clearState(directory);
  return `Ralph Loop cancelled after ${state.iteration} iteration(s).`;
}

async function getSessionDirectory(ctx: Plugin.Context, sessionID: string): Promise<string> {
  const session = await ctx.session.get({ sessionID });
  return session.location.directory;
}
