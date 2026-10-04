import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q4-1', lesson: 4, minutes: 3, source: 'candidate-reported',
    prompt: 'Return the latest trade for each account. Then change it to the top 3 trades per account by amount.',
    strongAnswerPoints: ['ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY traded_at DESC) in a CTE, filter rn = 1.', 'Top 3: ORDER BY amount DESC and rn <= 3.', 'Tiebreaker for determinism; window function cannot be filtered in the same WHERE.'],
    redFlags: ['Uses GROUP BY with MAX and selects other columns', 'Uses LIMIT, which is global not per group'] },
  { id: 'q4-2', lesson: 4, minutes: 2,
    prompt: 'Explain ROW_NUMBER, RANK and DENSE_RANK with three rows tied for first place.',
    strongAnswerPoints: ['ROW_NUMBER: 1,2,3 arbitrary among ties.', 'RANK: 1,1,1 then next is 4.', 'DENSE_RANK: 1,1,1 then next is 2.', 'Choose by whether ties should be kept.'],
    redFlags: ['Thinks they are identical'] },
  { id: 'q4-3', lesson: 4, minutes: 2,
    prompt: 'A table has duplicate rows for the same (account_id, symbol, traded_at). How do you find and remove the duplicates?',
    strongAnswerPoints: ['Find: GROUP BY the key HAVING COUNT(*) > 1.', 'Remove: ROW_NUMBER partitioned by key, delete rows with rn > 1 (by id or ROWID).', 'Take a backup or run in a transaction; add a unique constraint afterwards.'],
    redFlags: ['SELECT DISTINCT only, without addressing the stored data', 'No safety step'] },
  { id: 'q4-4', lesson: 4, minutes: 2,
    prompt: 'A report query joining trades and accounts has become slow. How do you investigate, and how do Oracle and Postgres differ on top-N syntax?',
    strongAnswerPoints: ['Read the plan (EXPLAIN / EXPLAIN ANALYZE): full scan vs index, row estimates.', 'Check indexes on join/filter columns, functions on columns, SELECT *, row multiplication.', 'Top-N: FETCH FIRST n ROWS ONLY or LIMIT; Oracle legacy ROWNUM applies before ORDER BY.', 'NVL (Oracle) vs COALESCE (portable).'],
    redFlags: ['Adds indexes blindly', 'Does not look at a plan'] },
];
