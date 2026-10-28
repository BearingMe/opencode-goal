import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { STATE_PATH } from "./commands.ts";

export const DEFAULT_MAX_ITERATIONS = 100;

export interface RalphState {
  active: boolean;
  iteration: number;
  maxIterations: number;
  sessionId?: string;
  prompt?: string;
}

export function parseState(content: string): RalphState {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { active: false, iteration: 0, maxIterations: DEFAULT_MAX_ITERATIONS };

  const frontmatter = match[1];
  const state: RalphState = { active: false, iteration: 0, maxIterations: DEFAULT_MAX_ITERATIONS };

  for (const line of frontmatter.split(/\r?\n/)) {
    const [key, ...valueParts] = line.split(":");
    const value = valueParts.join(":").trim();
    if (key === "active") state.active = value === "true";
    if (key === "iteration") state.iteration = parseInt(value) || 0;
    if (key === "maxIterations") state.maxIterations = parseInt(value) || DEFAULT_MAX_ITERATIONS;
    if (key === "sessionId") state.sessionId = value || undefined;
  }

  const body = content.slice(match[0].length).trim();
  if (body) state.prompt = body;

  return state;
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
  try {
    return parseState(readFileSync(path, "utf-8"));
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return { active: false, iteration: 0, maxIterations: DEFAULT_MAX_ITERATIONS };
    }
    throw error;
  }
}

export function writeState(directory: string, state: RalphState): void {
  const path = getStateFilePath(directory);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, serializeState(state), "utf-8");
}

export function clearState(directory: string): boolean {
  const path = getStateFilePath(directory);
  try {
    unlinkSync(path);
    return true;
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") return false;
    throw error;
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}
