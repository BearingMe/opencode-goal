import { describe, expect, it } from "vitest";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Plugin as OpenCodePlugin } from "@opencode/plugin";
import type { CommandDefinition, CommandInvocation } from "@opencode/plugin/promise/command";
import { registerCommands } from "../src/commands.ts";
import { HELP_TEXT } from "../src/loop.ts";
import { readState } from "../src/state.ts";

async function setup(
  pluginDirectory = mkdtempSync(join(tmpdir(), "ralph-loop-command-plugin-")),
  sessionDirectories: Record<string, string> = {},
  existingCommands: string[] = [],
) {
  const commands = new Map<string, CommandDefinition>();
  const prompts: Array<Record<string, unknown>> = [];
  const switchedAgents: Array<{ sessionID: string; agent: string }> = [];
  let replayTransform: ((editor: { add(definition: CommandDefinition): void }) => void) | undefined;
  const context = {
    location: { directory: pluginDirectory },
    command: {
      list: async () => ({ data: existingCommands.map((name) => ({ name })) }),
      transform: async (register: (editor: { add(definition: CommandDefinition): void }) => void) => {
        replayTransform = register;
        register({ add: (definition) => commands.set(definition.name, definition) });
      },
    },
    session: {
      get: async ({ sessionID }: { sessionID: string }) => ({
        location: { directory: sessionDirectories[sessionID] ?? pluginDirectory },
      }),
      prompt: async (input: Record<string, unknown>) => {
        prompts.push(input);
      },
      switchAgent: async (input: { sessionID: string; agent: string }) => {
        switchedAgents.push(input);
      },
    },
  } as unknown as OpenCodePlugin.Context;

  await registerCommands(context);
  return {
    context,
    commands,
    pluginDirectory,
    prompts,
    switchedAgents,
    removeExistingCommand(name: string) {
      const index = existingCommands.indexOf(name);
      if (index !== -1) existingCommands.splice(index, 1);
    },
    replayCommands() {
      if (!replayTransform) throw new Error("Command transform was not registered.");
      commands.clear();
      replayTransform({ add: (definition) => commands.set(definition.name, definition) });
    },
  };
}

function invocation(
  sessionID: string,
  text = "",
  delivery: CommandInvocation["delivery"] = "steer",
): CommandInvocation {
  return {
    sessionID: sessionID as CommandInvocation["sessionID"],
    prompt: { text, files: [{ uri: "file:///task.md" }] },
    delivery,
  };
}

describe("V2 command registration", () => {
  it("registers the three commands and skips user-defined IDs", async () => {
    const { commands } = await setup(undefined, {}, ["help"]);

    expect([...commands.keys()]).toEqual(["ralph-loop", "cancel-ralph"]);
  });

  it("does not reclaim an ID skipped at setup when the user command is later removed", async () => {
    const { commands, removeExistingCommand, replayCommands } = await setup(undefined, {}, ["help"]);

    removeExistingCommand("help");
    replayCommands();

    expect([...commands.keys()]).toEqual(["ralph-loop", "cancel-ralph"]);
  });

  it("starts a session-bound loop and preserves the command arguments and delivery", async () => {
    const sessionDirectory = mkdtempSync(join(tmpdir(), "ralph-loop-command-session-"));
    const { commands, prompts, switchedAgents } = await setup(undefined, {
      ses_command: sessionDirectory,
    });

    await commands.get("ralph-loop")!.execute(
      invocation("ses_command", "Build the API", "queue"),
    );

    expect(readState(sessionDirectory)).toMatchObject({
      active: true,
      iteration: 0,
      maxIterations: 100,
      sessionId: "ses_command",
      prompt: "Build the API",
    });
    expect(prompts[0]).toMatchObject({
      sessionID: "ses_command",
      delivery: "queue",
      files: [{ uri: "file:///task.md" }],
      text: expect.stringContaining("Task: Build the API"),
    });
    expect(prompts[0].text).toContain("<promise>DONE</promise>");
    expect(switchedAgents).toEqual([{ sessionID: "ses_command", agent: "build" }]);
  });

  it("uses the shared cancel behavior and reports its result", async () => {
    const { commands, pluginDirectory, prompts, switchedAgents } = await setup();
    await commands.get("ralph-loop")!.execute(invocation("ses_cancel", "Finish the task"));

    await commands.get("cancel-ralph")!.execute(invocation("ses_cancel"));

    expect(existsSync(join(pluginDirectory, ".opencode", "ralph-loop.local.md"))).toBe(false);
    expect(prompts[1].text).toBe("Ralph Loop cancelled after 0 iteration(s).");
    expect(switchedAgents).toEqual([
      { sessionID: "ses_cancel", agent: "build" },
      { sessionID: "ses_cancel", agent: "build" },
    ]);
  });

  it("asks for a task without creating state when arguments are empty", async () => {
    const { commands, pluginDirectory, prompts } = await setup();

    await commands.get("ralph-loop")!.execute(invocation("ses_empty"));

    expect(existsSync(join(pluginDirectory, ".opencode", "ralph-loop.local.md"))).toBe(false);
    expect(prompts[0].text).toContain("Provide a task after /ralph-loop");
  });

  it("submits shared help content", async () => {
    const { commands, prompts, switchedAgents } = await setup();

    await commands.get("help")!.execute(invocation("ses_help"));

    expect(prompts[0].text).toBe(HELP_TEXT);
    expect(switchedAgents).toEqual([{ sessionID: "ses_help", agent: "build" }]);
  });
});
