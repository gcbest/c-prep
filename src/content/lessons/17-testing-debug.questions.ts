import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q17-1', lesson: 17, minutes: 3, source: 'candidate-reported',
    prompt: 'Walk me through how you debug a failing unit test in a small repo you have never seen.',
    strongAnswerPoints: ['Read the test first and restate the expected behaviour and the actual failure.', 'Reproduce it (mvn test / pytest) before editing anything.', 'Inspect only the code the test exercises and change one thing at a time.', 'Make the smallest fix, then rerun the whole suite, not just the failing test.', 'Explain the root cause and name the test you would add next.', 'Java: JUnit 5 @Test and assertEquals. Python: plain assert and pytest.'],
    redFlags: ['Starts editing before reading or reproducing', 'Changes the test so it passes', 'Reruns only the single failing test'] },
  { id: 'q17-2', lesson: 17, minutes: 3, source: 'candidate-reported',
    prompt: 'A dedupe function keys a map on symbol, so two distinct trades in the same symbol collapse. What is the root cause and the smallest fix?',
    strongAnswerPoints: ['The key encodes the wrong identity: a trade is identified by id, not symbol.', 'Key by trade id (seen.putIfAbsent(t.id(), t) / seen.setdefault(t.id, t)), or by the (id, symbol) pair if both are required.', 'Rerun all tests and add a case for the same id with a different symbol.', 'Java: keying on the Trade object requires equals/hashCode together; a record provides both.', 'Python: a dict key must be hashable; @dataclass(frozen=True) supplies __eq__ and __hash__.'],
    redFlags: ['Rewrites the function from scratch', 'Edits the test instead of the code', 'Uses the object as a key without checking equals/hashCode or hashability'] },
  { id: 'q17-3', lesson: 17, minutes: 3,
    prompt: 'A test passes when run alone but fails in the full suite. What do you suspect, and how do you confirm it?',
    strongAnswerPoints: ['Shared mutable state and test-order dependence: a static/module-level field, a reused collection, or a cached singleton.', 'Spring singleton beans must be stateless; a field holding per-request data leaks across tests and requests.', 'Confirm by running the test alone vs the suite, shuffling order (pytest-randomly, JUnit ordering), and resetting state in @BeforeEach / a fixture.', 'Watch for mutable default arguments in Python and static caches in Java.', 'Fix the production leak, not just the test teardown.'],
    redFlags: ['Adds a sleep or retries', 'Marks the test flaky and skips it', 'Sprinkles @DirtiesContext everywhere instead of finding the leak'] },
];
