import { Plugin } from "@opencode/plugin";
import { HELP_TEXT, cancelLoop, startLoop } from "./loop.ts";
import { DEFAULT_MAX_ITERATIONS } from "./state.ts";
import { STATE_PATH } from "./state-path.ts";

const LOOP_DESCRIPTION = "Start Ralph Loop and work on a task until it is complete.";
const CANCEL_DESCRIPTION = "Cancel the active Ralph Loop.";
const HELP_DESCRIPTION = "Show Ralph Loop plugin help and available commands.";

export async function registerCommands(ctx: Plugin.Context): Promise<void> {
  const { data } = await ctx.command.list();
  const existing = new Set(data.map((command) => command.name));

  await ctx.command.transform((editor) => {
    if (!existing.has("ralph-loop")) {
      editor.add({
        name: "ralph-loop",
        description: LOOP_DESCRIPTION,
        async execute({ sessionID, prompt, delivery }) {
          await ctx.session.switchAgent({ sessionID, agent: "build" });
          const task = prompt.text;
          if (task.trim().length === 0) {
            await ctx.session.prompt({
              ...prompt,
              sessionID,
              text: "Provide a task after /ralph-loop to start the loop.",
              delivery,
            });
            return;
          }

          const result = await startLoop(ctx, sessionID, task, DEFAULT_MAX_ITERATIONS);
          await ctx.session.prompt({
            ...prompt,
            sessionID,
            text: [
              "Work iteratively on the following task until it is fully complete.",
              `Task: ${result.task}`,
              `The plugin manages loop state at ${STATE_PATH}; do not create or edit that file manually.`,
              "When the task is completely and verifiably finished, output <promise>DONE</promise>.",
              "Do not output a false completion promise. Use /cancel-ralph to stop early.",
            ].join("\n\n"),
            delivery,
          });
        },
      });
    }

    if (!existing.has("cancel-ralph")) {
      editor.add({
        name: "cancel-ralph",
        description: CANCEL_DESCRIPTION,
        async execute({ sessionID, prompt, delivery }) {
          await ctx.session.switchAgent({ sessionID, agent: "build" });
          const result = await cancelLoop(ctx, sessionID);
          await ctx.session.prompt({ ...prompt, sessionID, text: result, delivery });
        },
      });
    }

    if (!existing.has("help")) {
      editor.add({
        name: "help",
        description: HELP_DESCRIPTION,
        async execute({ sessionID, prompt, delivery }) {
          await ctx.session.switchAgent({ sessionID, agent: "build" });
          await ctx.session.prompt({ ...prompt, sessionID, text: HELP_TEXT, delivery });
        },
      });
    }
  });
}
