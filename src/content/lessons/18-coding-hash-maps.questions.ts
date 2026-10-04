import type { Question } from '../types';

export const questions: Question[] = [
  { id: 'q18-1', lesson: 18, minutes: 3, source: 'candidate-reported',
    prompt: 'You are given a coding problem in a live screen. Describe the routine you follow before and while you write code.',
    strongAnswerPoints: ['Restate, then ask clarifying questions (size, duplicates, empty input, ordering, ties).', 'Work a small example and name edge cases.', 'State approach and time/space complexity before coding.', 'Think aloud, code, then test by tracing the example.', 'Confirm the language is allowed and use the one you are fastest in.'],
    redFlags: ['Starts typing immediately', 'Silent for long stretches', 'Never tests the code'],
    followUps: ['What if the input does not fit in memory?'] },
  { id: 'q18-2', lesson: 18, minutes: 3,
    prompt: 'Group Anagrams: what is your key, and what are the time and space complexities? How could you improve it?',
    strongAnswerPoints: ['Key is the sorted letters (or a 26-count tuple); map from key to list in one pass.', 'Sorted key: O(n * m log m) time, O(n * m) space.', 'Count key removes the log factor for lowercase letters.', 'Note output order is unspecified, so tests must not depend on it.'],
    redFlags: ['Compares every pair of words (O(n^2))', 'Uses an unsorted array as a map key in JS without stringifying'],
    followUps: ['How does it change for Unicode input?'] },
];
