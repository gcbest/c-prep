import { createContext, useContext } from 'react';
import type { Question } from '../content/types';
import type { Grade } from '../state/model';

export type LessonContextValue = {
  lesson: number;
  questions: Question[];
  grades: Record<string, Grade | undefined>;
  onGrade: (id: string, grade: Grade) => void;
  compress: boolean;
  track: 'java' | 'python';
  setTrack: (track: 'java' | 'python') => void;
};

export const LessonContext = createContext<LessonContextValue>({
  lesson: 0, questions: [], grades: {}, onGrade: () => {}, compress: false, track: 'java', setTrack: () => {},
});
export const useLesson = () => useContext(LessonContext);
