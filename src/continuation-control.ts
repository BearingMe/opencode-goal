import { stateDirectoryKey } from "./state-lock.ts";

interface ContinuationRequest {
  controller: AbortController;
  phase: "completion" | "admission";
}

const requests = new Map<string, Map<string, Map<string, ContinuationRequest>>>();

export function registerContinuationRequest(
  directory: string,
  sessionID: string,
  requestID: string,
  controller: AbortController,
): () => void {
  const key = stateDirectoryKey(directory);
  let sessions = requests.get(key);
  if (!sessions) {
    sessions = new Map();
    requests.set(key, sessions);
  }

  let active = sessions.get(sessionID);
  if (!active) {
    active = new Map();
    sessions.set(sessionID, active);
  }
  active.set(requestID, { controller, phase: "completion" });

  const unregister = () => {
    active!.delete(requestID);
    if (active!.size === 0) sessions!.delete(sessionID);
    if (sessions!.size === 0) requests.delete(key);
  };
  return () => {
    unregister();
  };
}

export function isContinuationRequestActive(
  directory: string,
  sessionID: string,
  requestID: string,
): boolean {
  return requests.get(stateDirectoryKey(directory))?.get(sessionID)?.has(requestID) ?? false;
}

export function markContinuationAdmissionStarted(
  directory: string,
  sessionID: string,
  requestID: string,
): void {
  const request = requests.get(stateDirectoryKey(directory))?.get(sessionID)?.get(requestID);
  if (request) request.phase = "admission";
}

export function hasPendingContinuationAdmission(directory: string): boolean {
  const sessions = requests.get(stateDirectoryKey(directory));
  if (!sessions) return false;
  for (const requestsByID of sessions.values()) {
    for (const request of requestsByID.values()) {
      if (request.phase === "admission") return true;
    }
  }
  return false;
}

export function abortContinuationRequests(directory: string, sessionID?: string): void {
  const sessions = requests.get(stateDirectoryKey(directory));
  if (!sessions) return;

  const groups = sessionID ? [sessions.get(sessionID)] : [...sessions.values()];
  for (const group of groups) {
    for (const request of group?.values() ?? []) request.controller.abort();
  }
}

export function abortContinuationRequestsForSession(sessionID: string): void {
  for (const sessions of requests.values()) {
    for (const request of sessions.get(sessionID)?.values() ?? []) request.controller.abort();
  }
}
