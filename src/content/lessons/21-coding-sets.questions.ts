import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q21-1', lesson: 21, minutes: 3,
    prompt: 'When do you reach for a Set instead of a Map, and what does each cost?',
    strongAnswerPoints: ['A Set stores unique keys and answers existence only; a Map attaches a value (a count, a list, a latest version) to a key.', 'Average O(1) add/has/delete, O(n) space for both; hashing needs stable equals/hashCode in Java.', 'Use a Set for dedupe, membership and set algebra (union, intersection, difference); use a Map for counting or grouping.', 'Sets compare by reference, so equal records need a canonical key (an id or serialized value).'],
    redFlags: ['Uses an array and a nested loop to answer "have I seen this" (O(n^2))', 'Expects a Set to keep a useful order or to dedupe objects by value'] },
  { id: 'q21-2', lesson: 21, minutes: 3,
    prompt: 'An event stream can deliver the same event id more than once. How do you dedupe, and why is an in-memory Set not enough on its own?',
    strongAnswerPoints: ['Within a batch or window, a Set of event ids drops repeats in O(1) per event.', 'Across restarts and processes the Set is lost and unbounded, so durability needs the id persisted (unique index or upsert) in the same transaction as the effect.', 'At-least-once delivery means retries and rebalances will redeliver, so make the consumer idempotent rather than assuming exactly-once.', 'Bound the memory with a window or TTL cache, and log or count what you dropped.'],
    redFlags: ['Claims a Set gives exactly-once processing', 'Lets the Set grow without bound in a long-running consumer'] },
];
