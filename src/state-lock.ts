import { resolve } from "node:path";

const locks = new Map<string, Promise<void>>();

export function stateDirectoryKey(directory: string): string {
  const resolved = resolve(directory);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

export async function withStateLock<T>(
  directory: string,
  operation: () => T | Promise<T>,
): Promise<T> {
  const key = stateDirectoryKey(directory);
  const previous = locks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolveLock) => {
    release = resolveLock;
  });
  locks.set(key, current);

  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (locks.get(key) === current) locks.delete(key);
  }
}
