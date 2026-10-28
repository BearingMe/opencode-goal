import { Plugin } from "@opencode/plugin";
import { registerCommands } from "./commands.ts";
import { continueLoopOnIdle } from "./continuation.ts";
import { subscribeLoopEvents } from "./events.ts";
import { registerSkills } from "./skills.ts";
import { registerTools } from "./tools.ts";

export default Plugin.define({
  id: "opencode-ralph-loop",
  async setup(ctx) {
    await registerTools(ctx);
    await registerCommands(ctx);
    await registerSkills(ctx);
    return subscribeLoopEvents(ctx, {
      onIdle: (idle, signal) => continueLoopOnIdle(ctx, idle, signal),
    });
  },
});
