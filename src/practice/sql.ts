export type SqlResult = { columns: string[]; values: unknown[][] };

export const schemaText = `accounts(id, desk, name)
trades(id, account_id, symbol, amount, traded_at)
risk_limits(account_id, category, threshold)
breaches(id, account_id, severity, amount, occurred_at)
users(id, name, manager_id)
orders(id, user_id, status, total)`;

export const seed = `
CREATE TABLE accounts(id INTEGER PRIMARY KEY, desk TEXT, name TEXT);
CREATE TABLE trades(id INTEGER PRIMARY KEY, account_id INTEGER, symbol TEXT, amount REAL, traded_at TEXT);
CREATE TABLE risk_limits(account_id INTEGER, category TEXT, threshold REAL);
CREATE TABLE breaches(id INTEGER PRIMARY KEY, account_id INTEGER, severity TEXT, amount REAL, occurred_at TEXT);
CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER);
CREATE TABLE orders(id INTEGER PRIMARY KEY, user_id INTEGER, status TEXT, total REAL);
INSERT INTO accounts VALUES (1,'Rates','North'),(2,'Credit','West'),(3,'Rates','East'),(4,'FX','South'),(5,'Credit','Central'),(6,'FX','Island');
INSERT INTO trades VALUES
 (1,1,'UST',120,'2026-01-02'),(2,1,'UST',80,'2026-01-03'),(3,2,'CDS',240,'2026-01-04'),(4,3,'UST',60,'2026-01-05'),
 (5,3,'BUND',150,'2026-01-06'),(6,2,'CDS',90,'2026-01-07'),(7,4,'EURUSD',300,'2026-01-07'),(8,1,'BUND',210,'2026-01-08'),
 (9,4,'EURUSD',130,'2026-01-09'),(10,5,'CDS',40,'2026-01-09'),(11,3,'UST',75,'2026-01-10'),(12,2,'CDS',110,'2026-01-10');
INSERT INTO risk_limits VALUES (1,'rates',100),(2,'credit',200),(3,'rates',100),(4,'fx',250),(4,'fx_options',50);
INSERT INTO breaches VALUES
 (1,1,'high',120,'2026-01-02'),(2,2,'medium',240,'2026-01-04'),(3,1,'high',150,'2026-01-06'),(4,4,'low',300,'2026-01-07'),
 (5,3,'medium',150,'2026-01-06'),(6,1,'low',210,'2026-01-08'),(7,4,'high',130,'2026-01-09'),(8,2,'high',110,'2026-01-10');
INSERT INTO users VALUES (1,'Ari',NULL),(2,'Sam',1),(3,'Lee',1),(4,'Kim',2),(5,'Pat',NULL);
INSERT INTO orders VALUES (1,1,'open',50),(2,1,'filled',70),(3,2,'open',20),(4,3,'cancelled',NULL),(5,2,'filled',90);
`;

export type SqlExerciseData = { id: number; prompt: string; hints: [string, string]; solution: string; ordered: boolean };

const ex = (id: number, prompt: string, h1: string, h2: string, solution: string, ordered = true): SqlExerciseData => ({ id, prompt, hints: [h1, h2], solution, ordered });

