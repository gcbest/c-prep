import { transform } from 'sucrase';

export type CodingTask = {
  id: number;
  title: string;
  prompt: string;
  starter: string;
  /** Each test: arguments passed to solve(...args), and the expected return value. */
  tests: [unknown[], unknown][];
  normalize?: 'groups';
  hint: string;
  solution: string;
  complexity: string;
};

const t = (args: unknown[], expected: unknown): [unknown[], unknown] => [args, expected];

export const codingTasks: CodingTask[] = [
  { id: 1, title: 'Contains Duplicate (LeetCode 217)', prompt: 'Return true if any value appears at least twice.',
    starter: 'function solve(nums: number[]): boolean {\n  // TODO\n  return false;\n}',
    tests: [t([[1, 2, 3, 1]], true), t([[1, 2, 3, 4]], false), t([[]], false), t([[5, 5]], true)],
    hint: 'A Set remembers what you have seen in O(1).', complexity: 'O(n) time, O(n) space',
    solution: 'function solve(nums: number[]): boolean {\n  const seen = new Set<number>();\n  for (const n of nums) { if (seen.has(n)) return true; seen.add(n); }\n  return false;\n}' },
  { id: 2, title: 'Group Anagrams (LeetCode 49)', prompt: 'Group words that are anagrams. Group order and order inside groups do not matter.',
    starter: 'function solve(words: string[]): string[][] {\n  // TODO\n  return [];\n}',
    tests: [t([['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]), t([['']], [['']]), t([['a']], [['a']]), t([[]], [])], normalize: 'groups',
    hint: 'Anagrams share the same sorted letters: use that as the map key.', complexity: 'O(n * k log k) time, O(n * k) space',
    solution: 'function solve(words: string[]): string[][] {\n  const map = new Map<string, string[]>();\n  for (const w of words) {\n    const key = [...w].sort().join("");\n    map.set(key, [...(map.get(key) ?? []), w]);\n  }\n  return [...map.values()];\n}' },
  { id: 3, title: 'Top K Frequent Elements (LeetCode 347)', prompt: 'Return the k most frequent values, most frequent first. Ties are broken by smaller value.',
    starter: 'function solve(nums: number[], k: number): number[] {\n  // TODO\n  return [];\n}',
    tests: [t([[1, 1, 1, 2, 2, 3], 2], [1, 2]), t([[1], 1], [1]), t([[4, 4, 5, 5, 6], 2], [4, 5]), t([[], 3], [])],
    hint: 'Count with a Map, then sort entries by count desc, value asc.', complexity: 'O(n log n) time (O(n) with bucket sort), O(n) space',
    solution: 'function solve(nums: number[], k: number): number[] {\n  const c = new Map<number, number>();\n  for (const n of nums) c.set(n, (c.get(n) ?? 0) + 1);\n  return [...c.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]).slice(0, k).map(e => e[0]);\n}' },
  { id: 4, title: 'Reorder Data in Log Files (LeetCode 937)', prompt: 'Each log is "id rest". Letter-logs come before digit-logs. Letter-logs sort by content, then id. Digit-logs keep their original order.',
    starter: 'function solve(logs: string[]): string[] {\n  // TODO\n  return logs;\n}',
    tests: [t([['dig1 8 1 5 1', 'let1 art can', 'dig2 3 6', 'let2 own kit dig', 'let3 art zero']], ['let1 art can', 'let3 art zero', 'let2 own kit dig', 'dig1 8 1 5 1', 'dig2 3 6']), t([[]], [])],
    hint: 'Split into two lists first; sort only the letter-logs with a comparator.', complexity: 'O(n log n * m) time, O(n) space',
    solution: 'function solve(logs: string[]): string[] {\n  const isDigit = (l: string) => /\\d/.test(l.slice(l.indexOf(" ") + 1)[0]);\n  const letters = logs.filter(l => !isDigit(l));\n  const digits = logs.filter(isDigit);\n  const split = (l: string) => [l.slice(0, l.indexOf(" ")), l.slice(l.indexOf(" ") + 1)];\n  letters.sort((a, b) => { const [ia, ca] = split(a); const [ib, cb] = split(b); return ca < cb ? -1 : ca > cb ? 1 : ia < ib ? -1 : ia > ib ? 1 : 0; });\n  return [...letters, ...digits];\n}' },
  { id: 5, title: 'Validate IP Address (LeetCode 468)', prompt: 'Return "IPv4", "IPv6" or "Neither". IPv4: four decimal parts 0-255 without leading zeros. IPv6: eight groups of 1-4 hex digits.',
    starter: 'function solve(ip: string): string {\n  // TODO\n  return "Neither";\n}',
    tests: [t(['172.16.254.1'], 'IPv4'), t(['2001:0db8:85a3:0:0:8A2E:0370:7334'], 'IPv6'), t(['256.256.256.256'], 'Neither'), t(['192.168.01.1'], 'Neither'), t(['1.1.1.1.'], 'Neither'), t(['2001:db8:85a3::8A2E:037j:7334'], 'Neither')],
    hint: 'Decide by separator, then validate each part with a small helper.', complexity: 'O(n) time, O(1) space',
    solution: 'function solve(ip: string): string {\n  if (ip.includes(".")) {\n    const p = ip.split(".");\n    return p.length === 4 && p.every(x => /^(0|[1-9]\\d{0,2})$/.test(x) && Number(x) <= 255) ? "IPv4" : "Neither";\n  }\n  if (ip.includes(":")) {\n    const p = ip.split(":");\n    return p.length === 8 && p.every(x => /^[0-9a-fA-F]{1,4}$/.test(x)) ? "IPv6" : "Neither";\n  }\n  return "Neither";\n}' },
  { id: 6, title: 'Total by category from log lines', prompt: 'Lines look like "id category amount". Ignore blank or malformed lines. Return an object of category totals.',
    starter: 'function solve(lines: string[]): Record<string, number> {\n  // TODO\n  return {};\n}',
    tests: [t([['1 rates 10', '2 credit 7', '3 rates 4']], { rates: 14, credit: 7 }), t([['', '  ', 'oops']], {}), t([['1 fx 2.5', '2 fx x']], { fx: 2.5 })],
    hint: 'trim, split on whitespace, check there are 3 parts and the amount is a finite number.', complexity: 'O(n) time, O(c) space for c categories',
    solution: 'function solve(lines: string[]): Record<string, number> {\n  const out: Record<string, number> = {};\n  for (const line of lines) {\n    const p = line.trim().split(/\\s+/);\n    if (p.length !== 3) continue;\n    const amount = Number(p[2]);\n    if (!Number.isFinite(amount)) continue;\n    out[p[1]] = (out[p[1]] ?? 0) + amount;\n  }\n  return out;\n}' },
  { id: 7, title: 'Time Based Key-Value Store (LeetCode 981)', prompt: 'ops are ["set", key, value, time] or ["get", key, time]. For a get return the value with the greatest time <= the requested time, or "" if none. Return the results of all gets, in order. Set times are increasing per key.',
    starter: 'function solve(ops: (string | number)[][]): string[] {\n  // TODO\n  return [];\n}',
    tests: [t([[['set', 'a', 'x', 1], ['get', 'a', 1], ['get', 'a', 3], ['set', 'a', 'y', 4], ['get', 'a', 4], ['get', 'a', 5], ['get', 'b', 1]]], ['x', 'x', 'y', 'y', '']), t([[['get', 'z', 9]]], [''])],
    hint: 'Per key keep a list of [time, value]; binary search for the last time <= t.', complexity: 'get O(log n), set O(1) amortised',
    solution: 'function solve(ops: (string | number)[][]): string[] {\n  const m = new Map<string, [number, string][]>();\n  const out: string[] = [];\n  for (const op of ops) {\n    if (op[0] === "set") { const k = op[1] as string; if (!m.has(k)) m.set(k, []); m.get(k)!.push([op[3] as number, op[2] as string]); }\n    else {\n      const list = m.get(op[1] as string) ?? []; const time = op[2] as number;\n      let lo = 0, hi = list.length - 1, ans = "";\n      while (lo <= hi) { const mid = (lo + hi) >> 1; if (list[mid][0] <= time) { ans = list[mid][1]; lo = mid + 1; } else hi = mid - 1; }\n      out.push(ans);\n    }\n  }\n  return out;\n}' },
  { id: 8, title: 'RiskEvent capstone: versions, deletes, gaps', prompt: 'Events: {id, category, amount, version, sequence, deleted?}. Keep the highest version per id (ignore stale or equal versions). A deleted event removes the id. Return {totals, gaps}: totals by category over live ids; gaps are missing integers between the smallest and largest sequence seen, ascending.',
    starter: 'type Ev = { id: string; category: string; amount: number; version: number; sequence: number; deleted?: boolean };\nfunction solve(events: Ev[]): { totals: Record<string, number>; gaps: number[] } {\n  // TODO\n  return { totals: {}, gaps: [] };\n}',
    tests: [
      t([[{ id: 'a', category: 'rates', amount: 10, version: 1, sequence: 1 }, { id: 'b', category: 'credit', amount: 5, version: 1, sequence: 2 }, { id: 'a', category: 'rates', amount: 12, version: 2, sequence: 4 }, { id: 'a', category: 'rates', amount: 99, version: 1, sequence: 5 }]], { totals: { rates: 12, credit: 5 }, gaps: [3] }),
      t([[{ id: 'a', category: 'fx', amount: 3, version: 1, sequence: 1 }, { id: 'a', category: 'fx', amount: 0, version: 2, sequence: 2, deleted: true }]], { totals: {}, gaps: [] }),
      t([[]], { totals: {}, gaps: [] }),
    ],
    hint: 'Two independent passes of state: a Map id -> latest event, and a Set of sequences. Compute totals from the Map at the end.', complexity: 'O(n + range) time, O(n) space',
    solution: 'type Ev = { id: string; category: string; amount: number; version: number; sequence: number; deleted?: boolean };\nfunction solve(events: Ev[]) {\n  const latest = new Map<string, Ev>();\n  const seqs = new Set<number>();\n  for (const e of events) {\n    seqs.add(e.sequence);\n    const cur = latest.get(e.id);\n    if (!cur || e.version > cur.version) latest.set(e.id, e);\n  }\n  const totals: Record<string, number> = {};\n  for (const e of latest.values()) if (!e.deleted) totals[e.category] = (totals[e.category] ?? 0) + e.amount;\n  const gaps: number[] = [];\n  if (seqs.size) { const all = [...seqs]; const lo = Math.min(...all), hi = Math.max(...all); for (let s = lo; s <= hi; s++) if (!seqs.has(s)) gaps.push(s); }\n  return { totals, gaps };\n}' },
  { id: 9, title: 'Journey counting: enter then exit', prompt: 'Events are {user, type: "enter" | "exit"} in time order. Count completed enter->exit pairs per user. An exit with no open enter is an orphan and is ignored; a second enter while already inside is ignored. Return the total number of completed journeys.',
    starter: 'type Ev = { user: string; type: "enter" | "exit" };\nfunction solve(events: Ev[]): number {\n  // TODO\n  return 0;\n}',
    tests: [t([[{ user: 'a', type: 'enter' }, { user: 'b', type: 'exit' }, { user: 'a', type: 'exit' }, { user: 'a', type: 'exit' }, { user: 'b', type: 'enter' }, { user: 'b', type: 'enter' }, { user: 'b', type: 'exit' }]], 2), t([[]], 0), t([[{ user: 'a', type: 'enter' }]], 0)],
    hint: 'Track who is currently inside with a Set.', complexity: 'O(n) time, O(u) space',
    solution: 'type Ev = { user: string; type: "enter" | "exit" };\nfunction solve(events: Ev[]): number {\n  const inside = new Set<string>();\n  let done = 0;\n  for (const e of events) {\n    if (e.type === "enter") inside.add(e.user);\n    else if (inside.delete(e.user)) done++;\n  }\n  return done;\n}' },
];

/** Strip TypeScript types (no type-checking). */
export function toJs(source: string): string {
  return transform(source, { transforms: ['typescript'] }).code;
}

/** Source for a disposable worker: user code + a test harness. The user code is embedded, never eval'd. */
export function buildWorkerSource(js: string, normalize?: 'groups'): string {
  return `${js}
;const __norm = ${normalize === 'groups' ? '(v) => v.map(g => [...g].sort()).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1)' : '(v) => v'};
self.onmessage = (e) => {
  try {
    if (typeof solve !== 'function') throw new Error('Define a function named solve.');
    const results = e.data.map(([args, expected]) => {
      const actual = solve(...JSON.parse(JSON.stringify(args)));
      return JSON.stringify(__norm(actual)) === JSON.stringify(__norm(expected));
    });
    self.postMessage({ results });
  } catch (error) { self.postMessage({ error: String(error && error.message || error) }); }
};
`;
}
