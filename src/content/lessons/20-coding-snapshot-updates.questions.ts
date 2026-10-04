import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q20-1', lesson: 20, minutes: 4, source: 'candidate-reported',
    prompt: 'Events for risk positions arrive out of order, with duplicates and deletes. How do you compute the current total by category and detect missing events?',
    strongAnswerPoints: ['Map keyed by id holding the newest state; apply only if the version is higher (equal is stale, so replays are idempotent).', 'A delete removes the id; consider tombstones if late older updates could resurrect it.', 'Total by category at the end, or incrementally by subtracting the old value.', 'Gaps: collect sequence numbers and scan min to max for missing ones.', 'O(n) time; clarify and test stale, equal, deleted and orphan cases.'],
    redFlags: ['Trusts arrival order', 'Double-counts an updated id', 'Ignores deletes'],
    followUps: ['How would this work on a stream that never ends?'] },
];