// Lesson 2: ids 1-7, lesson 3: ids 8-13, lesson 4: ids 14-20.
export const exercises: SqlExerciseData[] = [
  ex(1, 'List id, symbol and amount of trades with amount above 100, largest first.', 'Filter with WHERE before sorting.', 'ORDER BY amount DESC; add id as a tie-break.', 'SELECT id, symbol, amount FROM trades WHERE amount > 100 ORDER BY amount DESC, id'),
  ex(2, 'Count trades per symbol. Return symbol and n, ordered by symbol.', 'One output row per symbol means GROUP BY symbol.', 'COUNT(*) AS n.', 'SELECT symbol, COUNT(*) AS n FROM trades GROUP BY symbol ORDER BY symbol'),
  ex(3, 'Which accounts have at least three trades? Return account_id and n.', 'Filtering on an aggregate cannot use WHERE.', 'Use HAVING COUNT(*) >= 3.', 'SELECT account_id, COUNT(*) AS n FROM trades GROUP BY account_id HAVING COUNT(*) >= 3 ORDER BY account_id'),
  ex(4, 'For each account, count the distinct symbols traded. Return account_id and symbols.', 'Plain COUNT counts duplicate symbols.', 'COUNT(DISTINCT symbol).', 'SELECT account_id, COUNT(DISTINCT symbol) AS symbols FROM trades GROUP BY account_id ORDER BY account_id'),
  ex(5, 'Per account, count high-severity breaches using conditional aggregation. Return account_id and high_count.', 'Aggregate a CASE expression.', "SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END).", "SELECT account_id, SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) AS high_count FROM breaches GROUP BY account_id ORDER BY account_id"),
  ex(6, 'Total trade amount per symbol, keeping only symbols whose total exceeds 300. Return symbol and total.', 'SUM(amount), then filter the groups.', 'HAVING SUM(amount) > 300.', 'SELECT symbol, SUM(amount) AS total FROM trades GROUP BY symbol HAVING SUM(amount) > 300 ORDER BY symbol'),
  ex(7, 'Orders table: compare COUNT(*) and COUNT(total) for all orders. Return rows and totals_present.', 'COUNT(column) ignores NULLs.', 'Two aggregates in one SELECT.', 'SELECT COUNT(*) AS rows, COUNT(total) AS totals_present FROM orders'),
  ex(8, 'List every account (id, desk) with its number of trades, including accounts with none. Columns: id, desk, n.', 'Keep every account: LEFT JOIN trades.', 'COUNT(t.id), not COUNT(*), so unmatched accounts give 0.', 'SELECT a.id, a.desk, COUNT(t.id) AS n FROM accounts a LEFT JOIN trades t ON t.account_id = a.id GROUP BY a.id, a.desk ORDER BY a.id'),
  ex(9, 'Find accounts that have no trades (anti-join with LEFT JOIN ... IS NULL). Return id.', 'LEFT JOIN, then keep the rows where the right side is missing.', 'WHERE t.id IS NULL.', 'SELECT a.id FROM accounts a LEFT JOIN trades t ON t.account_id = a.id WHERE t.id IS NULL ORDER BY a.id'),
  ex(10, 'Find accounts with no risk limit using NOT EXISTS. Return id.', 'A correlated subquery on risk_limits.', 'WHERE NOT EXISTS (SELECT 1 FROM risk_limits l WHERE l.account_id = a.id).', 'SELECT a.id FROM accounts a WHERE NOT EXISTS (SELECT 1 FROM risk_limits l WHERE l.account_id = a.id) ORDER BY a.id'),
  ex(11, 'Max trade amount per desk. Return desk and max_amount.', 'Trades has no desk; join accounts.', 'GROUP BY a.desk with MAX(t.amount).', 'SELECT a.desk, MAX(t.amount) AS max_amount FROM accounts a JOIN trades t ON t.account_id = a.id GROUP BY a.desk ORDER BY a.desk'),
  ex(12, 'Account 4 has two risk_limits rows. Join breaches to risk_limits on account_id and count joined rows per breach account. Return account_id and n.', 'Duplicate rows on one side multiply the other side.', 'GROUP BY b.account_id, COUNT(*).', 'SELECT b.account_id, COUNT(*) AS n FROM breaches b JOIN risk_limits l ON l.account_id = b.account_id GROUP BY b.account_id ORDER BY b.account_id'),
  ex(13, 'Users who have no orders. Return id. (users.id = orders.user_id.)', 'Anti-join again; pick NOT EXISTS or LEFT JOIN.', 'Beware NOT IN if the subquery can return NULL.', 'SELECT u.id FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id) ORDER BY u.id'),
  ex(14, 'Latest breach per account (ties by higher id). Return account_id, id, occurred_at.', 'Number rows per account with a window function.', 'ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY occurred_at DESC, id DESC), then keep rn = 1.', 'WITH r AS (SELECT b.*, ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY occurred_at DESC, id DESC) rn FROM breaches b) SELECT account_id, id, occurred_at FROM r WHERE rn = 1 ORDER BY account_id'),
  ex(15, 'Top 2 trades by amount within each account. Return account_id, id, amount.', 'Top-N per group is ROW_NUMBER filtered with <= N.', 'Order by amount DESC, id inside the window.', 'WITH r AS (SELECT t.*, ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY amount DESC, id) rn FROM trades t) SELECT account_id, id, amount FROM r WHERE rn <= 2 ORDER BY account_id, amount DESC, id'),
  ex(16, 'Rank accounts by total traded amount within each desk using RANK. Return desk, account_id, total, r.', 'Aggregate first, rank over the aggregate.', 'RANK() OVER (PARTITION BY a.desk ORDER BY SUM(t.amount) DESC).', 'SELECT a.desk, t.account_id, SUM(t.amount) AS total, RANK() OVER (PARTITION BY a.desk ORDER BY SUM(t.amount) DESC) AS r FROM trades t JOIN accounts a ON a.id = t.account_id GROUP BY a.desk, t.account_id ORDER BY a.desk, r, t.account_id'),
  ex(17, 'For each breach show the previous breach amount for the same account (LAG). Return id, account_id, amount, previous.', 'LAG looks at the prior row in a defined order.', 'LAG(amount) OVER (PARTITION BY account_id ORDER BY occurred_at, id).', 'SELECT id, account_id, amount, LAG(amount) OVER (PARTITION BY account_id ORDER BY occurred_at, id) AS previous FROM breaches ORDER BY account_id, occurred_at, id'),
  ex(18, 'Running total of trade amount per account ordered by date then id. Return account_id, id, running.', 'SUM as a window function with ORDER BY.', 'SUM(amount) OVER (PARTITION BY account_id ORDER BY traded_at, id).', 'SELECT account_id, id, SUM(amount) OVER (PARTITION BY account_id ORDER BY traded_at, id) AS running FROM trades ORDER BY account_id, traded_at, id'),
  ex(19, 'Using a CTE: accounts whose total traded amount is above the average account total. Return account_id, total.', 'CTE of totals per account, then compare to AVG of the CTE.', 'WHERE total > (SELECT AVG(total) FROM totals).', 'WITH totals AS (SELECT account_id, SUM(amount) AS total FROM trades GROUP BY account_id) SELECT account_id, total FROM totals WHERE total > (SELECT AVG(total) FROM totals) ORDER BY account_id'),
  ex(20, 'Dedupe: keep one trade per (account_id, symbol), the largest amount (ties by lower id). Return id, account_id, symbol, amount.', 'Same pattern as latest-row-per-group with a different partition.', 'PARTITION BY account_id, symbol ORDER BY amount DESC, id.', 'WITH r AS (SELECT t.*, ROW_NUMBER() OVER (PARTITION BY account_id, symbol ORDER BY amount DESC, id) rn FROM trades t) SELECT id, account_id, symbol, amount FROM r WHERE rn = 1 ORDER BY account_id, symbol'),
];

