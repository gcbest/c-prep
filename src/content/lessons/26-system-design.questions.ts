import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q26-1', lesson: 26, minutes: 3, source: 'candidate-reported',
    prompt: 'In the risk portal, how do you make sure a user only sees the desks and books they are entitled to?',
    strongAnswerPoints: ['Enforce entitlements on the server for every request, deny by default; hiding UI is cosmetic.', 'Authenticate via SSO/OIDC at the gateway; pass identity to services; filter queries by entitlement (row-level filter in the query or view).', 'Apply the same filtering to caches, exports and any search or LLM feature; audit access.', 'Spring: method security / filters; FastAPI: dependencies that check permissions.'],
    redFlags: ['Relies on the front end to hide data', 'Trusts a role claim sent by the client without verification'],
    followUps: ['How do you avoid leaking data through a shared cache?'] },
  { id: 'q26-2', lesson: 26, minutes: 3, source: 'candidate-reported',
    prompt: 'A downstream service that supplies exposure data becomes slow and then fails. How does the portal behave, and how do you design for it?',
    strongAnswerPoints: ['Timeouts, bounded retries with backoff and jitter, circuit breaker, bulkheads.', 'Degrade gracefully: serve cached data with a visible stale marker and the "as of" time, rather than an error or a silent old number.', 'Idempotent operations so retries are safe; dead-letter queue for failed ingestion messages.', 'Alert on data freshness and error rates; test with failure injection.'],
    redFlags: ['Unlimited retries that amplify the outage', 'Shows stale data without marking it'],
    followUps: ['How do you stop a retry storm?'] },
  { id: 'q26-3', lesson: 26, minutes: 3, source: 'candidate-reported',
    prompt: 'Would you build this as microservices or a modular monolith? Justify your choice.',
    strongAnswerPoints: ['Start modular with clear boundaries; split where scaling, team ownership or failure isolation differs.', 'Microservices cost: network failures, distributed transactions, deployment and observability overhead.', 'Ingestion and alerting often split naturally from the read API.', 'State what would make you split later.'],
    redFlags: ['Microservices by default with no reasoning', 'Ignores operational cost'] },
  { id: 'q26-4', lesson: 26, minutes: 3, source: 'candidate-reported',
    prompt: 'Dashboards are slow because aggregates are computed on demand. Compare caching, precomputation and read replicas, and say how freshness is shown to users.',
    strongAnswerPoints: ['Cache: cheap and fast, but needs TTL or invalidation and risks staleness.', 'Precompute (materialised views or snapshots): fast reads, storage and refresh lag.', 'Read replicas: offload reads, but replication lag.', 'Always show an "as of" time and stale marker; use fresh reads where correctness matters, such as limit approvals.'],
    redFlags: ['Caches without discussing invalidation', 'Hides data age from users'],
    followUps: ['Which would you pick first, and what would you measure?'] },
];
