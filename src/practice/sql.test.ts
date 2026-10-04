import { describe, expect, it } from 'vitest';
import initSqlJs from 'sql.js';
import { checkResult, exercises, seed } from './sql';

describe('sql exercises', async () => {
  const SQL = await initSqlJs();
  const run = (query: string) => { const db = new SQL.Database(); db.run(seed); const out = db.exec(query)[0]; db.close(); return out; };

  it('has 20 exercises with ids 1-20', () => expect(exercises.map(e => e.id)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1)));
  it.each(exercises)('model solution $id runs and returns rows', ({ solution, ordered }) => {
    const result = run(solution);
    expect(result?.values.length).toBeGreaterThan(0);
    expect(checkResult(result, result, ordered).ok).toBe(true);
  });
  it('detects wrong order, wrong rows and missing result', () => {
    const base = { columns: ['a'], values: [[1], [2]] };
    expect(checkResult({ columns: ['x'], values: [[2], [1]] }, base, true).message).toMatch(/wrong order/);
    expect(checkResult({ columns: ['x'], values: [[2], [1]] }, base, false).ok).toBe(true);
    expect(checkResult({ columns: ['x'], values: [[1], [3]] }, base, true).ok).toBe(false);
    expect(checkResult(undefined, base, true).ok).toBe(false);
  });
  it('anti-join variants agree (exercises 9 and 10 style)', () => {
    expect(run(exercises[8].solution).values).toEqual([[6]]);
  });
});
