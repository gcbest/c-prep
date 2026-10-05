import { describe, expect, it } from 'vitest';
import { compressedDayAssignments, lessons, questions, visibleLessons } from './lessons';

describe('sequential study path', () => {
  it('contains 28 numbered lessons and the 81-question bank', () => {
    expect(lessons.map(lesson => lesson.number)).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
    expect(questions).toHaveLength(81);
  });
  it('hides only optional lessons in compress mode and retains order', () => {
    expect(visibleLessons(true).map(lesson => lesson.number)).toEqual(lessons.filter(lesson => !lesson.optional).map(lesson => lesson.number));
    expect(visibleLessons(true).some(lesson => [24, 25].includes(lesson.number))).toBe(false);
  });
  it('assigns the compressed path to two days without reordering', () => {
    const assignments = compressedDayAssignments();
    const days = Object.values(assignments);
    expect(new Set(days)).toEqual(new Set([1, 2]));
    expect(visibleLessons(true).every((lesson, index, path) => index === 0 || path[index - 1].number < lesson.number)).toBe(true);
  });
});
