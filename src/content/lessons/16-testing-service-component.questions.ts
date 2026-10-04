import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q16-1', lesson: 16, minutes: 3, source: 'job-description',
    prompt: 'How do you unit test an Angular service that calls HttpClient? Cover success, a 404, and retry.',
    strongAnswerPoints: ['Provide HttpClient with HttpTestingController (provideHttpClientTesting).', 'expectOne(url), check method, then flush(body) or flush(body, {status: 404, statusText}).', 'For retry, expect a second request after req.error and flush the second.', 'httpMock.verify() in afterEach.', 'FastAPI parallel: TestClient plus dependency_overrides.'],
    redFlags: ['Hits a real backend', 'Never verifies outstanding requests'] },
  { id: 'q16-2', lesson: 16, minutes: 3, source: 'job-description',
    prompt: 'How would you test a component that shows loading, a limit-breach highlight, an error with retry, and a disabled action button?',
    strongAnswerPoints: ['TestBed with a spy service returning controllable observables.', 'detectChanges then query the DOM for spinner, rows, breach class, alert text.', 'Click retry and assert the service was called again.', 'Assert disabled state on the button.', 'Assert what the user sees, not private members.'],
    redFlags: ['Calls private methods directly', 'Forgets detectChanges so the DOM never updates'] },
  { id: 'q16-3', lesson: 16, minutes: 2,
    prompt: 'When do you use fakeAsync with tick versus waitForAsync?',
    strongAnswerPoints: ['fakeAsync/tick/flush gives deterministic virtual time for timers, debounce and promises.', 'waitForAsync with whenStable waits for real asynchronous work to settle.', 'Prefer fakeAsync for speed and determinism; avoid real sleeps.'],
    redFlags: ['Uses setTimeout sleeps in tests'] },
];
