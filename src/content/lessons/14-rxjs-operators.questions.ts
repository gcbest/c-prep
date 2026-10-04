import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q14-1', lesson: 14, minutes: 2, source: 'candidate-reported',
    prompt: 'Compare switchMap, mergeMap, concatMap and exhaustMap. Which would you use for a type-ahead search, a save button, and ordered writes?',
    strongAnswerPoints: ['switchMap cancels the previous inner observable: type-ahead.', 'exhaustMap ignores new outer values while busy: save/login button.', 'concatMap queues and preserves order: ordered writes.', 'mergeMap runs in parallel, optionally bounded with a concurrency argument.', 'React analogy: AbortController in useEffect cleanup is what switchMap does.'],
    redFlags: ['Treats them as interchangeable', 'Uses mergeMap for type-ahead or ordered writes'] },
  { id: 'q14-2', lesson: 14, minutes: 2, source: 'candidate-reported',
    prompt: 'Why is subscribing inside another subscribe a bug, and what do you do instead?',
    strongAnswerPoints: ['No cancellation, so inner subscriptions leak and race.', 'No ordering or concurrency policy and weak error propagation.', 'Use a flattening operator (switchMap, concatMap, ...) with one outer subscription, ideally the async pipe.'],
    redFlags: ['Says it works so it is fine', 'Cannot name a flattening operator'] },
  { id: 'q14-3', lesson: 14, minutes: 2,
    prompt: 'Where do you put catchError in a search-as-you-type stream, and why?',
    strongAnswerPoints: ['Inside the inner observable, on the HTTP call.', 'An error reaching the outer stream completes it, so later keystrokes do nothing.', 'Return a fallback such as of([]) and optionally show an error state.', 'retry goes before catchError if you want retries.'],
    redFlags: ['Puts catchError only at the end of the outer pipe and expects the stream to continue'] },
  { id: 'q14-4', lesson: 14, minutes: 2,
    prompt: 'What is the difference between hot and cold observables, and how do you avoid leaks from long-lived subscriptions?',
    strongAnswerPoints: ['Cold: each subscriber triggers its own execution (HttpClient). Hot: source emits regardless (events, Subject).', 'shareReplay shares one execution across subscribers.', 'Unsubscribe with async pipe, takeUntilDestroyed (Angular 16+) or takeUntil(destroy$).', 'HttpClient completes by itself; valueChanges and interval do not.'],
    redFlags: ['Never unsubscribes from interval or valueChanges', 'Thinks async pipe leaks'] },
];
