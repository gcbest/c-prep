import { describe, expect, it } from 'vitest';
import { emptyState, mergeState, record, recordValue, type AppState } from './model';

function state(deviceId: string, updatedAt = '2026-01-01T00:00:00.000Z'): AppState {
  const result = emptyState(deviceId); result.updatedAt = updatedAt; return result;
}

describe('mergeState', () => {
  it('keeps different concurrent records from both devices', () => {
    const a = state('device-a'); const b = state('device-b');
    a.completed['1'] = record(true, 'device-a'); b.skipped['2'] = record(true, 'device-b');
    const merged = mergeState(a, b);
    expect(recordValue(merged.completed, '1')).toBe(true);
    expect(recordValue(merged.skipped, '2')).toBe(true);
  });
  it('chooses the later timestamp for conflicting records', () => {
    const a = state('a'); const b = state('b');
    a.notes.one = { ...record('old', 'a'), updatedAt: '2026-01-01T00:00:00.000Z' };
    b.notes.one = { ...record('new', 'b'), updatedAt: '2026-01-02T00:00:00.000Z' };
    expect(recordValue(mergeState(a, b).notes, 'one')).toBe('new');
  });
  it('breaks exact timestamp ties by device ID', () => {
    const a = state('a'); const b = state('b');
    a.grades.q = { value: 'partial', updatedAt: '2026-01-01T00:00:00.000Z', deviceId: 'a' };
    b.grades.q = { value: 'strong', updatedAt: '2026-01-01T00:00:00.000Z', deviceId: 'b' };
    expect(recordValue(mergeState(a, b).grades, 'q')).toBe('strong');
  });
  it('preserves tombstones so deleted records do not resurrect', () => {
    const a = state('a'); const b = state('b');
    a.stories.story = { value: 'old note', updatedAt: '2026-01-01T00:00:00.000Z', deviceId: 'a' };
    b.stories.story = { value: undefined, deleted: true, updatedAt: '2026-01-02T00:00:00.000Z', deviceId: 'b' };
    const merged = mergeState(a, b);
    expect(merged.stories.story.deleted).toBe(true);
    expect(recordValue(merged.stories, 'story', 'missing')).toBe('missing');
  });
  it('pulls existing remote progress onto an empty new device', () => {
    const local = state('phone'); const remote = state('desktop'); remote.completed['4'] = record(true, 'desktop');
    expect(recordValue(mergeState(local, remote).completed, '4')).toBe(true);
  });
  it('refuses a newer unknown schema', () => {
    const remote = state('other'); remote.schemaVersion = 99;
    expect(() => mergeState(state('local'), remote)).toThrow(/newer schema/i);
  });
  it('uses record timestamps rather than trusting a skewed root clock', () => {
    const a = state('a', '2099-01-01T00:00:00.000Z'); const b = state('b', '2026-01-01T00:00:00.000Z');
    a.settings.theme = { value: 'light', updatedAt: '2026-01-01T00:00:00.000Z', deviceId: 'a' };
    b.settings.theme = { value: 'dark', updatedAt: '2026-01-02T00:00:00.000Z', deviceId: 'b' };
    expect(recordValue(mergeState(a, b).settings, 'theme')).toBe('dark');
  });
  it('is idempotent', () => {
    const a = state('a'); const b = state('b'); a.completed['1'] = record(true, 'a'); b.notes.n = record('x', 'b');
    const once = mergeState(a, b); expect(mergeState(once, once)).toEqual(once);
  });
  it('is commutative', () => {
    const a = state('a'); const b = state('b'); a.completed['1'] = record(true, 'a'); b.notes.n = record('x', 'b');
    expect(mergeState(a, b)).toEqual(mergeState(b, a));
  });
});

describe('mergeIntoLocal', () => {
  it('keeps this device identity after merging', async () => {
    const { mergeIntoLocal } = await import('./model');
    expect(mergeIntoLocal(state('zzz'), state('aaa')).deviceId).toBe('zzz');
    expect(mergeIntoLocal(state('aaa'), state('zzz')).deviceId).toBe('aaa');
  });
});
