import { describe, it, expect } from "vitest";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  clearState,
  getStateFilePath,
  MalformedStateError,
  parseState,
  readState,
  serializeState,
  StateFileError,
  type RalphState,
  writeState,
} from "../src/state.ts";

function makeProjectDirectory(): string {
  return mkdtempSync(join(tmpdir(), "ralph-loop-state-"));
}

function captureStateFileError(action: () => unknown): StateFileError {
  try {
    action();
  } catch (error) {
    expect(error).toBeInstanceOf(StateFileError);
    return error as StateFileError;
  }
  throw new Error("Expected a state file operation to fail.");
}

describe("parseState", () => {
  it.each(["", "just some text", "---\nactive: true\niteration: 0"])(
    "rejects missing or incomplete frontmatter: %s",
    (content) => {
      expect(() => parseState(content)).toThrow(MalformedStateError);
    },
  );

  it("keeps defaults for omitted fields in valid partial frontmatter", () => {
    expect(parseState("---\niteration: 2\n---")).toEqual({
      active: false,
      iteration: 2,
      maxIterations: 100,
    });
  });

  it("rejects frontmatter without any recognized state fields", () => {
    expect(() => parseState("---\nunknown: value\n---")).toThrow(MalformedStateError);
  });

  it("parses active, iteration, maxIterations, sessionId", () => {
    const content = [
      "---",
      "active: true",
      "iteration: 7",
      "maxIterations: 50",
      "sessionId: ses_abc123",
      "---",
    ].join("\n");

    expect(parseState(content)).toEqual({
      active: true,
      iteration: 7,
      maxIterations: 50,
      sessionId: "ses_abc123",
    });
  });

  it("rejects invalid known values and duplicate state fields", () => {
    expect(() => parseState("---\nactive: maybe\n---")).toThrow(MalformedStateError);
    expect(() => parseState("---\niteration: nope\n---")).toThrow(MalformedStateError);
    expect(() => parseState("---\nmaxIterations: 0\n---")).toThrow(MalformedStateError);
    expect(() => parseState("---\nactive: true\nactive: false\n---")).toThrow(MalformedStateError);
  });

  it("captures the body as the prompt", () => {
    const content = [
      "---",
      "active: true",
      "iteration: 0",
      "maxIterations: 100",
      "---",
      "",
      "Build a REST API",
    ].join("\n");

    expect(parseState(content).prompt).toBe("Build a REST API");
  });

  it("preserves colons inside session IDs", () => {
    const content = "---\nactive: true\nsessionId: ses:foo:bar\niteration: 0\nmaxIterations: 100\n---";
    expect(parseState(content).sessionId).toBe("ses:foo:bar");
  });

  it("parses CRLF-encoded state files (Windows line endings)", () => {
    const content = "---\r\nactive: true\r\niteration: 5\r\nmaxIterations: 50\r\nsessionId: ses_win\r\n---\r\n\r\nWindows-saved task";
    expect(parseState(content)).toEqual({
      active: true,
      iteration: 5,
      maxIterations: 50,
      sessionId: "ses_win",
      prompt: "Windows-saved task",
    });
  });

  it("accepts a UTF-8 BOM before valid frontmatter", () => {
    expect(parseState("\uFEFF---\nactive: true\n---").active).toBe(true);
  });
});

describe("serializeState", () => {
  it("emits the frontmatter delimiters and required fields", () => {
    const state: RalphState = { active: true, iteration: 3, maxIterations: 100 };
    const out = serializeState(state);

    expect(out).toMatch(/^---\n/);
    expect(out).toContain("active: true");
    expect(out).toContain("iteration: 3");
    expect(out).toContain("maxIterations: 100");
  });

  it("omits sessionId when absent", () => {
    const out = serializeState({ active: false, iteration: 0, maxIterations: 100 });
    expect(out).not.toContain("sessionId");
  });

  it("includes the prompt body when set", () => {
    const out = serializeState({
      active: true,
      iteration: 1,
      maxIterations: 100,
      prompt: "Ship it",
    });
    expect(out).toContain("\nShip it");
  });
});

describe("parseState <-> serializeState round trip", () => {
  it("survives a round trip with all fields set", () => {
    const original: RalphState = {
      active: true,
      iteration: 12,
      maxIterations: 200,
      sessionId: "ses_xyz",
      prompt: "Build a REST API with auth",
    };
    expect(parseState(serializeState(original))).toEqual(original);
  });

  it("survives a round trip with only required fields", () => {
    const original: RalphState = {
      active: false,
      iteration: 0,
      maxIterations: 100,
    };
    expect(parseState(serializeState(original))).toEqual(original);
  });
});

describe("project-local state file operations", () => {
  it("treats only a missing state file as inactive", () => {
    const directory = makeProjectDirectory();

    expect(readState(directory)).toEqual({
      active: false,
      iteration: 0,
      maxIterations: 100,
    });
  });

  it("does not turn malformed existing state into inactive defaults", () => {
    const directory = makeProjectDirectory();
    const path = getStateFilePath(directory);
    mkdirSync(join(directory, ".opencode"), { recursive: true });
    writeFileSync(path, "not a state file", "utf-8");

    expect(() => readState(directory)).toThrow(MalformedStateError);
  });

  it("round-trips state through the project-local file and clears it", () => {
    const directory = makeProjectDirectory();
    const state: RalphState = {
      active: true,
      iteration: 3,
      maxIterations: 20,
      sessionId: "ses_project",
      prompt: "Project-local task",
    };

    writeState(directory, state);

    expect(readState(directory)).toEqual(state);
    expect(clearState(directory)).toBe(true);
    expect(clearState(directory)).toBe(false);
  });

  it("wraps non-missing read, write, and delete failures with their operation", () => {
    const readDirectory = makeProjectDirectory();
    const readPath = getStateFilePath(readDirectory);
    mkdirSync(readPath, { recursive: true });
    const readError = captureStateFileError(() => readState(readDirectory));
    expect(readError.operation).toBe("read");
    expect(readError.cause).toBeInstanceOf(Error);
    expect(readError.message).not.toContain(readPath);

    const writeDirectory = makeProjectDirectory();
    const writePath = getStateFilePath(writeDirectory);
    writeFileSync(join(writeDirectory, ".opencode"), "not a directory", "utf-8");
    const writeError = captureStateFileError(() =>
      writeState(writeDirectory, { active: true, iteration: 0, maxIterations: 5 }),
    );
    expect(writeError.operation).toBe("write");
    expect(writeError.cause).toBeInstanceOf(Error);
    expect(writeError.message).not.toContain(writePath);

    const deleteDirectory = makeProjectDirectory();
    const deletePath = getStateFilePath(deleteDirectory);
    mkdirSync(deletePath, { recursive: true });
    const deleteError = captureStateFileError(() => clearState(deleteDirectory));
    expect(deleteError.operation).toBe("delete");
    expect(deleteError.cause).toBeInstanceOf(Error);
    expect(deleteError.message).not.toContain(deletePath);
  });
});
