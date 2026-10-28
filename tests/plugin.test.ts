import { describe, it, expect } from "vitest";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Plugin as OpenCodePlugin } from "@opencode/plugin";
import RalphLoopPlugin from "../src/index.ts";
import { readState } from "../src/state.ts";

const TOOL_NAMES = ["ralph-loop", "cancel-ralph", "help"] as const;

type RegisteredTool = {
  name: string;
  input: Record<string, unknown>;
  execute(input: unknown, context: { sessionID: string }): Promise<{ content?: string }>;
};

async function getTools(
  directory = mkdtempSync(join(tmpdir(), "ralph-loop-plugin-")),
  sessionDirectories: Record<string, string> = {},
) {
  const tools = new Map<string, RegisteredTool>();
  const context = {
    location: { directory },
    session: {
      get: async ({ sessionID }: { sessionID: string }) => ({
        location: { directory: sessionDirectories[sessionID] ?? directory },
      }),
    },
    tool: {
      transform: async (register: (editor: { add(tool: RegisteredTool): void }) => void) => {
        register({ add: (tool) => tools.set(tool.name, tool) });
      },
    },
  } as unknown as OpenCodePlugin.Context;

  await RalphLoopPlugin.setup(context);
  return { directory, tools };
}

describe("RalphLoopPlugin", () => {
  it("exports a V2 plugin definition with a stable ID", () => {
    expect(RalphLoopPlugin.id).toBe("opencode-ralph-loop");
    expect(typeof RalphLoopPlugin.setup).toBe("function");
  });

  it("registers each V2 tool once with object schemas", async () => {
    const { tools } = await getTools();

    expect([...tools.keys()]).toEqual(TOOL_NAMES);
    for (const name of TOOL_NAMES) {
      expect(tools.get(name)?.input).toMatchObject({
        type: "object",
        additionalProperties: false,
      });
    }
    expect(tools.get("ralph-loop")?.input).toMatchObject({
      required: ["task"],
      properties: {
        task: { type: "string" },
        maxIterations: { type: "integer", minimum: 1, default: 100 },
      },
    });
    expect(tools.get("cancel-ralph")?.input.properties).toEqual({});
    expect(tools.get("help")?.input.properties).toEqual({});
  });

  it("starts a session-bound loop and persists its task and limit", async () => {
    const { directory, tools } = await getTools();
    const tool = tools.get("ralph-loop")!;

    const result = await tool.execute(
      { task: "test task", maxIterations: 5 },
      { sessionID: "ses_test" },
    );

    expect(result.content).toContain("Ralph Loop started (max 5 iterations)");
    expect(readState(directory)).toEqual({
      active: true,
      iteration: 0,
      maxIterations: 5,
      sessionId: "ses_test",
      prompt: "test task",
    });
  });

  it("persists state in the invoking session's project, not the plugin location", async () => {
    const pluginDirectory = mkdtempSync(join(tmpdir(), "ralph-loop-plugin-location-"));
    const sessionDirectory = mkdtempSync(join(tmpdir(), "ralph-loop-session-location-"));
    const { tools } = await getTools(pluginDirectory, { ses_other_project: sessionDirectory });

    await tools.get("ralph-loop")!.execute(
      { task: "other project task" },
      { sessionID: "ses_other_project" },
    );

    expect(readState(sessionDirectory)).toMatchObject({
      active: true,
      sessionId: "ses_other_project",
      prompt: "other project task",
    });
    expect(existsSync(join(pluginDirectory, ".opencode", "ralph-loop.local.md"))).toBe(false);

    const cancel = await tools.get("cancel-ralph")!.execute({}, { sessionID: "ses_other_project" });
    expect(cancel.content).toBe("Ralph Loop cancelled after 0 iteration(s).");
    expect(existsSync(join(sessionDirectory, ".opencode", "ralph-loop.local.md"))).toBe(false);
  });

  it("defaults max iterations to 100", async () => {
    const { directory, tools } = await getTools();

    await tools.get("ralph-loop")!.execute({ task: "test task" }, { sessionID: "ses_default" });

    expect(readState(directory).maxIterations).toBe(100);
  });

  it.each([
    { input: undefined },
    { input: {} },
    { input: null },
    { input: { task: "   " } },
    { input: { task: "task", maxIterations: null } },
    { input: { task: "task", maxIterations: 0 } },
    { input: { task: "task", maxIterations: 1.5 } },
  ])("rejects invalid start input %#", async ({ input }) => {
    const { directory, tools } = await getTools();

    await expect(
      tools.get("ralph-loop")!.execute(input, { sessionID: "ses_invalid" }),
    ).rejects.toThrow();
    expect(existsSync(join(directory, ".opencode", "ralph-loop.local.md"))).toBe(false);
  });

  it("cancels an active loop and reports the iteration", async () => {
    const { directory, tools } = await getTools();
    await tools.get("ralph-loop")!.execute(
      { task: "test task", maxIterations: 5 },
      { sessionID: "ses_test" },
    );

    const result = await tools.get("cancel-ralph")!.execute({}, { sessionID: "ses_test" });

    expect(result.content).toBe("Ralph Loop cancelled after 0 iteration(s).");
    expect(existsSync(join(directory, ".opencode", "ralph-loop.local.md"))).toBe(false);
  });

  it("reports no active loop when cancelling empty state", async () => {
    const { tools } = await getTools();
    const result = await tools.get("cancel-ralph")!.execute({}, { sessionID: "ses_test" });

    expect(result.content).toBe("No active Ralph Loop to cancel.");
  });

  it("returns structured help content", async () => {
    const { tools } = await getTools();
    const result = await tools.get("help")!.execute({}, { sessionID: "ses_test" });

    expect(result.content).toContain("/ralph-loop <task>");
    expect(result.content).toContain("<promise>DONE</promise>");
  });
});
