import { describe, it, expect } from "vitest";
import RalphLoopPlugin from "../src/index.ts";

describe("RalphLoopPlugin", () => {
  it("exports a V2 plugin definition with a stable ID", () => {
    expect(RalphLoopPlugin.id).toBe("opencode-ralph-loop");
    expect(typeof RalphLoopPlugin.setup).toBe("function");
  });
});
