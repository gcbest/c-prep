import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q9-1', lesson: 9, minutes: 3, source: 'candidate-reported',
    prompt: 'What is the N+1 query problem? How do you detect and fix it?',
    strongAnswerPoints: ['A lazy association is loaded once per parent row: 1 query for parents plus N for children.', 'Detect with SQL logging or statement counts in tests.', 'Fix with fetch joins, entity graphs, or batch fetching (SQLAlchemy: selectinload / joinedload); or a DTO projection.', 'Caveat: join-fetching a collection with pagination can paginate in memory.'],
    redFlags: ['Switches everything to EAGER', 'Cannot explain why it is slow (round trips)'],
    followUps: ['Why is EAGER not a fix?', 'What about two collections fetched at once?'] },
  { id: 'q9-2', lesson: 9, minutes: 3, source: 'candidate-reported',
    prompt: 'When does @Transactional roll back, and in what cases does it silently not apply?',
    strongAnswerPoints: ['Rolls back on unchecked exceptions (RuntimeException, Error) by default; checked exceptions commit unless rollbackFor is set.', 'Proxy-based: self-invocation inside the same class bypasses it; also non-public methods and non-Spring-managed objects.', 'Catching and swallowing the exception prevents rollback.', 'FastAPI/SQLAlchemy: session.begin() rolls back on any exception, and there is no proxy.'],
    redFlags: ['Believes checked exceptions roll back by default', 'Puts @Transactional on a private method and expects it to work'],
    followUps: ['What does REQUIRES_NEW do?'] },
  { id: 'q9-3', lesson: 9, minutes: 2,
    prompt: 'Explain lazy versus eager loading and a problem each can cause.',
    strongAnswerPoints: ['Lazy loads an association on first access; eager loads it with the parent.', 'Lazy problems: LazyInitializationException outside a session, hidden N+1 (async SQLAlchemy raises MissingGreenlet).', 'Eager problems: loads data you do not need, joins multiply rows, cannot be turned off per query.', 'Default to lazy and fetch explicitly per use case.'],
    redFlags: ['Says eager is always safer'] },
  { id: 'q9-4', lesson: 9, minutes: 3,
    prompt: 'Two users edit the same record at once. How do you prevent a lost update? Compare optimistic and pessimistic locking, and mention isolation levels.',
    strongAnswerPoints: ['Optimistic: @Version (SQLAlchemy version_id_col); UPDATE ... WHERE version = ?; conflict throws, return 409 and let the client retry.', 'Pessimistic: SELECT ... FOR UPDATE blocks others; use for high contention, short transactions.', 'Read committed does not prevent lost updates by itself; higher isolation or locking is needed.', 'Retry should re-read, not blindly resubmit.'],
    redFlags: ['Relies on read committed alone', 'Last write wins without comment'],
    followUps: ['What anomalies does serializable prevent?'] },
];
