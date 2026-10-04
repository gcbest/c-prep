export type Source = 'candidate-reported' | 'job-description' | 'job-posting-reported' | 'general';
export type Track = 'both' | 'java' | 'python';

export type Question = {
  id: string;
  lesson: number;
  prompt: string;
  strongAnswerPoints: string[];
  redFlags: string[];
  followUps?: string[];
  minutes: number;
  track?: Track;
  source?: Source;
  /** Only used by lessons split into Part A / Part B (25, 26). */
  part?: 'A' | 'B';
};

export type LessonMeta = {
  number: number;
  title: string;
  minutes: number;
  day: number;
  optional?: boolean;
  track?: Track;
  cheatsheet: string[];
};
