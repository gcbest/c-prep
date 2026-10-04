import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q8-1', lesson: 8, minutes: 3, source: 'candidate-reported',
    prompt: 'How do you handle exceptions in a Spring Boot REST API so clients always get a consistent error response?',
    strongAnswerPoints: ['Central @RestControllerAdvice with @ExceptionHandler methods (FastAPI: app.exception_handler).', 'One error shape: code, message, details, correlation id; optionally RFC 7807 ProblemDetail.', 'Map domain exceptions to proper status codes; catch-all returns a generic 500 and logs the full stack.', 'Never expose stack traces or SQL to the client.'],
    redFlags: ['try/catch in every controller method', 'Returns 200 with an error body', 'Leaks exception messages and stack traces'],
    followUps: ['Where do exceptions thrown in a servlet filter go?', 'How would you add a correlation id?'] },
  { id: 'q8-2', lesson: 8, minutes: 2,
    prompt: 'How does request validation work, and what happens when it fails?',
    strongAnswerPoints: ['Spring: DTO with jakarta.validation annotations plus @Valid on @RequestBody; failure throws MethodArgumentNotValidException, mapped to 400.', 'Parameter constraints need @Validated on the class and throw ConstraintViolationException.', 'FastAPI: Pydantic model validates automatically; RequestValidationError defaults to 422 and can be overridden.', 'Validate at the edge; keep entities out of the API.'],
    redFlags: ['Validates only in the database', 'Binds JSON straight to a JPA entity'] },
  { id: 'q8-3', lesson: 8, minutes: 3,
    prompt: 'Which HTTP methods are idempotent, and how would you make a payment-style POST safe to retry? Add how you would paginate a large list.',
    strongAnswerPoints: ['GET, PUT, DELETE (and HEAD/OPTIONS) are idempotent; POST and usually PATCH are not.', 'Idempotency-Key header stored with the response, unique constraint, replay on retry.', 'Offset pagination is simple but drifts and is slow when deep; keyset/cursor is stable and fast.', 'Status codes: 201 + Location, 409 on conflict.'],
    redFlags: ['Says DELETE must return the same status every time', 'Thinks retries are the client\'s problem only'],
    followUps: ['What does a second DELETE return?'] },
];
