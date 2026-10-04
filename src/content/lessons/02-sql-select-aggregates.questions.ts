import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q2-1', lesson: 2, minutes: 2, source: 'candidate-reported',
    prompt: 'What is the difference between WHERE and HAVING? Give an example where you need both.',
    strongAnswerPoints: ['WHERE filters rows before grouping; HAVING filters groups after aggregation.', 'Aggregates cannot appear in WHERE.', 'Example: WHERE amount > 50 then GROUP BY desk HAVING COUNT(*) > 3.'],
    redFlags: ['Says they are interchangeable', 'Puts aggregate conditions in WHERE'] },
  { id: 'q2-2', lesson: 2, minutes: 2,
    prompt: 'orders.total has NULLs. How do COUNT(*), COUNT(total) and AVG(total) treat them?',
    strongAnswerPoints: ['COUNT(*) counts every row.', 'COUNT(total) and AVG(total) ignore NULLs.', 'AVG divides by the non-null count, so use COALESCE if NULL should mean 0.'],
    redFlags: ['Assumes NULL is treated as zero'] },
  { id: 'q2-3', lesson: 2, minutes: 2,
    prompt: 'Write the query shape for "number of high-severity breaches per account" without a second query or subquery.',
    strongAnswerPoints: ['GROUP BY account_id.', "SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END), or COUNT with a CASE returning NULL otherwise.", 'Accounts with zero high breaches still appear with 0 if the base rows exist.'],
    redFlags: ['Uses WHERE severity = high and loses the other accounts'] },
  { id: 'q2-4', lesson: 2, minutes: 2,
    prompt: 'A query is slow: WHERE DATE(traded_at) = \'2026-01-02\' on a large indexed table. Why, and how would you fix it?',
    strongAnswerPoints: ['Wrapping the column in a function prevents using the index (not sargable).', 'Rewrite as a range: traded_at >= start AND traded_at < next day.', 'Confirm with the query plan (EXPLAIN).'],
    redFlags: ['Suggests adding more indexes without reading the plan'] },
];
