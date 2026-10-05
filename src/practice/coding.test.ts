import { describe, expect, it } from 'vitest';
import { buildWorkerSource, codingTasks, toJs } from './coding';

// Run the same harness a worker would, in-process, by faking `self`.
function runHarness(source: string, tests: unknown) {
  let handler: ((e: { data: unknown }) => void) | undefined;
  let result: { results?: boolean[]; error?: string } = {};
  const self = { set onmessage(fn: typeof handler) { handler = fn; }, postMessage: (m: typeof result) => { if (m.results || m.error) result = m; } };
  new Function('self', source)(self);
  handler!({ data: tests });
  return result;
}

describe('coding tasks', () => {
  it('has 12 tasks', () => expect(codingTasks).toHaveLength(12));
  it.each(codingTasks)('reference solution passes hidden tests: $title', task => {
    const out = runHarness(buildWorkerSource(toJs(task.solution), task.normalize), task.tests);
    expect(out.error).toBeUndefined();
    expect(out.results).toEqual(task.tests.map(() => true));
  });
  it.each(codingTasks)('starter fails at least one test: $title', task => {
    const out = runHarness(buildWorkerSource(toJs(task.starter), task.normalize), task.tests);
    expect(out.results?.some(r => !r)).toBe(true);
  });
  it('reports a missing solve function', () => {
    expect(runHarness(buildWorkerSource('const x = 1;'), []).error).toMatch(/solve/);
  });
});
