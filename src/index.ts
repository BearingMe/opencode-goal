import { Plugin } from "@opencode/plugin";
import { registerTools } from "./tools.ts";

export default Plugin.define({
  id: "opencode-ralph-loop",
  async setup(ctx) {
    await registerTools(ctx);
  },
});
