import { useEffect, useRef, useState } from 'react';
import initSqlJs, { type SqlJsStatic } from 'sql.js';
// Vite fingerprints and serves this asset (respecting `base`); sql.js's browser
// build looks for `sql-wasm-browser.wasm`, so we resolve it explicitly instead
// of relying on a matching name in `public/`.
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { checkResult, exercises, schemaText, seed, type SqlResult } from './sql';
import { buildWorkerSource, codingTasks, toJs } from './coding';

let sqlPromise: Promise<SqlJsStatic> | undefined;
const loadSql = () => (sqlPromise ??= initSqlJs({ locateFile: () => sqlWasmUrl }));

function freshRun(SQL: SqlJsStatic, query: string): SqlResult | undefined {
  const db = new SQL.Database(); // fresh seeded database per run, so DROP/UPDATE never poisons later runs
  try { db.run(seed); const out = db.exec(query); return out.length ? out[out.length - 1] : undefined; } finally { db.close(); }
}

export function SqlPlayground({ ids }: { ids?: number[] }) {
  const list = ids ? exercises.filter(item => ids.includes(item.id)) : exercises;
  const [SQL, setSql] = useState<SqlJsStatic>();
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SqlResult>();
  const [message, setMessage] = useState('Loading SQLite…');
  const [ok, setOk] = useState<boolean>();
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState(false);
  useEffect(() => { loadSql().then(lib => { setSql(lib); setMessage('Ready. SQLite runs in your browser.'); }).catch(error => setMessage(`Could not start SQLite: ${String(error)}`)); }, []);
  const item = list[index];
  if (!item) return null;

  function go(next: number) { setIndex((next + list.length) % list.length); setQuery(''); setResult(undefined); setHints(0); setSolution(false); setOk(undefined); setMessage('Ready.'); }
  function run() {
    if (!SQL) return;
    try {
      const actual = freshRun(SQL, query);
      const expected = freshRun(SQL, item.solution)!;
      setResult(actual);
      const check = checkResult(actual, expected, item.ordered);
      setOk(check.ok); setMessage(check.message);
    } catch (error) { setResult(undefined); setOk(false); setMessage(error instanceof Error ? error.message : 'SQL error'); }
  }
  return <section className="tool-card" aria-label="SQL exercise">
    <div className="tool-heading">
      <div><p className="eyebrow">SQL exercise {index + 1} of {list.length}</p><h3>{item.prompt}</h3></div>
      {list.length > 1 && <div className="tool-actions"><button className="quiet-button" onClick={() => go(index - 1)}>Previous</button><button className="quiet-button" onClick={() => go(index + 1)}>Next exercise</button></div>}
    </div>
    <details><summary>Schema</summary><pre>{schemaText}</pre></details>
    <label className="field-label" htmlFor={`sql-${item.id}`}>Your SQL</label>
    <textarea id={`sql-${item.id}`} className="code-editor" value={query} onChange={event => setQuery(event.target.value)} spellCheck={false} rows={5} />
    <div className="tool-actions">
      <button className="primary-button small" onClick={run} disabled={!SQL || !query.trim()}>Run</button>
      <button className="quiet-button" disabled={hints >= 2} onClick={() => setHints(hints + 1)}>Hint {hints}/3</button>
      <button className="quiet-button" onClick={() => { setHints(3); setSolution(true); }}>Show model solution</button>
    </div>
    {hints > 0 && <p className="hint">{item.hints[0]}</p>}
    {hints > 1 && <p className="hint">{item.hints[1]}</p>}
    {solution && <pre className="code-sample"><code>{item.solution}</code></pre>}
    <p role="status" className={ok === undefined ? 'status-line' : ok ? 'status-line ok' : 'status-line bad'}>{ok === true ? '✓ ' : ok === false ? '✗ ' : ''}{message}</p>
    {result && <div className="result-table"><table><thead><tr>{result.columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{result.values.map((row, r) => <tr key={r}>{row.map((value, c) => <td key={c}>{String(value ?? 'NULL')}</td>)}</tr>)}</tbody></table></div>}
  </section>;
}

const TIMEOUT_MS = 1500;

export function CodingRunner({ ids }: { ids?: number[] }) {
  const list = ids ? codingTasks.filter(task => ids.includes(task.id)) : codingTasks;
  const [index, setIndex] = useState(0);
  const task = list[index];
  const [code, setCode] = useState(task?.starter ?? '');
  const [outcome, setOutcome] = useState('');
  const [passed, setPassed] = useState<boolean>();
  const [complexity, setComplexity] = useState('');
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const worker = useRef<Worker | undefined>(undefined);
  useEffect(() => () => worker.current?.terminate(), []);
  if (!task) return null;

  function choose(next: number) { worker.current?.terminate(); setIndex(next); setCode(list[next].starter); setOutcome(''); setPassed(undefined); setHint(false); setSolution(false); setComplexity(''); }
  function run() {
    worker.current?.terminate();
    let js: string;
    try { js = toJs(code); } catch (error) { setPassed(false); setOutcome(`Syntax error: ${error instanceof Error ? error.message : String(error)}`); return; }
    setOutcome('Running hidden tests…'); setPassed(undefined);
    const url = URL.createObjectURL(new Blob([buildWorkerSource(js, task.normalize)], { type: 'text/javascript' }));
    const w = new Worker(url);
    worker.current = w;
    const finish = (text: string, pass: boolean) => { clearTimeout(timer); w.terminate(); URL.revokeObjectURL(url); setOutcome(text); setPassed(pass); };
    // Hard timeout: kill the worker; the next run starts a fresh one.
    const timer = window.setTimeout(() => finish(`Timed out after ${TIMEOUT_MS / 1000}s. Check for an infinite loop or a quadratic scan.`, false), TIMEOUT_MS);
    w.onmessage = event => {
      if (event.data.error) return finish(`Error: ${event.data.error}`, false);
      const results: boolean[] = event.data.results;
      const good = results.filter(Boolean).length;
      finish(good === results.length ? `All ${results.length} hidden tests passed. Now state the time and space complexity.` : `${good}/${results.length} hidden tests passed. Re-read the prompt and check edge cases (empty input, duplicates, ties).`, good === results.length);
    };
    w.onerror = event => finish(`Error: ${event.message}`, false);
    w.postMessage(task.tests);
  }
  return <section className="tool-card" aria-label="Coding exercise">
    <p className="eyebrow">Coding exercise {index + 1} of {list.length} · runs in a Web Worker</p>
    {list.length > 1 && <div className="tool-actions">{list.map((item, i) => <button key={item.id} className={index === i ? 'quiet-button selected' : 'quiet-button'} aria-pressed={index === i} onClick={() => choose(i)}>{i + 1}</button>)}</div>}
    <h3>{task.title}</h3>
    <p>{task.prompt}</p>
    <label className="field-label" htmlFor={`code-${task.id}`}>TypeScript or JavaScript (types are stripped, not checked). Define <code>solve</code>.</label>
    <textarea id={`code-${task.id}`} className="code-editor" value={code} onChange={event => setCode(event.target.value)} spellCheck={false} rows={10} />
    <div className="tool-actions">
      <button className="primary-button small" onClick={run}>Run hidden tests</button>
      <button className="quiet-button" onClick={() => setHint(true)}>Hint</button>
      <button className="quiet-button" onClick={() => setSolution(true)}>Show solution</button>
    </div>
    {hint && <p className="hint">{task.hint}</p>}
    <p role="status" className={passed === undefined ? 'status-line' : passed ? 'status-line ok' : 'status-line bad'}>{outcome || `Tests run in a disposable worker that is terminated after ${TIMEOUT_MS / 1000} seconds.`}</p>
    <label className="field-label" htmlFor={`cx-${task.id}`}>Time and space complexity</label>
    <input id={`cx-${task.id}`} className="text-input" placeholder="e.g. O(n) time, O(k) space" value={complexity} onChange={event => setComplexity(event.target.value)} />
    {solution && <><pre className="code-sample"><code>{task.solution}</code></pre><p>Complexity: {task.complexity}</p></>}
  </section>;
}
