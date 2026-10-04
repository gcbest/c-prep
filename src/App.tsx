import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import QRCode from 'qrcode';
import { lessons, questions, lessonByNumber, dayTitles, compressedDayAssignments, visibleLessons, type Lesson } from './content/lessons';
import { CodingRunner, SqlPlayground } from './practice/Playgrounds';
import { LessonContext } from './components/LessonContext';
import { mdxComponents, RevealQuestion } from './components';
import { MDXProvider } from '@mdx-js/react';
import { loadState, mergeState, record, recordValue, STATE_KEY, type AppState, type Grade } from './state/model';
import { GIST_ID_KEY, isSyncConnected, SyncManager, type SyncStatus } from './sync/gist';
import './styles.css';

type RecordMapName = 'completed' | 'skipped' | 'grades' | 'notes' | 'stories' | 'settings';
const dayTimes: Record<number, string> = { 1: 'about 4.5 hours', 2: 'about 4.5 hours', 3: 'about 3.75 hours' };
const routePath = () => window.location.hash.replace(/^#/, '') || '/';
function Link({ to, children, className }: { to: string; children: ReactNode; className?: string }) { return <a href={`#${to}`} className={className}>{children}</a>; }
function nextPath(current: number, compress: boolean) { const list = visibleLessons(compress); return list.find(item => item.number > current)?.number ?? current; }
function getNextLesson(state: AppState, compress: boolean) {
  const path = visibleLessons(compress);
  return path.find(lesson => !recordValue<boolean>(state.completed, String(lesson.number), false) && !recordValue<boolean>(state.skipped, String(lesson.number), false))
    ?? path.find(lesson => !recordValue<boolean>(state.completed, String(lesson.number), false))
    ?? path[0];
}
function getLessonDay(lesson: Lesson, compress: boolean) { return compress ? compressedDayAssignments()[lesson.number] ?? 1 : lesson.day; }
function dayDuration(day: number, compress: boolean) { return compress ? formatMinutes(visibleLessons(true).filter(lesson => getLessonDay(lesson, true) === day).reduce((sum, lesson) => sum + lesson.minutes, 0)) : dayTimes[day]; }
function formatMinutes(minutes: number) { return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60 ? `${minutes % 60}m` : ''}`.trim() : `${minutes} min`; }

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [route, setRoute] = useState(routePath);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ state: 'idle', message: 'Not connected' });
  const [menuOpen, setMenuOpen] = useState(false);
  const stateRef = useRef(state); stateRef.current = state;
  const manager = useMemo(() => new SyncManager(() => stateRef.current, setState), []);
  const compress = Boolean(recordValue(state.settings, 'compress', false));
  const focusDefault = recordValue<boolean>(state.settings, 'focusMode', true) ?? true;
  const [focus, setFocus] = useState(focusDefault);
  const track = recordValue<'java' | 'python'>(state.settings, 'backendTrack', 'java') ?? 'java';
  const storedDark = recordValue<boolean>(state.settings, 'darkMode');
  const [systemDark, setSystemDark] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches === true);
  const dark = storedDark ?? systemDark;
  const toggleDark = useCallback(() => storeSetting('darkMode', !dark), [dark, storeSetting]);
  const connected = typeof localStorage !== 'undefined' && isSyncConnected();

  useEffect(() => { const handle = () => setRoute(routePath()); window.addEventListener('hashchange', handle); return () => window.removeEventListener('hashchange', handle); }, []);
  useEffect(() => { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111821' : '#f7f8fa');
  }, [dark]);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!query) return undefined;
    const handle = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    query.addEventListener('change', handle);
    return () => query.removeEventListener('change', handle);
  }, []);
  useEffect(() => manager.subscribe(setSyncStatus), [manager]);
  useEffect(() => { if (connected) return manager.start(); return undefined; }, [manager, connected]);
  useEffect(() => { setFocus(focusDefault); }, [focusDefault]);

  const persist = useCallback((transform: (previous: AppState) => AppState, shouldSync = true) => {
    setState(previous => {
      const updated = transform(previous);
      return { ...updated, revision: Math.max(updated.revision, previous.revision) + 1, updatedAt: new Date().toISOString() };
    });
    if (shouldSync && connected) manager.schedule();
  }, [connected, manager]);
  const setRecord = useCallback((map: RecordMapName, id: string, value: unknown, deleted = false) => {
    persist(previous => {
      const nextRecord = { ...record(value, previous.deviceId), ...(deleted ? { deleted: true } : {}) };
      switch (map) {
        case 'completed': return { ...previous, completed: { ...previous.completed, [id]: nextRecord } };
        case 'skipped': return { ...previous, skipped: { ...previous.skipped, [id]: nextRecord } };
        case 'grades': return { ...previous, grades: { ...previous.grades, [id]: nextRecord } };
        case 'notes': return { ...previous, notes: { ...previous.notes, [id]: nextRecord } };
        case 'stories': return { ...previous, stories: { ...previous.stories, [id]: nextRecord } };
        case 'settings': return { ...previous, settings: { ...previous.settings, [id]: nextRecord } };
      }
    });
  }, [persist]);
  const moveCurrentLesson = useCallback((number: number) => {
    persist(previous => ({ ...previous, currentLesson: number, currentLessonUpdatedAt: new Date().toISOString(), currentLessonDeviceId: previous.deviceId }));
  }, [persist]);

  const lessonMatch = route.match(/^\/lesson\/(\d+)$/);
  const dayMatch = route.match(/^\/day\/(\d+)$/);
  const currentLesson = lessonMatch ? lessonByNumber(Number(lessonMatch[1])) : undefined;
  const currentDay = dayMatch ? Number(dayMatch[1]) : currentLesson ? getLessonDay(currentLesson, compress) : 1;
  const isLesson = Boolean(currentLesson);
  useEffect(() => { if (currentLesson && state.currentLesson !== currentLesson.number) moveCurrentLesson(currentLesson.number); }, [currentLesson?.number, state.currentLesson, moveCurrentLesson]);
  const focusMode = isLesson && focus;
  const doneCount = Object.values(state.completed).filter(item => !item.deleted && item.value === true).length;
  const skippedCount = Object.values(state.skipped).filter(item => !item.deleted && item.value === true).length;
  const progress = Math.min(100, Math.round(doneCount / visibleLessons(compress).length * 100));

  function storeSetting(key: string, value: unknown) { setRecord('settings', key, value); }
  function completeLesson(lesson: Lesson, skipped = false) {
    if (skipped) { setRecord('skipped', String(lesson.number), true); setRecord('completed', String(lesson.number), false, true); }
    else { setRecord('completed', String(lesson.number), true); setRecord('skipped', String(lesson.number), false, true); }
    const next = nextPath(lesson.number, compress);
    if (next !== lesson.number) { moveCurrentLesson(next); window.location.hash = `/lesson/${next}`; }
  }

  return <div className="app-shell">
    {route === '/' || route === '' ? <main className="home-page">
      <div className="home-status">{connected && <span className={`sync-dot ${syncStatus.state}`} title={syncStatus.message} aria-label={`Sync ${syncStatus.state}`} />}<ThemeToggle dark={dark} onToggle={toggleDark} /></div>
      <p className="eyebrow">Citi · Enterprise Risk Technology</p>
      <h1>Full-stack interview prep</h1>
      <p className="home-purpose">A calm, step-by-step plan for your Senior Full-Stack Developer interview.</p>
      <Link className="primary-button home-cta" to={`/lesson/${getNextLesson(state, compress)?.number ?? 1}`}>{doneCount || skippedCount ? `Continue: ${getNextLesson(state, compress)?.title ?? 'Final review'}` : 'Start Day 1'}</Link>
      <div className="home-outline" aria-label="Study plan outline">{(compress ? [1, 2] : [1, 2, 3]).map(day => <details key={day}>
        <summary><span>Day {day}</span><span>{dayDuration(day, compress)}</span></summary>
        <p>{compress ? `Compressed study path · ${visibleLessons(compress).filter(item => getLessonDay(item, compress) === day).length} lessons` : `${dayTitles[day]} · ${visibleLessons(compress).filter(item => getLessonDay(item, compress) === day).length} lessons`}</p>
        <Link to={`/day/${day}`}>View day outline</Link>
      </details>)}</div>
      <div className="home-progress"><div className="progress-copy"><span>Progress</span><span>{doneCount} of {visibleLessons(compress).length} lessons</span></div><div className="progress-track" role="progressbar" aria-label="Study progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div></div>
    </main> : <>
      {!focusMode && <header className="topbar"><Link to="/" className="wordmark">Citi interview prep</Link><nav className={menuOpen && !isLesson && !dayMatch ? 'mobile-nav-open' : ''} aria-label="Main navigation"><Link to="/progress">Progress</Link><Link to="/practice">Practice</Link><Link to="/cheatsheet">Cheat sheet</Link><Link to="/settings">Settings</Link></nav>{!isLesson && !dayMatch && <button className="mobile-menu-button" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰ <span className="sr-only">Open site navigation</span></button>}<ThemeToggle dark={dark} onToggle={toggleDark} /></header>}
      <div className={`page-layout ${focusMode ? 'focus-layout' : ''} ${!focusMode && !(isLesson || dayMatch) ? 'no-sidebar' : ''}`}>
        {!focusMode && (isLesson || dayMatch) && <>
          <button className="mobile-menu-button mobile-menu-in-layout" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰ Lesson outline</button>
          {menuOpen && <button className="drawer-backdrop" aria-label="Close lesson menu" onClick={() => setMenuOpen(false)} />}
          <aside className={`lesson-sidebar ${menuOpen ? 'drawer-open' : ''}`} aria-label="Lesson outline">{[1, 2, ...(compress ? [] : [3])].map(day => <details key={day} open={day === currentDay}><summary>Day {day}<span className="sidebar-time">{dayTimes[day]}</span></summary><ol>{visibleLessons(compress).filter(lesson => getLessonDay(lesson, compress) === day).map(lesson => <li key={lesson.number}><Link className={currentLesson?.number === lesson.number ? 'active' : ''} to={`/lesson/${lesson.number}`}><span className="lesson-number">{lesson.number}</span><span>{lesson.title}</span>{recordValue(state.completed, String(lesson.number), false) && <span aria-label="Complete">✓</span>}</Link></li>)}</ol></details>)}</aside>
        </>}
        <main className={`main-content ${focusMode ? 'focus-content' : ''}`}>
          {isLesson && currentLesson ? <LessonPage lesson={currentLesson} track={track} state={state} focus={focus} setFocus={setFocus} setRecord={setRecord} storeSetting={storeSetting} completeLesson={completeLesson} compress={compress} syncStatus={syncStatus} />
          : dayMatch ? <DayPage day={currentDay} state={state} compress={compress} />
          : route === '/progress' ? <ProgressPage state={state} compress={compress} />
          : route === '/cheatsheet' ? <CheatSheetPage state={state} compress={compress} track={track} />
          : route === '/practice' ? <PracticePage state={state} setRecord={setRecord} />
          : route === '/settings' ? <SettingsPage state={state} setRecord={setRecord} manager={manager} status={syncStatus} dark={dark} />
          : <NotFound />}
        </main>
      </div>
      {!focusMode && <footer className="site-footer"><span>Progress is saved on this device.</span>{connected && <span>{syncStatus.message}</span>}</footer>}
    </>}
  </div>;
}

function LessonPage({ lesson, state, focus, setFocus, setRecord, storeSetting, completeLesson, compress, syncStatus, track }: {
  lesson: Lesson; state: AppState; focus: boolean; setFocus: (value: boolean) => void;
  setRecord: (map: RecordMapName, id: string, value: unknown, deleted?: boolean) => void;
  storeSetting: (key: string, value: unknown) => void; completeLesson: (lesson: Lesson, skipped?: boolean) => void;
  compress: boolean; syncStatus: SyncStatus; track: 'java' | 'python';
}) {
  const done = Boolean(recordValue<boolean>(state.completed, String(lesson.number), false));
  const skipped = Boolean(recordValue<boolean>(state.skipped, String(lesson.number), false));
  const path = visibleLessons(compress);
  const previous = [...path].reverse().find(item => item.number < lesson.number);
  const next = path.find(item => item.number > lesson.number);
  const [note, setNote] = useState(recordValue<string>(state.notes, String(lesson.number), '') ?? '');
  useEffect(() => setNote(recordValue<string>(state.notes, String(lesson.number), '') ?? ''), [lesson.number, state.notes]);
  const saveNote = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function changeNote(value: string) { setNote(value); clearTimeout(saveNote.current); saveNote.current = setTimeout(() => setRecord('notes', String(lesson.number), value), 400); }
  const Body = track === 'python' && lesson.PythonBody ? lesson.PythonBody : lesson.Body;
  const grades = useMemo(() => Object.fromEntries(lesson.questions.map(q => [q.id, recordValue<Grade>(state.grades, q.id)])), [lesson.questions, state.grades]);
  const context = useMemo(() => ({
    lesson: lesson.number, questions: lesson.questions, grades, compress, track,
    onGrade: (id: string, grade: Grade) => setRecord('grades', id, grade),
    setTrack: (value: 'java' | 'python') => storeSetting('backendTrack', value),
  }), [lesson, grades, compress, track, setRecord, storeSetting]);
  const day = getLessonDay(lesson, compress);
  return <article className="lesson-article">
    <div className="lesson-progress-strip"><span style={{ width: `${Math.round(lesson.number / lessons.length * 100)}%` }} /></div>
    <div className="lesson-toolbar"><Link to={previous ? `/lesson/${previous.number}` : `/day/${day}`} className="back-link">← Back</Link><span className="lesson-count">Lesson {lesson.number} of {lessons.length}</span><button className="focus-toggle" aria-pressed={focus} onClick={() => { setFocus(!focus); storeSetting('focusMode', !focus); }}>{focus ? 'Exit focus mode' : 'Focus mode'}</button>{focus && syncStatus.state === 'synced' && <span className="sr-only">Synced</span>}</div>
    <p className="eyebrow">Day {day} · {formatMinutes(lesson.minutes)}{lesson.optional ? ' · Optional' : ''}</p>
    <h1>{lesson.title}</h1>
    <LessonContext.Provider value={context}>
      <MDXProvider components={mdxComponents}><div className="lesson-body"><Body /></div></MDXProvider>
    </LessonContext.Provider>
    {lesson.number === 26 && <section className="lesson-section"><h2>Story notes</h2><p>Use Situation / Ownership / Actions / Result / Learning. Do not include confidential employer details; notes sync through your secret, unlisted Gist.</p>{[1, 2, 3, 4].map(index => <label key={index} className="field-label">Story {index}<textarea className="story-input" value={recordValue<string>(state.stories, `story-${index}`, '') ?? ''} onChange={event => setRecord('stories', `story-${index}`, event.target.value)} placeholder="Situation · Ownership · Actions · Result · Learning" /></label>)}</section>}
    {lesson.number !== 26 && <section className="lesson-section"><label className="field-label" htmlFor="lesson-note">Private study note <span>(do not enter confidential employer information)</span></label><textarea id="lesson-note" className="note-input" value={note} onChange={event => changeNote(event.target.value)} placeholder="A short personal reminder…" /></section>}
    <footer className="lesson-footer"><div className="lesson-meta">Estimated {formatMinutes(lesson.minutes)} · {done ? 'Complete' : skipped ? 'Skipped' : 'In progress'}</div><div className="lesson-actions"><button className="quiet-button" onClick={() => completeLesson(lesson, true)}>Skip for now</button>{!done && <button className="quiet-button" onClick={() => { setRecord('completed', String(lesson.number), true); setRecord('skipped', String(lesson.number), false, true); }}>Mark complete</button>}{next ? <button className="primary-button small" onClick={() => completeLesson(lesson)}>Next lesson</button> : <Link className="primary-button small" to="/progress">Finish: view progress</Link>}</div></footer>
  </article>;
}

function DayPage({ day, state, compress }: { day: number; state: AppState; compress: boolean }) {
  const items = visibleLessons(compress).filter(lesson => getLessonDay(lesson, compress) === day);
  const next = getNextLesson(state, compress);
  return <section className="standard-page"><p className="eyebrow">Study path · Day {day}</p><h1>{dayTitles[day] ?? `Day ${day}`}</h1><p>Follow the lessons in order. You may skip a lesson and return to it later.</p><ol className="day-list">{items.map(lesson => { const done = recordValue(state.completed, String(lesson.number), false); const skipped = recordValue(state.skipped, String(lesson.number), false); return <li key={lesson.number}><Link to={`/lesson/${lesson.number}`}><span className="lesson-number">{lesson.number}</span><span className="day-lesson-title">{lesson.title}{lesson.optional && <small>Optional</small>}</span><span>{formatMinutes(lesson.minutes)}</span><span className="lesson-status">{done ? 'Done' : skipped ? 'Skipped' : next?.number === lesson.number ? 'Next' : ''}</span></Link></li>; })}</ol><Link className="primary-button small" to={`/lesson/${next?.number ?? items[0]?.number ?? 1}`}>Continue path →</Link></section>;
}

function ProgressPage({ state, compress }: { state: AppState; compress: boolean }) {
  const weak = questions.filter(question => ['missed', 'partial'].includes(String(recordValue(state.grades, question.id, '')))).filter(question => recordValue(state.grades, question.id) !== 'strong');
  const skips = Object.entries(state.skipped).filter(([, value]) => !value.deleted && value.value === true).map(([id]) => Number(id)).sort((a,b) => a-b);
  const completed = Object.entries(state.completed).filter(([, value]) => !value.deleted && value.value === true).map(([id]) => Number(id)).sort((a,b) => a-b);
  return <section className="standard-page"><p className="eyebrow">Your progress</p><h1>Review what matters</h1><div className="progress-summary"><strong>{completed.length} complete</strong><span> · </span><strong>{skips.length} skipped</strong><span> · </span><strong>{weak.length} to review</strong></div><h2>Review these</h2>{weak.length ? <ul className="review-list">{weak.map(question => <li key={question.id}><Link to={`/lesson/${question.lesson}`}>Lesson {question.lesson}: {question.prompt}</Link><span>{recordValue(state.grades, question.id)}</span></li>)}</ul> : <p>No missed or partial answers yet. Grade practice answers to build this list.</p>}<h2>Skipped</h2>{skips.length ? <ul className="review-list">{skips.map(number => { const lesson = lessonByNumber(number); return <li key={number}><Link to={`/lesson/${number}`}>Lesson {number}: {lesson?.title}</Link><button className="text-button" onClick={() => { window.location.hash = `/lesson/${number}`; }}>Return</button></li>; })}</ul> : <p>No skipped lessons.</p>}<h2>Completed lessons</h2><p>{completed.length ? completed.map(number => lessonByNumber(number)?.title).filter(Boolean).join(' · ') : 'Your completed lessons will appear here.'}</p><Link className="primary-button small" to={`/lesson/${getNextLesson(state, compress)?.number ?? 1}`}>Review next lesson</Link></section>;
}

function CheatSheetPage({ state, compress, track }: { state: AppState; compress: boolean; track: 'java' | 'python' }) {
  const weakIds = new Set(questions.filter(q => ['missed', 'partial'].includes(String(recordValue(state.grades, q.id, '')))).map(q => q.lesson));
  const items = [...visibleLessons(compress)].sort((a,b) => Number(weakIds.has(b.number)) - Number(weakIds.has(a.number)) || a.number - b.number);
  return <section className="standard-page cheatsheet-page"><div className="print-hide"><p className="eyebrow">Collected lesson takeaways</p><h1>Cheat sheet</h1><p>Weak lessons appear first. Use your browser’s Print command for a one-pager.</p><button className="primary-button small" onClick={() => window.print()}>Print cheat sheet</button></div><div className="cheat-sheet-grid">{items.map(lesson => <section key={lesson.number}><h2>{lesson.number}. {lesson.title}{weakIds.has(lesson.number) && <small> · Review</small>}</h2><ul>{(track === 'python' && lesson.pythonCheatsheet ? lesson.pythonCheatsheet : lesson.cheatsheet).map(point => <li key={point}>{point}</li>)}</ul></section>)}</div></section>;
}

function PracticePage({ state, setRecord }: { state: AppState; setRecord: (map: RecordMapName, id: string, value: unknown, deleted?: boolean) => void }) {
  const [mode, setMode] = useState<'questions'|'sql'|'code'>('questions');
  return <section className="standard-page"><p className="eyebrow">Practice tools</p><h1>Practice without a timer</h1><p>No mock interview or live AI calls. Work through a question, run a query, or test a coding pattern.</p><div className="practice-tabs" role="tablist">{(['questions','sql','code'] as const).map(item => <button role="tab" aria-selected={mode === item} className={mode === item ? 'selected' : ''} key={item} onClick={() => setMode(item)}>{item === 'questions' ? 'Reveal questions' : item === 'sql' ? 'SQL playground' : 'Coding runner'}</button>)}</div>{mode === 'questions' ? <div className="question-list">{questions.map(question => <RevealQuestion key={question.id} question={question} grade={recordValue<Grade>(state.grades, question.id)} onGrade={grade => setRecord('grades', question.id, grade)} />)}</div> : mode === 'sql' ? <SqlPlayground /> : <CodingRunner />}</section>;
}

function SettingsPage({ state, setRecord, manager, status, dark }: { state: AppState; setRecord: (map: RecordMapName, id: string, value: unknown, deleted?: boolean) => void; manager: SyncManager; status: SyncStatus; dark: boolean }) {
  const [token, setToken] = useState(''); const [gistId, setGistId] = useState(localStorage.getItem(GIST_ID_KEY) ?? '');
  const [message, setMessage] = useState(''); const [qr, setQr] = useState(''); const [busy, setBusy] = useState(false);
  const [importError, setImportError] = useState('');
  const track = recordValue<'java'|'python'>(state.settings, 'backendTrack', 'java') ?? 'java';
  const compress = recordValue<boolean>(state.settings, 'compress', false) ?? false;
  const connected = isSyncConnected();
  useEffect(() => { if (gistId) QRCode.toDataURL(gistId, { margin: 1, width: 150, errorCorrectionLevel: 'M' }).then(setQr).catch(() => setQr('')); else setQr(''); }, [gistId]);
  async function runSync(action: 'create'|'find'|'sync'|'pull'|'push') {
    setMessage(''); setBusy(true);
    try {
      if (action === 'create') { if (!token) throw new Error('Paste a GitHub token first.'); const id = await manager.createGist(token, state); setToken(''); setGistId(id); setMessage('Sync Gist created. Save the ID for your other device.'); await manager.sync(); }
      else if (action === 'find') { const id = await manager.findGist(token); setToken(''); setGistId(id); setMessage('Gist found. Syncing progress…'); await manager.sync(); }
      else if (action === 'pull') { if (!window.confirm('Replace local progress with the Gist contents? This does not merge.')) return; await manager.sync({ force: 'pull' }); }
      else if (action === 'push') { if (!window.confirm('Replace the Gist contents with this device’s local state? This does not merge.')) return; await manager.sync({ force: 'push' }); }
      else await manager.sync();
      setMessage(manager.status.message);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Action failed.'); }
    finally { setBusy(false); }
  }
  function exportState() { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'interview-prep-state.json'; a.click(); URL.revokeObjectURL(url); }
  async function importFile(file?: File) { if (!file) return; try { const imported = JSON.parse(await file.text()) as AppState; if (imported.schemaVersion !== 1 || !imported.deviceId) throw new Error('Unsupported or invalid progress file.'); const merged = mergeState(state, imported); localStorage.setItem(STATE_KEY, JSON.stringify(merged)); window.location.reload(); } catch (error) { setImportError(error instanceof Error ? error.message : 'Could not import file.'); } }
  return <section className="standard-page"><p className="eyebrow">Preferences and sync</p><h1>Settings</h1><div className="settings-group"><h2>Study path</h2><label className="field-label">Backend track<select className="text-input" value={track} onChange={event => setRecord('settings', 'backendTrack', event.target.value)}><option value="java">Java / Spring (default)</option><option value="python">Python / FastAPI</option></select></label><p>Lessons 6–9 and 17 change bodies by track; lesson numbers and order remain the same. Java essentials remain recommended on both.</p><label className="check-row"><input type="checkbox" checked={compress} onChange={event => setRecord('settings', 'compress', event.target.checked)} />Compress into 2 days (hides optional lessons 23–24)</label><label className="check-row"><input type="checkbox" checked={dark} onChange={event => setRecord('settings', 'darkMode', event.target.checked)} />Dark mode</label></div>
    <div className="settings-group"><h2>Cross-device sync · GitHub Gist</h2><div className="warning-box"><strong>Secret Gists are unlisted, not private.</strong> Anyone with the Gist URL can read it. Sync only study progress and non-confidential notes; never enter confidential employer information. Use a classic personal access token with only the <code>gist</code> scope and a short expiry. A fine-grained token with Gists read/write may also work if your account offers it.</div><ol className="sync-steps"><li><strong>1. Token</strong><label className="field-label" htmlFor="gist-token">Paste GitHub token (kept only on this device)</label><input id="gist-token" type="password" autoComplete="off" className="text-input" value={token} onChange={event => setToken(event.target.value)} placeholder={connected ? 'Token stored on this device' : 'ghp_…'} /><small>Create it in GitHub settings with only gist scope. Avoid shared computers and revoke it after the interview.</small></li><li><strong>2. Create or find your sync Gist</strong><div className="tool-actions"><button className="primary-button small" disabled={busy || !token} onClick={() => void runSync('create')}>Create sync Gist</button><button className="quiet-button" disabled={busy || !token} onClick={() => void runSync('find')}>Find my Gist</button></div><label className="field-label" htmlFor="gist-id">Gist ID on another device</label><div className="inline-fields"><input id="gist-id" className="text-input" value={gistId} onChange={event => setGistId(event.target.value)} placeholder="Paste Gist ID" /><button className="quiet-button" onClick={() => { if (gistId.trim()) { localStorage.setItem(GIST_ID_KEY, gistId.trim()); setMessage('Gist ID saved on this device.'); } }}>Use ID</button></div>{gistId && <div className="gist-qr"><img src={qr} alt="QR code containing only the Gist ID" /><code>{gistId}</code><button className="text-button" onClick={() => navigator.clipboard?.writeText(gistId)}>Copy ID</button></div>}</li><li><strong>3. Confirm sync</strong><div className="tool-actions"><button className="primary-button small" disabled={busy || !connected} onClick={() => void runSync('sync')}>Sync now</button><button className="quiet-button" disabled={busy || !connected} onClick={() => void runSync('pull')}>Force pull</button><button className="quiet-button" disabled={busy || !connected} onClick={() => void runSync('push')}>Force push</button></div><p role="status">{busy ? 'Syncing…' : message || status.message}</p>{connected && <button className="text-button danger-text" onClick={() => { if (window.confirm('Disconnect and erase this device’s saved token and Gist ID?')) { manager.disconnect(); setGistId(''); setMessage('Token and Gist ID erased from this device.'); } }}>Disconnect and erase token</button>}</li></ol><p className="security-note">Sync triggers on app open, tab focus, online, 10 seconds after changes, and when the page becomes hidden. Local changes are kept if sync fails. Gist updates are merged record-by-record; concurrent writes get a bounded verification retry.</p></div>
    <div className="settings-group"><h2>Export and import fallback</h2><p>Exports never include the GitHub token. Import merges records rather than blindly replacing local progress.</p><div className="tool-actions"><button className="quiet-button" onClick={exportState}>Export JSON</button><label className="quiet-button file-button">Import JSON<input type="file" accept="application/json" onChange={event => void importFile(event.target.files?.[0])} /></label></div>{importError && <p role="alert" className="error-text">{importError}</p>}</div><p className="device-name">This device: <code>{state.deviceId}</code></p></section>;
}
function NotFound() { return <section className="standard-page"><h1>Page not found</h1><Link className="primary-button small" to="/">Return home</Link></section>; }
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
  return <button type="button" className="theme-toggle" aria-pressed={dark} aria-label={label} title={label} onClick={onToggle}><span aria-hidden="true">{dark ? '☀' : '☾'}</span><span className="sr-only">{label}</span></button>;
}
