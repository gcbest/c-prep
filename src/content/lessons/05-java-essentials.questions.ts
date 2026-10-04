import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q5-1', lesson: 5, minutes: 3, source: 'candidate-reported',
    prompt: 'What is the contract between equals() and hashCode()? What goes wrong if you override only one?',
    strongAnswerPoints: ['Equal objects must have equal hash codes; unequal objects may share a hash.', 'Override both together using the same stable fields.', 'If only equals is overridden, equal objects land in different buckets, so HashMap/HashSet lookups and contains() fail or allow duplicates.', 'Mutable fields in hashCode break lookups after mutation; records generate both correctly.', 'Python equivalent: __eq__ and __hash__.'],
    redFlags: ['Says unequal objects must have different hashes', 'Overrides hashCode with a random or mutable value'] },
  { id: 'q5-2', lesson: 5, minutes: 3, source: 'candidate-reported',
    prompt: 'What is the difference between checked and unchecked exceptions in Java, and why does it matter in a Spring service?',
    strongAnswerPoints: ['Checked (Exception but not RuntimeException) must be declared with throws or caught; unchecked (RuntimeException, Error) need not be.', 'Unchecked usually signal programming errors; checked signal recoverable conditions such as I/O.', 'Spring rolls back @Transactional on unchecked exceptions by default; checked need rollbackFor.', 'FastAPI has no checked exceptions; the equivalent concern is raising HTTPException vs letting errors propagate to a handler.'],
    redFlags: ['Says checked means more serious', 'Swallows exceptions with an empty catch'] },
  { id: 'q5-3', lesson: 5, minutes: 3, source: 'candidate-reported',
    prompt: 'This JUnit 5 test fails: assertEquals(new BigDecimal("2.0"), total) where total is new BigDecimal("2.00"). Also, what is wrong with comparing two Strings using ==? Fix both.',
    strongAnswerPoints: ['BigDecimal.equals compares scale too, so 2.0 is not equal to 2.00; use compareTo == 0 or assertEquals with setScale, or assertEquals(0, a.compareTo(b)).', '== compares references; use equals() for value comparison (string literals may be interned, which hides the bug).', 'Read the failure message: expected vs actual order is expected first.', 'Money should use BigDecimal built from strings, not double.'],
    redFlags: ['Changes the test to pass without understanding', 'Uses double for money'] },
  { id: 'q5-4', lesson: 5, minutes: 3,
    prompt: 'Given a List<Trade>, write or describe a stream pipeline that totals amount per desk, and explain Optional and try-with-resources briefly.',
    strongAnswerPoints: ['trades.stream().collect(Collectors.groupingBy(Trade::desk, Collectors.reducing(BigDecimal.ZERO, Trade::amount, BigDecimal::add))).', 'Optional represents a possibly absent return value; use map/orElse/orElseThrow, not get() blindly, and not for fields.', 'try-with-resources auto-closes AutoCloseable resources even when exceptions occur.', 'Comparable to groupBy+reduce in TS or a with-block in Python.'],
    redFlags: ['Uses a for loop and a mutable map only', 'Calls Optional.get() without checking'] },
];
