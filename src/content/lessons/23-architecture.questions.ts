import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q23-1', lesson: 23, minutes: 2, source: 'candidate-reported',
    prompt: 'When would you choose a microservices architecture over a modular monolith, and what do you pay for it?',
    strongAnswerPoints: ['Independent deploys and scaling for separate teams or domains with different load.', 'Costs: network failures, distributed data and consistency, observability, operational overhead.', 'Modular monolith with enforced boundaries is a sound starting point and can be split later.', 'Spring Boot services or FastAPI services work the same way; the trade-offs are language-independent.'],
    redFlags: ['Treats microservices as automatically better', 'Ignores data ownership and consistency'],
    followUps: ['How do you handle a transaction that spans two services?'] },
  { id: 'q23-2', lesson: 23, minutes: 3, source: 'candidate-reported',
    prompt: 'A Kafka consumer sometimes processes the same message twice. Why does that happen and how do you make it safe?',
    strongAnswerPoints: ['At-least-once delivery: a crash or rebalance after processing but before the offset commit causes redelivery.', 'Make the consumer idempotent: dedupe by event id in the same transaction, or use upserts.', 'Ordering is only per partition, so key by the entity that needs ordering.', 'Spring Kafka listener or a Python consumer (for example confluent-kafka) behaves the same.'],
    redFlags: ['Claims exactly-once is free and automatic', 'Assumes global ordering across partitions'],
    followUps: ['What happens if you add more consumers than partitions?'] },
  { id: 'q23-3', lesson: 23, minutes: 2, source: 'candidate-reported',
    prompt: 'Explain cache-aside and how you would handle invalidation and a cache stampede.',
    strongAnswerPoints: ['Read cache, on miss load from the DB and populate with a TTL.', 'On write, update the DB then delete the key; accept bounded staleness defined by TTL.', 'Stampede: request coalescing or locking per key, jittered TTLs, serve stale while refreshing.', 'Spring Cache abstraction (@Cacheable, @CacheEvict) or Redis in FastAPI.'],
    redFlags: ['Updates the cache before the database without thinking about failure', 'No TTL or eviction plan'] },
  { id: 'q23-4', lesson: 23, minutes: 3, source: 'candidate-reported',
    prompt: 'How do you make a call to another service resilient, and why does retrying a payment need an idempotency key?',
    strongAnswerPoints: ['Timeouts, retries with exponential backoff and jitter, circuit breaker, bulkheads or limits.', 'A timed-out request may have succeeded; a retry could double-charge without a key.', 'Server stores the key and first result and replays it on repeats.', 'Resilience4j in Spring; tenacity or similar in Python.', 'Correlation ID to trace the attempts across services.'],
    redFlags: ['Retries immediately in a tight loop', 'Retries non-idempotent calls blindly'],
    followUps: ['What does the circuit breaker do when open?'] },
];
