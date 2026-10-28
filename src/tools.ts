import { Plugin } from "@opencode/plugin";
import { Error as ToolError } from "@opencode/plugin/promise/tool";
import { DEFAULT_MAX_ITERATIONS, clearState, readState, writeState } from "./state.ts";

const EMPTY_INPUT = {
  type: "object",
  properties: {},
  additionalProperties: false,
} as const;

const HELP = `# Ralph Loop Help

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

export async function registerTools(ctx: Plugin.Context): Promise<void> {
  await ctx.tool.transform((editor) => {
    editor.add({
      name: "ralph-loop",
      description: "Start Ralph Loop and continue the current task until completion.",
      input: {
        type: "object",
        properties: {
          task: { type: "string", minLength: 1 },
          maxIterations: {
            type: "integer",
            minimum: 1,
            maximum: Number.MAX_SAFE_INTEGER,
            default: DEFAULT_MAX_ITERATIONS,
          },
        },
        required: ["task"],
        additionalProperties: false,
      },
      async execute(input, toolContext) {
        const { task, maxIterations } = parseStartInput(input);
        const directory = await getSessionDirectory(ctx, toolContext.sessionID);
        writeState(directory, {
          active: true,
          iteration: 0,
          maxIterations,
          sessionId: toolContext.sessionID,
          prompt: task,
        });

        return {
          content: `Ralph Loop started (max ${maxIterations} iterations).\n\nTask: ${task}\n\nI will auto-continue until the task is complete. When fully done, I will output \`<promise>DONE</promise>\` to signal completion.\n\nUse /cancel-ralph to stop early.`,
        };
      },
    });

    editor.add({
      name: "cancel-ralph",
      description: "Cancel the active Ralph Loop for this project.",
      input: EMPTY_INPUT,
      async execute(_input, toolContext) {
        const directory = await getSessionDirectory(ctx, toolContext.sessionID);
        const state = readState(directory);
        if (!state.active) return { content: "No active Ralph Loop to cancel." };

        clearState(directory);
        return { content: `Ralph Loop cancelled after ${state.iteration} iteration(s).` };
      },
    });

    editor.add({
      name: "help",
      description: "Show Ralph Loop plugin help.",
      input: EMPTY_INPUT,
      async execute() {
        return { content: HELP };
      },
    });
  });
}

async function getSessionDirectory(ctx: Plugin.Context, sessionID: string): Promise<string> {
  const session = await ctx.session.get({ sessionID });
  return session.location.directory;
}

function parseStartInput(input: unknown): { task: string; maxIterations: number } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new ToolError({ message: "Ralph Loop requires an object with a task." });
  }

  const args = input as Record<string, unknown>;
  if (typeof args.task !== "string" || args.task.trim().length === 0) {
    throw new ToolError({ message: "Ralph Loop requires a non-empty task." });
  }

  const maxIterations =
    args.maxIterations === undefined ? DEFAULT_MAX_ITERATIONS : args.maxIterations;
  if (
    typeof maxIterations !== "number" ||
    !Number.isSafeInteger(maxIterations) ||
    maxIterations < 1
  ) {
    throw new ToolError({ message: "Maximum iterations must be a positive integer." });
  }

  return { task: args.task, maxIterations };
}
