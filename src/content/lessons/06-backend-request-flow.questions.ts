import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q6-1', lesson: 6, minutes: 2, source: 'candidate-reported',
    prompt: 'Walk me through the layers of a typical Spring Boot REST application and what belongs in each.',
    strongAnswerPoints: ['Controller: HTTP concerns, input validation, mapping to DTOs, status codes. FastAPI: path operation function.', 'Service: business rules and the transaction boundary.', 'Repository: persistence only.', 'Keep controllers thin; no business decisions or SQL there.'],
    redFlags: ['Puts business logic or queries in the controller', 'Cannot say where the transaction starts'] },
  { id: 'q6-2', lesson: 6, minutes: 2,
    prompt: 'Why use DTOs instead of returning entities from your API?',
    strongAnswerPoints: ['Entity models the table; DTO is the API contract, so schema changes do not break clients.', 'Avoids leaking sensitive or internal fields.', 'Avoids lazy-loading and N+1 surprises during JSON serialisation.', 'Java 17 record or Pydantic model with validation at the edge.'],
    redFlags: ['Says DTOs are just boilerplate', 'Returns JPA entities with bidirectional relations'],
    followUps: ['Where do you do the mapping?'] },
  { id: 'q6-3', lesson: 6, minutes: 2, source: 'candidate-reported',
    prompt: 'Where should exceptions be translated into HTTP responses, and why not in each controller?',
    strongAnswerPoints: ['One central handler: @RestControllerAdvice with @ExceptionHandler; FastAPI exception_handler.', 'Services throw domain exceptions and stay transport-agnostic.', 'Consistent error shape and status codes (404, 409, 422/400).', 'Validation errors surface as 400 in Spring, 422 in FastAPI.'],
    redFlags: ['try/catch in every controller', 'Returns 200 with an error body'],
    followUps: ['Which exceptions roll back a @Transactional method by default?'] },
];
