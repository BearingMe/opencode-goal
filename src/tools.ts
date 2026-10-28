import { Plugin } from "@opencode/plugin";
import { HELP_TEXT, cancelLoop, parseStartInput, startLoop } from "./loop.ts";
import { DEFAULT_MAX_ITERATIONS, stateStore, type StateStore } from "./state.ts";

const EMPTY_INPUT = { type: "object", properties: {}, additionalProperties: false } as const;

export async function registerTools(ctx: Plugin.Context, store: StateStore = stateStore): Promise<void> {
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
        const args = parseStartInput(input);
        const result = await startLoop(ctx, toolContext.sessionID, args.task, args.maxIterations, store);
        return { content: result.content };
      },
    });

    editor.add({
      name: "cancel-ralph",
      description: "Cancel the active Ralph Loop for this project.",
      input: EMPTY_INPUT,
      async execute(_input, toolContext) {
        return { content: await cancelLoop(ctx, toolContext.sessionID, store) };
      },
    });

    editor.add({
      name: "help",
      description: "Show Ralph Loop plugin help.",
      input: EMPTY_INPUT,
      async execute() {
        return { content: HELP_TEXT };
      },
    });
  });
}