/** Compare a user's result with the expected one. Column names are ignored; row order only matters when `ordered`. */
export function checkResult(actual: SqlResult | undefined, expected: SqlResult, ordered: boolean): { ok: boolean; message: string } {
  if (!actual) return { ok: false, message: 'Your statement returned no result set. Use a SELECT (or WITH ... SELECT).' };
  if (actual.columns.length !== expected.columns.length) return { ok: false, message: `Expected ${expected.columns.length} column(s) (${expected.columns.join(', ')}), got ${actual.columns.length}.` };
  if (actual.values.length !== expected.values.length) return { ok: false, message: `Expected ${expected.values.length} row(s), got ${actual.values.length}.` };
  const key = (row: unknown[]) => JSON.stringify(row);
  const a = actual.values.map(key); const e = expected.values.map(key);
  if (ordered ? a.every((row, i) => row === e[i]) : [...a].sort().join('|') === [...e].sort().join('|')) return { ok: true, message: 'Correct: your result matches the expected result.' };
  const firstBad = ordered ? a.findIndex((row, i) => row !== e[i]) : -1;
  const sameRowsDifferentOrder = [...a].sort().join('|') === [...e].sort().join('|');
  if (ordered && sameRowsDifferentOrder) return { ok: false, message: `Right rows, wrong order (first difference at row ${firstBad + 1}). Check ORDER BY and tie-breaks.` };
  return { ok: false, message: ordered && firstBad >= 0 ? `Row ${firstBad + 1} differs: expected ${e[firstBad]}, got ${a[firstBad]}.` : 'The rows differ from the expected result.' };
}
