import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q12-1', lesson: 12, minutes: 2, source: 'candidate-reported',
    prompt: 'What is OnPush change detection, what triggers an update in an OnPush component, and when would you use it?',
    strongAnswerPoints: ['Default checks the whole tree after any zone.js-detected async event; OnPush skips the component unless something relevant happens.', 'Triggers: changed input reference, event from the component or its template, async-pipe emission, signal change, or explicit markForCheck.', 'Needs immutable data; mutating an array in place will not update the view.', 'Use for large or frequently updating trees; profile first.', 'Analogy: React.memo.'],
    redFlags: ['Says OnPush never updates on its own events', 'Suggests mutating objects with OnPush', 'Applies it everywhere without measuring'] },
  { id: 'q12-2', lesson: 12, minutes: 2,
    prompt: 'A list re-renders slowly when data refreshes, and you hit ExpressionChangedAfterItHasBeenChecked in dev. How do you approach each?',
    strongAnswerPoints: ['List: trackBy (or @for track) with a stable id so DOM rows are reused; same idea as React keys.', 'Check for heavy functions in templates; use pure pipes or computed.', 'The error: a binding changed between the check and the dev-mode verification pass, usually a child or hook changing parent state mid-cycle.', 'Fix the data flow (compute earlier, use a signal or async pipe); setTimeout or detectChanges are last-resort workarounds.'],
    redFlags: ['Only suggests silencing the error with setTimeout', 'Uses index as track key for reorderable data'] },
];
