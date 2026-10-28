import { Plugin } from "@opencode/plugin";
import { registerCommands } from "./commands.ts";
import { registerTools } from "./tools.ts";

export default Plugin.define({
  id: "opencode-ralph-loop",
  async setup(ctx) {
    await registerTools(ctx);
    await registerCommands(ctx);
  },
});
