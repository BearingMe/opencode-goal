import { Plugin } from "@opencode/plugin";
import { registerCommands } from "./commands.ts";
import { registerSkills } from "./skills.ts";
import { registerTools } from "./tools.ts";

export default Plugin.define({
  id: "opencode-ralph-loop",
  async setup(ctx) {
    await registerTools(ctx);
    await registerCommands(ctx);
    await registerSkills(ctx);
  },
});
