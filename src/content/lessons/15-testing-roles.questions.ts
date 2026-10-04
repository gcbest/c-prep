import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q15-1', lesson: 15, minutes: 2, source: 'job-description',
    prompt: 'What is the difference between Jasmine, Karma, TestBed and Cypress?',
    strongAnswerPoints: ['Jasmine is the framework: specs, expectations, spies.', 'Karma is the runner that launches browsers and reports results.', 'TestBed builds an Angular DI/template environment for components and services.', 'Cypress runs end-to-end flows against the real app.', 'Backend parallel: pytest or JUnit plus MockMvc/TestClient for slices, and a separate e2e layer.'],
    redFlags: ['Says Karma and Jasmine are the same thing', 'Thinks Cypress replaces unit tests'] },
  { id: 'q15-2', lesson: 15, minutes: 2,
    prompt: 'Your team is moving from Karma/Jasmine to Jest or Vitest. What changes and what stays the same?',
    strongAnswerPoints: ['describe/it/expect and TestBed usage stay largely the same.', 'Spies change: jasmine.createSpyObj and spyOn become jest.fn / vi.fn and spyOn variants.', 'Runner changes from real browsers to jsdom/happy-dom or browser mode, so it is faster but less faithful for layout.', 'Keep Cypress/Playwright for real-browser flows.'],
    redFlags: ['Claims tests must be rewritten from scratch'] },
];
