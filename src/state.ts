import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { STATE_PATH } from "./state-path.ts";

export const DEFAULT_MAX_ITERATIONS = 100;

export interface RalphState {
  active: boolean;
  iteration: number;
  maxIterations: number;
  sessionId?: string;
  prompt?: string;
}

export class MalformedStateError extends Error {
  constructor() {
    super(
      "Ralph Loop state is malformed. Repair or remove .opencode/ralph-loop.local.md before retrying.",
    );
    this.name = "MalformedStateError";
  }
}

export class StateFileError extends Error {
  constructor(
    readonly operation: "read" | "write" | "delete",
    cause: unknown,
  ) {
    super(
      `Could not ${operation} project-local Ralph Loop state. Check .opencode/ralph-loop.local.md and project file permissions before retrying.`,
      { cause },
    );
    this.name = "StateFileError";
  }
}

export function parseState(content: string): RalphState {
  const normalized = content.startsWith("\uFEFF") ? content.slice(1) : content;
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new MalformedStateError();

  const fields = new Map<string, string>();
  const knownFields = new Set(["active", "iteration", "maxIterations", "sessionId"]);

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;

    const key = line.slice(0, separator).trim();
    if (!knownFields.has(key)) continue;
    if (fields.has(key)) throw new MalformedStateError();
    fields.set(key, line.slice(separator + 1).trim());
  }

  if (fields.size === 0) throw new MalformedStateError();

  const activeValue = fields.get("active");
  if (activeValue !== undefined && activeValue !== "true" && activeValue !== "false") {
    throw new MalformedStateError();
  }

  const state: RalphState = {
    active: activeValue === "true",
    iteration: parseIntegerField(fields.get("iteration"), 0),
    maxIterations: parseIntegerField(fields.get("maxIterations"), DEFAULT_MAX_ITERATIONS, 1),
  };
  const sessionId = fields.get("sessionId");
  if (sessionId) state.sessionId = sessionId;

  const body = normalized.slice(match[0].length).trim();
  if (body) state.prompt = body;

  return state;
}

function parseIntegerField(value: string | undefined, fallback: number, minimum = 0): number {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value)) throw new MalformedStateError();

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum) throw new MalformedStateError();
  return parsed;
}

export function serializeState(state: RalphState): string {
  const lines = [
    "---",
    `active: ${state.active}`,
    `iteration: ${state.iteration}`,
    `maxIterations: ${state.maxIterations}`,
  ];
  if (state.sessionId) lines.push(`sessionId: ${state.sessionId}`);
  lines.push("---");
  if (state.prompt) lines.push("", state.prompt);
  return lines.join("\n");
}

export function getStateFilePath(directory: string): string {
  return join(directory, STATE_PATH);
}

export function readState(directory: string): RalphState {
  const path = getStateFilePath(directory);
  let content: string;
  try {
    content = readFileSync(path, "utf-8");
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return { active: false, iteration: 0, maxIterations: DEFAULT_MAX_ITERATIONS };
    }
    throw new StateFileError("read", error);
  }
  return parseState(content);
}

export function writeState(directory: string, state: RalphState): void {
  const path = getStateFilePath(directory);
  const content = serializeState(state);
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf-8");
  } catch (error) {
    throw new StateFileError("write", error);
  }
}

export function clearState(directory: string): boolean {
  const path = getStateFilePath(directory);
  try {
    unlinkSync(path);
    return true;
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") return false;
    throw new StateFileError("delete", error);
  }
}

export interface StateStore {
  read(directory: string): RalphState;
  write(directory: string, state: RalphState): void;
  clear(directory: string): boolean;
}

export const stateStore: StateStore = {
  read: readState,
  write: writeState,
  clear: clearState,
};

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}
