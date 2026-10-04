import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q3-1', lesson: 3, minutes: 2, source: 'candidate-reported',
    prompt: 'Find all accounts that have no trades. Show two ways and say which you prefer.',
    strongAnswerPoints: ['LEFT JOIN trades ON account_id, WHERE t.id IS NULL.', 'NOT EXISTS (SELECT 1 FROM trades WHERE account_id = a.id).', 'Prefers NOT EXISTS: clear intent, NULL-safe, optimizers treat it as an anti-join.'],
    redFlags: ['Uses an inner join', 'Tests a nullable column for IS NULL'] },
  { id: 'q3-2', lesson: 3, minutes: 2,
    prompt: 'Why can WHERE id NOT IN (SELECT account_id FROM trades) return zero rows even though unmatched accounts exist?',
    strongAnswerPoints: ['If the subquery returns a NULL, x NOT IN (..., NULL) evaluates to unknown, never true.', 'Fix with NOT EXISTS or add WHERE account_id IS NOT NULL in the subquery.', 'Three-valued logic: true, false, unknown.'],
    redFlags: ['Cannot explain', 'Thinks NULL equals nothing and is skipped'] },
  { id: 'q3-3', lesson: 3, minutes: 2,
    prompt: 'You join accounts to trades and to limits, then SUM(trade amount) looks too big. What happened and how do you fix it?',
    strongAnswerPoints: ['Row multiplication: each trade repeats once per limit row (fan-out).', 'Aggregate each table to account grain in subqueries or CTEs before joining.', 'Verify by comparing row counts before and after the join.'],
    redFlags: ['Adds DISTINCT to the SUM without understanding', 'Blames the data'] },
  { id: 'q3-4', lesson: 3, minutes: 2,
    prompt: 'A LEFT JOIN query puts WHERE t.status = \'settled\' and the unmatched left rows vanish. Why, and what do you change?',
    strongAnswerPoints: ['Unmatched rows have NULL status; the WHERE filter rejects them, so it behaves like an inner join.', 'Move the condition into the ON clause.', 'Filtering on the left table in WHERE is fine.'],
    redFlags: ['Switches to a different join type without explaining'] },
];
