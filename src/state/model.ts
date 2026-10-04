export const STATE_KEY = 'citi-prep-state-v1';
export const TOKEN_KEY = 'citi-prep-github-token';
export const SCHEMA_VERSION = 1;

export type Grade = 'missed' | 'partial' | 'strong';
export type Track = 'java' | 'python';
export type UserRecord<T = unknown> = {
  value?: T;
  updatedAt: string;
  deviceId: string;
  deleted?: boolean;
};
export type StateMap = Record<string, UserRecord>;
export type AppState = {
  schemaVersion: number;
  revision: number;
  updatedAt: string;
  deviceId: string;
  currentLesson: number;
  currentLessonUpdatedAt: string;
  currentLessonDeviceId: string;
  completed: StateMap;
  skipped: StateMap;
  grades: StateMap;
  notes: StateMap;
  stories: StateMap;
  settings: StateMap;
};

export function newDeviceId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `device-${Math.random().toString(36).slice(2)}`;
}

export function emptyState(deviceId = newDeviceId()): AppState {
  return {
    schemaVersion: SCHEMA_VERSION, revision: 0, updatedAt: new Date(0).toISOString(),
    deviceId, currentLesson: 1, currentLessonUpdatedAt: new Date(0).toISOString(), currentLessonDeviceId: deviceId, completed: {}, skipped: {}, grades: {}, notes: {}, stories: {}, settings: {},
  };
}

export function loadState(): AppState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STATE_KEY) ?? 'null') as Partial<AppState> | null;
    if (parsed && parsed.schemaVersion === SCHEMA_VERSION && parsed.deviceId) {
      return { ...emptyState(parsed.deviceId), ...parsed, completed: parsed.completed ?? {}, skipped: parsed.skipped ?? {}, grades: parsed.grades ?? {}, notes: parsed.notes ?? {}, stories: parsed.stories ?? {}, settings: parsed.settings ?? {} };
    }
  } catch { /* recover with a clean local state */ }
  return emptyState();
}

export function record<T>(value: T, deviceId: string): UserRecord<T> {
  return { value, updatedAt: new Date().toISOString(), deviceId };
}

export function recordValue<T>(records: StateMap, id: string, fallback?: T): T | undefined {
  const item = records[id] as UserRecord<T> | undefined;
  return item && !item.deleted ? item.value : fallback;
}

export function mergeState(local: AppState, remote: AppState): AppState {
  if (remote.schemaVersion > SCHEMA_VERSION) throw new Error('This sync has a newer schema. Reload the latest version before syncing.');
  if (local.schemaVersion > SCHEMA_VERSION) throw new Error('Local data uses a newer schema. Reload the latest version before syncing.');
  const maps = ['completed', 'skipped', 'grades', 'notes', 'stories', 'settings'] as const;
  const merged = { ...local, schemaVersion: SCHEMA_VERSION, revision: Math.max(local.revision, remote.revision), updatedAt: local.updatedAt > remote.updatedAt ? local.updatedAt : remote.updatedAt, deviceId: local.deviceId < remote.deviceId ? local.deviceId : remote.deviceId };
  for (const mapName of maps) {
    const output: StateMap = {};
    const keys = new Set([...Object.keys(local[mapName] ?? {}), ...Object.keys(remote[mapName] ?? {})]);
    for (const key of keys) {
      const a = local[mapName]?.[key];
      const b = remote[mapName]?.[key];
      if (!a) output[key] = b!;
      else if (!b) output[key] = a;
      else output[key] = compareRecords(a, b) >= 0 ? a : b;
    }
    merged[mapName] = output;
  }
  const currentWinner = compareRecords(
    { value: local.currentLesson, updatedAt: local.currentLessonUpdatedAt ?? local.updatedAt, deviceId: local.currentLessonDeviceId ?? local.deviceId },
    { value: remote.currentLesson, updatedAt: remote.currentLessonUpdatedAt ?? remote.updatedAt, deviceId: remote.currentLessonDeviceId ?? remote.deviceId },
  ) >= 0 ? local : remote;
  merged.currentLesson = currentWinner.currentLesson;
  merged.currentLessonUpdatedAt = currentWinner.currentLessonUpdatedAt ?? currentWinner.updatedAt;
  merged.currentLessonDeviceId = currentWinner.currentLessonDeviceId ?? currentWinner.deviceId;
  return merged;
}

function compareRecords(a: UserRecord, b: UserRecord): number {
  // Plain string comparison (ISO timestamps sort lexically); exact ties go to the higher deviceId.
  if (a.updatedAt !== b.updatedAt) return a.updatedAt < b.updatedAt ? -1 : 1;
  return a.deviceId === b.deviceId ? 0 : a.deviceId < b.deviceId ? -1 : 1;
}

export function hasUnsyncedRecords(local: AppState, remote: AppState): boolean {
  if (compareRecords({ value: local.currentLesson, updatedAt: local.currentLessonUpdatedAt ?? local.updatedAt, deviceId: local.currentLessonDeviceId ?? local.deviceId }, { value: remote.currentLesson, updatedAt: remote.currentLessonUpdatedAt ?? remote.updatedAt, deviceId: remote.currentLessonDeviceId ?? remote.deviceId }) > 0) return true;
  for (const key of ['completed', 'skipped', 'grades', 'notes', 'stories', 'settings'] as const) {
    for (const [id, value] of Object.entries(local[key])) {
      const other = remote[key]?.[id];
      if (!other || compareRecords(value, other) > 0) return true;
    }
  }
  return false;
}

/** Merge remote into local while keeping this device's own identity (merge itself is symmetric). */
export function mergeIntoLocal(local: AppState, remote: AppState): AppState {
  return { ...mergeState(local, remote), deviceId: local.deviceId };
}
