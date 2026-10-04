import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q13-1', lesson: 13, minutes: 2, source: 'candidate-reported',
    prompt: 'How do reactive forms work in Angular, and how would you add a custom validator?',
    strongAnswerPoints: ['FormGroup and FormControl built in code; template binds with formGroup/formControlName.', 'Built-in validators (required, minLength, pattern); a validator is a function taking a control and returning an error object or null.', 'Read state via valid, errors, touched, dirty; valueChanges is an Observable.', 'Contrast with template-driven (ngModel); reactive is easier to test and compose.'],
    redFlags: ['Returns true/false from the validator instead of an error object or null', 'Cannot distinguish reactive from template-driven'] },
  { id: 'q13-2', lesson: 13, minutes: 2, source: 'candidate-reported',
    prompt: 'Describe lazy loading, guards and resolvers in the Angular router.',
    strongAnswerPoints: ['Lazy loading: loadComponent (or loadChildren for modules) with dynamic import so code is fetched on navigation.', 'Guards (canActivate, canDeactivate, canMatch) decide whether navigation proceeds; functions in modern code, classes in older.', 'Resolvers fetch data before activation so the component renders with data ready.', 'Guards for auth are UX only; the backend must enforce authorization.'],
    redFlags: ['Treats a client guard as real security'] },
  { id: 'q13-3', lesson: 13, minutes: 3, source: 'general',
    prompt: 'Signals versus RxJS: when do you reach for each in Angular, and how do you combine them?',
    strongAnswerPoints: ['Signals for synchronous state, derived values (computed) and simple template reads.', 'RxJS for async streams over time, cancellation, concurrency control, debounce and retry.', 'toSignal and toObservable bridge them; toSignal unsubscribes automatically.', 'Use effect sparingly, not to derive state; computed instead.', 'Not either/or: HTTP via RxJS, result held in a signal for the view.'],
    redFlags: ['Says signals replace RxJS entirely', 'Uses effect to copy state into other signals'] },
  { id: 'q13-4', lesson: 13, minutes: 3, source: 'general',
    prompt: 'Implement search-as-you-type against an API. Which operator and why, and how do you avoid leaks?',
    strongAnswerPoints: ['valueChanges, debounceTime, distinctUntilChanged, then switchMap to the API call.', 'switchMap cancels the stale in-flight request so out-of-order responses cannot overwrite newer ones; mergeMap would race.', 'Expose via async pipe or toSignal; both unsubscribe automatically.', 'Manual subscribe: takeUntilDestroyed or DestroyRef (older: takeUntil with a destroy Subject).', 'React analogue: debounce plus effect cleanup with AbortController.'],
    redFlags: ['Uses mergeMap and ignores race conditions', 'Nested subscribes', 'Never unsubscribes'] },
];
