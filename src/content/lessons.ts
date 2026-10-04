import type { ComponentType } from 'react';
import type { LessonMeta, Question } from './types';

export type { Question, LessonMeta } from './types';
type Mdx = { default: ComponentType; frontmatter: LessonMeta };

export type Lesson = LessonMeta & {
  Body: ComponentType;
  /** Python-track body (lessons 6-9 and 17 only). Same number, same position. */
  PythonBody?: ComponentType;
  pythonCheatsheet?: string[];
  questions: Question[];
};

const bodies = import.meta.glob<Mdx>('./lessons/*.mdx', { eager: true });
const questionFiles = import.meta.glob<{ questions: Question[] }>('./lessons/*.questions.ts', { eager: true });
const fileNumber = (path: string) => Number(path.split('/').pop()!.slice(0, 2));

export const lessons: Lesson[] = Object.entries(bodies)
  .filter(([path]) => !path.endsWith('.python.mdx'))
  .map(([path, mod]) => {
    const number = fileNumber(path);
    const python = Object.entries(bodies).find(([p]) => p.endsWith('.python.mdx') && fileNumber(p) === number)?.[1];
    const questions = Object.entries(questionFiles).find(([p]) => fileNumber(p) === number)?.[1].questions ?? [];
    return { ...mod.frontmatter, Body: mod.default, PythonBody: python?.default, pythonCheatsheet: python?.frontmatter.cheatsheet, questions };
  })
  .sort((a, b) => a.number - b.number);

export const questions: Question[] = lessons.flatMap(lesson => lesson.questions);
export const lessonByNumber = (n: number) => lessons.find(item => item.number === n);
export const dayTitles: Record<number, string> = { 1: 'SQL, Java, Backend, Angular Start', 2: 'Front End, Testing, Coding', 3: 'Security, Design, Leadership, Review' };
export const lessonMinutes = (lesson: Lesson) => lesson.minutes;
export const visibleLessons = (compress: boolean) => lessons.filter(item => !compress || !item.optional);

/** Compress mode: same order, split across two days by cumulative minutes. */
export function compressedDayAssignments(): Record<number, number> {
  const visible = visibleLessons(true);
  const total = visible.reduce((sum, lesson) => sum + lesson.minutes, 0);
  let elapsed = 0;
  return Object.fromEntries(visible.map(lesson => {
    // A lesson belongs to day 1 if it starts before the halfway mark.
    const day = elapsed < total / 2 ? 1 : 2;
    elapsed += lesson.minutes;
    return [lesson.number, day];
  }));
}
