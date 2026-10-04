import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q10-1', lesson: 10, minutes: 2, source: 'candidate-reported',
    prompt: 'Explain how a parent and child component communicate in Angular. How does it compare to React?',
    strongAnswerPoints: ['Parent passes data down with property binding to an @Input (or signal input()).', 'Child notifies the parent with an @Output EventEmitter (or output()) which the parent handles with (event) binding.', 'Same one-way flow as props and callback props in React.', 'Two-way [(x)] is sugar for an input named x plus an output named xChange.'],
    redFlags: ['Child mutates parent state directly', 'Cannot name the binding syntaxes'] },
  { id: 'q10-2', lesson: 10, minutes: 2, source: 'candidate-reported',
    prompt: 'This codebase uses NgModules and *ngIf; a newer one uses standalone components and @if. What is the difference, and does it change how you work?',
    strongAnswerPoints: ['NgModule declares components and their template dependencies; standalone components import what they use directly.', '*ngIf/*ngFor are structural directives needing CommonModule; @if/@for are built-in control flow (Angular 17+), and @for requires track.', 'Both run in the same app and can be mixed; migrations are available.', 'Same underlying component model.'],
    redFlags: ['Thinks standalone is a different framework', 'Does not know the older syntax exists'] },
  { id: 'q10-3', lesson: 10, minutes: 2,
    prompt: 'Where do you put initialisation and cleanup logic in a component, and why not in the constructor?',
    strongAnswerPoints: ['ngOnInit for setup because inputs are set by then; the constructor is for dependency injection only.', 'ngOnDestroy for unsubscribing, clearing timers and listeners (or use DestroyRef / takeUntilDestroyed).', 'Maps to useEffect with empty deps and its cleanup in React.', 'ngOnChanges fires when inputs change.'],
    redFlags: ['Starts HTTP calls in the constructor using inputs', 'Never unsubscribes'] },
];
