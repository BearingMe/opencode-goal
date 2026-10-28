import { describe, expect, it, vi } from "vitest";
import type { Plugin as OpenCodePlugin } from "@opencode/plugin";
import { registerTools } from "../src/tools.ts";
import { StateFileError, type StateStore } from "../src/state.ts";

type TestTool = {
  name: string;
  execute(input: unknown, context: { sessionID: string }): Promise<{ content?: string }>;
};

async function registerTestTools(store: StateStore): Promise<Map<string, TestTool>> {
  const tools = new Map<string, TestTool>();
  const context = {
    session: {
      get: async () => ({ location: { directory: "C:/project" } }),
    },
    tool: {
      transform: async (register: (editor: { add(tool: TestTool): void }) => void) => {
        register({ add: (tool) => tools.set(tool.name, tool) });
      },
    },
  } as unknown as OpenCodePlugin.Context;

  await registerTools(context, store);
  return tools;
}

const session = { sessionID: "ses_state_error" };

describe("state failures reach tool callers", () => {
  it("does not report a loop started when writing state fails", async () => {
    const failure = new StateFileError("write", new Error("disk full"));
    const write = vi.fn(() => {
      throw failure;
    });
    const store: StateStore = {
      read: vi.fn(),
      write,
      clear: vi.fn(),
    };
    const tools = await registerTestTools(store);

    await expect(
      tools.get("ralph-loop")!.execute({ task: "Start safely" }, session),
    ).rejects.toBe(failure);
    expect(write).toHaveBeenCalledOnce();
  });

  it("does not report cancellation when state cannot be read", async () => {
    const failure = new StateFileError("read", new Error("access denied"));
    const read = vi.fn(() => {
      throw failure;
    });
    const clear = vi.fn();
    const store: StateStore = { read, write: vi.fn(), clear };
    const tools = await registerTestTools(store);

    await expect(tools.get("cancel-ralph")!.execute({}, session)).rejects.toBe(failure);
    expect(clear).not.toHaveBeenCalled();
  });

  it("does not report cancellation when deleting state fails", async () => {
    const failure = new StateFileError("delete", new Error("access denied"));
    const read = vi.fn(() => ({ active: true, iteration: 4, maxIterations: 10 }));
    const clear = vi.fn(() => {
      throw failure;
    });
    const store: StateStore = { read, write: vi.fn(), clear };
    const tools = await registerTestTools(store);

    await expect(tools.get("cancel-ralph")!.execute({}, session)).rejects.toBe(failure);
    expect(read).toHaveBeenCalledOnce();
    expect(clear).toHaveBeenCalledOnce();
  });
});
