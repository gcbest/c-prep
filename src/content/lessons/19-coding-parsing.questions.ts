import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q19-1', lesson: 19, minutes: 3, source: 'candidate-reported',
    prompt: 'You must total amounts per category from a text log where some lines are blank or malformed. How do you design it, and which bugs do you watch for?',
    strongAnswerPoints: ['Per line: trim, split on whitespace, check field count, validate the number; skip bad lines.', 'Watch split on repeated spaces, empty strings, Number("") being 0, and NaN propagating into totals.', 'Report skipped-line counts rather than silently dropping them.', 'Test blank, malformed and valid-but-odd lines; consider integer minor units for money.'],
    redFlags: ['Lets one malformed line throw', 'Uses truthiness to validate numbers (rejects 0)', 'No tests for blank lines'],
    followUps: ['Would you use a regex here? Why or why not?'] },
];
