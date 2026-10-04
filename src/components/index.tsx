import { useState, type ReactNode } from 'react';
import { useLesson } from './LessonContext';
import type { Question } from '../content/types';
import type { Grade } from '../state/model';
import { CodingRunner, SqlPlayground } from '../practice/Playgrounds';

import { Mermaid } from './Mermaid';
import { FileViewer } from './FileViewer';

export function Callout({ title, children, tone = 'note' }: { title?: string; children: ReactNode; tone?: 'note' | 'warn' }) {
  return <aside className={`callout callout-${tone}`}>{title && <strong>{title}</strong>}<div>{children}</div></aside>;
}

/** "You know this from React/TS/FastAPI" box with one line on where the analogy breaks. */
export function Bridge({ from, breaks, children }: { from?: string; breaks: string; children: ReactNode }) {
  return <aside className="bridge-box">
    <strong>You know this from {from ?? 'React / TypeScript / FastAPI'}</strong>
    <div>{children}</div>
    <p className="breaks"><strong>Where the analogy breaks:</strong> {breaks}</p>
  </aside>;
}

export function Collapsible({ title = 'Go deeper', children }: { title?: string; children: ReactNode }) {
  return <details className="deeper"><summary>{title}</summary><div>{children}</div></details>;
}

export function Reveal({ label = 'Reveal', children }: { label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="reveal">
    <button className="quiet-button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide' : label}</button>
    {open && <div className="answer-reveal">{children}</div>}
  </div>;
}

/** Collected by /cheatsheet via the remark plugin; never shown inline. */
export function CheatSheet(_props: { children?: ReactNode }) { return null; }

/** Hidden when compress mode is on. */
export function CompressHide({ children }: { children: ReactNode }) {
  return useLesson().compress ? null : <>{children}</>;
}

export function PartBreak({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="part-divider" role="separator"><strong>{title}</strong>{children && <span>{children}</span>}</div>;
}

export function RevealQuestion({ question, grade, onGrade }: { question: Question; grade?: Grade; onGrade: (grade: Grade) => void }) {
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState('');
  return <article className="question-card">
    {question.source && question.source !== 'general' && <span className="source-tag">{question.source}</span>}
    <p>{question.prompt}</p>
    <textarea className="answer-input" aria-label="Your answer (optional)" value={answer} onChange={event => setAnswer(event.target.value)} placeholder="Write a few bullets, or answer aloud…" />
    <button className="quiet-button" aria-expanded={revealed} onClick={() => setRevealed(!revealed)}>{revealed ? 'Hide strong answer' : 'Reveal strong answer'}</button>
    {revealed && <>
      <div className="answer-reveal">
        <strong>Strong answer includes</strong>
        <ul>{question.strongAnswerPoints.map(point => <li key={point}>{point}</li>)}</ul>
        {question.redFlags.length > 0 && <><strong>Watch out for</strong><ul>{question.redFlags.map(point => <li key={point}>{point}</li>)}</ul></>}
        {question.followUps?.map(item => <p key={item}>Follow-up: {item}</p>)}
      </div>
      <div className="grade-controls" role="group" aria-label="Self-grade your answer">
        {(['missed', 'partial', 'strong'] as Grade[]).map(item => <button key={item} aria-pressed={grade === item} className={grade === item ? 'grade-button graded' : 'grade-button'} onClick={() => onGrade(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}
      </div>
    </>}
  </article>;
}

/** Renders this lesson's questions (from its .questions.ts file). `part` filters Part A / B lessons. */
export function Practice({ part }: { part?: 'A' | 'B' }) {
  const { questions, grades, onGrade } = useLesson();
  const list = questions.filter(question => !part || question.part === part);
  if (!list.length) return null;
  return <div className="question-list">{list.map(question => <RevealQuestion key={question.id} question={question} grade={grades[question.id]} onGrade={grade => onGrade(question.id, grade)} />)}</div>;
}

/** One untimed 60-90 second spoken prompt. Children: a list of "strong answer includes" points. */
export function SayItOut({ prompt, children }: { prompt: string; children: ReactNode }) {
  return <section className="say-prompt">
    <h2>Say it out loud</h2>
    <p>{prompt}</p>
    <details><summary>Strong answer includes</summary><div>{children}</div></details>
  </section>;
}

export function SqlExercise({ ids }: { ids: number[] }) { return <SqlPlayground ids={ids} />; }
export function CodeExercise({ ids }: { ids: number[] }) { return <CodingRunner ids={ids} />; }

/** Lesson 1 only: choose the backend track. */
export function BackendChoice() {
  const { track, setTrack } = useLesson();
  return <fieldset className="backend-choice">
    <legend>Your backend track</legend>
    {([['java', 'Java / Spring Boot (default)'], ['python', 'Python / FastAPI']] as const).map(([value, label]) => <label key={value}>
      <input type="radio" name="track" checked={track === value} onChange={() => setTrack(value)} /> {label}
    </label>)}
    <p className="muted">Lessons 6-9 and 17 swap their bodies. Numbering and order never change. You can switch any time in Settings.</p>
  </fieldset>;
}

export const mdxComponents = { Callout, Bridge, Collapsible, Reveal, CheatSheet, CompressHide, PartBreak, Practice, SayItOut, SqlExercise, CodeExercise, BackendChoice, Mermaid, FileViewer };
