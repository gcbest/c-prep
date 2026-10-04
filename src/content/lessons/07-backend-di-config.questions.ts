import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q7-1', lesson: 7, minutes: 2, source: 'candidate-reported',
    prompt: 'What is dependency injection / inversion of control, and why prefer constructor injection over field injection?',
    strongAnswerPoints: ['The container creates and wires objects instead of the class calling new; FastAPI Depends is the same idea per request.', 'Constructor injection: final fields, never half-built, easy to unit test with plain construction, missing beans fail at startup.', 'Field injection hides dependencies, needs reflection or the container in tests, allows nulls.'],
    redFlags: ['Cannot explain what the container does', 'Prefers field injection for convenience'] },
  { id: 'q7-2', lesson: 7, minutes: 2, source: 'candidate-reported',
    prompt: 'Spring beans are singletons by default. What does that mean for how you write them?',
    strongAnswerPoints: ['One instance is shared across all request threads, so keep beans stateless: no mutable per-request fields.', 'Per-request data lives in method parameters, locals or a request-scoped bean.', 'If shared state is unavoidable, make it immutable or thread-safe (ConcurrentHashMap, atomics).', 'Prototype injected into a singleton is created once. Python: shared module-level or lru_cache objects have the same rule.'],
    redFlags: ['Stores the current user in a singleton field', 'Does not connect singletons to threads'],
    followUps: ['How would you hold per-request state?'] },
  { id: 'q7-3', lesson: 7, minutes: 2,
    prompt: 'Two beans implement the same interface. How does Spring decide which to inject, and how do you control it?',
    strongAnswerPoints: ['Without guidance it fails with NoUniqueBeanDefinitionException.', '@Primary marks the default candidate.', '@Qualifier at the injection point selects a named bean and takes precedence over @Primary.', 'FastAPI: you simply Depends on the specific provider function.'],
    redFlags: ['Thinks Spring picks the first one found'] },
  { id: 'q7-4', lesson: 7, minutes: 3, source: 'candidate-reported',
    prompt: 'How do you manage configuration per environment and keep secrets out of source control?',
    strongAnswerPoints: ['application.yml for defaults, profile files (application-prod.yml) activated via SPRING_PROFILES_ACTIVE.', '@ConfigurationProperties for typed binding; Boot auto-configuration reads spring.datasource.* and similar.', 'Secrets via environment variables (${DB_PASSWORD}) or a secret manager, never committed.', 'FastAPI: pydantic-settings BaseSettings reading env, SecretStr, dependency_overrides in tests.'],
    redFlags: ['Passwords in committed yaml', 'Separate builds per environment'],
    followUps: ['Which wins: environment variable or application.yml?'] },
];
