import { describe, expect, it } from "vitest";
import type { Plugin } from "@opencode/plugin";
import { hasCompletionPromise, type SessionContextMessage } from "../src/completion.ts";

function contextMessage(value: Record<string, unknown>): SessionContextMessage {
  return value as unknown as SessionContextMessage;
}

function assistant(text: string): SessionContextMessage {
  return contextMessage({
    id: "msg_assistant",
    time: { created: 1 },
    type: "assistant",
    agent: "build",
    model: { providerID: "test", id: "model" },
    content: [{ type: "text", text }],
  });
}

describe("hasCompletionPromise", () => {
  it("detects the marker in the last assistant text after compaction", () => {
    const messages: Awaited<ReturnType<Plugin.Context["session"]["context"]>> = [
      contextMessage({
        type: "compaction",
        id: "msg_compaction",
        time: { created: 1 },
        status: "completed",
        reason: "auto",
        summary: "Earlier work was summarized.",
      }),
      contextMessage({
        type: "user",
        id: "msg_user",
        time: { created: 2 },
        text: "Finish the task.",
      }),
      assistant("Finished. <promise>DONE</promise>"),
    ];

    expect(hasCompletionPromise(messages)).toBe(true);
  });

  it("uses only the latest assistant message, not an earlier completion marker", () => {
    const messages: Awaited<ReturnType<Plugin.Context["session"]["context"]>> = [
      assistant("<promise>DONE</promise>"),
      contextMessage({
        type: "compaction",
        id: "msg_compaction",
        time: { created: 2 },
        status: "completed",
        reason: "auto",
        summary: "Prior assistant response summarized.",
      }),
      assistant("The task is still in progress."),
    ];

    expect(hasCompletionPromise(messages)).toBe(false);
  });

  it("does not treat user, compaction, reasoning, or tool content as completion", () => {
    const messages: Awaited<ReturnType<Plugin.Context["session"]["context"]>> = [
      contextMessage({
        type: "user",
        id: "msg_user",
        time: { created: 1 },
        text: "<promise>DONE</promise>",
      }),
      contextMessage({
        type: "compaction",
        id: "msg_compaction",
        time: { created: 2 },
        status: "completed",
        reason: "auto",
        summary: "<promise>DONE</promise>",
      }),
      contextMessage({
        id: "msg_assistant",
        time: { created: 3 },
        type: "assistant",
        agent: "build",
        model: { providerID: "test", id: "model" },
        content: [
          { type: "reasoning", text: "<promise>DONE</promise>" },
          { type: "tool", id: "call_1", name: "finish", state: { status: "completed" } },
        ],
      }),
    ];

    expect(hasCompletionPromise(messages)).toBe(false);
  });

  it("preserves case-insensitive marker matching and rejects contexts without assistant messages", () => {
    expect(hasCompletionPromise([assistant("<PROMISE> done </PROMISE>")])).toBe(true);
    expect(hasCompletionPromise([])).toBe(false);
  });
});
