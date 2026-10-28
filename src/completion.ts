import type { Plugin } from "@opencode/plugin";

// Keep runtime helpers outside the plugin entrypoint so the loader only sees its plugin definition.
export const COMPLETION_TAG = /<promise>\s*DONE\s*<\/promise>/is;

export type SessionContextMessage = Awaited<
  ReturnType<Plugin.Context["session"]["context"]>
>[number];

export function hasCompletionPromise(messages: readonly SessionContextMessage[]): boolean {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.type !== "assistant") continue;

    const text = message.content
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n");
    return COMPLETION_TAG.test(text);
  }

  return false;
}
