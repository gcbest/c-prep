import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q11-1', lesson: 11, minutes: 2, source: 'candidate-reported',
    prompt: 'What is the difference between providing a service with providedIn: root and in a component\'s providers array? How is this different from React Context?',
    strongAnswerPoints: ['root gives one app-wide singleton; component providers gives a new instance per component instance and its children.', 'Injectors are hierarchical; lookup walks up from the requesting element.', 'Context passes a value through the render tree; DI constructs instances by token and scope is decided by which injector provides it.', 'Lazy-loaded NgModule providers create separate instances (older gotcha).'],
    redFlags: ['Equates DI with Context', 'Thinks every injection is a singleton'] },
  { id: 'q11-2', lesson: 11, minutes: 2, source: 'candidate-reported',
    prompt: 'How would you add an Authorization header to every request and handle a 401 globally?',
    strongAnswerPoints: ['HTTP interceptor: clone the immutable request with the header and pass it to next.', 'Function interceptor with provideHttpClient(withInterceptors) in modern code; class HttpInterceptor under HTTP_INTERCEPTORS (multi) in NgModule code.', 'Error handling via catchError in the interceptor: on 401 redirect to login or refresh the token, rethrow otherwise.', 'Equivalent to axios interceptors or FastAPI middleware.'],
    redFlags: ['Mutates the request directly', 'Adds the header manually in every service call'] },
  { id: 'q11-3', lesson: 11, minutes: 2,
    prompt: 'A service calls http.get<Trade[]>() but nothing is sent, or two requests are sent. What is going on?',
    strongAnswerPoints: ['HttpClient observables are cold: no subscriber, no request.', 'Each subscription (including each async pipe) triggers a separate request; share with shareReplay or store the result in a signal or subject.', 'The generic is compile-time only; the server shape is not validated at runtime.', 'Unsubscribing cancels the in-flight request.'],
    redFlags: ['Expects the call to run like a Promise at call time'] },
];
