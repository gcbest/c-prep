# Lesson authoring guide

One lesson = `src/content/lessons/NN-slug.mdx` + `NN-slug.questions.ts` (NN = two-digit lesson number).
Lessons 6-9 and 17 also have `NN-slug.python.mdx` (same frontmatter; replaces the body when the Python track is chosen).
See `01-*.mdx` and `02-*.mdx` as the model of tone, length and structure.

## Frontmatter
```
---
number: 7
title: "Backend 2: Dependency injection and configuration"
minutes: 25
day: 1
optional: true   # only lessons 23 and 24
---
```
Quote titles containing a colon.

## Template (in this order, use `##` headings)
1. `## Why this matters` 2-3 sentences. Label any interview-frequency claim "candidate-reported" (or "job-description" / "job-posting-reported"). Never promise a question will be asked.
2. `## Core idea` the minimum. For Java/Angular/Spring/RxJS use `<Bridge from="React / TypeScript / FastAPI" breaks="one line"> ...analogy... </Bridge>`.
3. `## Example` one short code sample (fenced, with a language: `java`, `ts`, `html`, `sql`, `python`, `yaml`, `text`).
4. `## Practice` any interactive tool for the lesson, then `<Practice />` (renders the questions file; use `<Practice part="A" />` in 25/26).
5. `<SayItOut prompt="..."> - bullet list of "strong answer includes" </SayItOut>` (it renders its own heading; one prompt, 60-90 s, untimed).
6. `<Collapsible>` (title defaults to "Go deeper"; set `title=` for specific ones). Collapsed by default.
7. `<CheatSheet>` with 3-6 bullets (blank line after the opening tag and before the closing tag, so the list parses as markdown). It is not shown inline.

Length: under ~900 words of prose plus code and practice; at most 5 `##` sections before Practice. Prefer cutting over adding. Substantive, correct, concrete content; no placeholders, no filler.

## Components
`Bridge`, `Callout` (`tone="warn"`), `Collapsible`, `Reveal` (`label=`, hides children), `Practice`, `SayItOut`, `CheatSheet`, `CompressHide` (wrap content hidden in compress mode), `PartBreak` (`title=`; marks Part A / Part B in 25 and 26), `SqlExercise ids={[..]}`, `CodeExercise ids={[..]}`, `Mermaid chart={`...`}` (only lessons 22, 25; static diagrams), `FileViewer files={[{name, code}]} steps={[{title, body}]}` (read-only multi-file viewer; for lesson 17).
Exercise ids: SQL lesson 2 = 1-7, lesson 3 = 8-13, lesson 4 = 14-20. Coding lesson 18 = 1-3, 19 = 4-6, 20 = 7-9.

## MDX gotchas
- A literal `<`, `>` or `{` in prose must be in backticks or escaped (`\{`). Generics like `List<String>` go in backticks or fenced code.
- Leave a blank line between a JSX tag and markdown inside it.
- GFM tables and task lists work. Do not use HTML comments (`<!-- -->`); use `{/* */}` if needed.
- Props that contain code (Mermaid chart, FileViewer files) must be JS template literals: `chart={`graph TD; A-->B`}`; escape backticks and `${`.
- Do not import anything; components are provided.

## Questions file
```ts
import type { Question } from '../types';
export const questions: Question[] = [
  { id: 'q7-1', lesson: 7, minutes: 2, source: 'candidate-reported',
    prompt: '...', strongAnswerPoints: ['...'], redFlags: ['...'], followUps: ['...'] },
];
```
Ids are `q<lesson>-<n>`. EXACT counts per lesson (the bank totals 79):
L1:0 L2:4 L3:4 L4:4 L5:4 L6:3 L7:4 L8:3 L9:4 L10:3 L11:3 L12:2 L13:4 (2 Angular + 2 RxJS) L14:4 L15:2 L16:3 L17:3 L18:2 L19:1 L20:1 L21:4 L22:4 L23:0 L24:3 L25:4 (2 security + 2 architecture) L26:6 (3 with part:'A', 3 with part:'B') L27:0.
Questions must work for both backend tracks: where relevant, put the Spring point and the FastAPI equivalent in `strongAnswerPoints`.
`source` is optional: 'candidate-reported' | 'job-description' | 'job-posting-reported' | 'general'. Only use candidate-reported for the topics in the spec's context paragraph (Spring/Angular/SQL split, failing test, equals/hashCode, checked vs unchecked, log/event counting, later rounds: Spring Boot, exception handling, microservices, messaging, caching, threading, system design).
Only lessons with 0 questions may omit `<Practice />` (L1, L23, L27); give them a Reveal or exercise instead.

## Don'ts
Do not edit files outside your assigned lesson files. No timers, no gamification, no live LLM calls, no confidential employer details. Code samples must be correct and idiomatic for the era (show NgModule + standalone, `*ngIf` + `@if` side by side in Angular lessons).
