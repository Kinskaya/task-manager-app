import { describe, expect, it } from 'vitest';
import type { Task, TaskList } from '../types';
import { calculateCompletionProgress, countByStatus } from './counters.ts';

describe('Утилиты подсчёта статистики задач', () => {

  const mixTasks: Partial<Task>[] = [
    { id: '1', status: 'new' },
    { id: '2', status: 'in_progress' },
    { id: '3', status: 'done' },
    { id: '4', status: 'new' }
  ];

  it('1. countByStatus: должен корректно считать задачи для каждого конкретного статуса', () => {
    const newCount = countByStatus(mixTasks as Task[], 'new');
    const inProgressCount = countByStatus(mixTasks as Task[], 'in_progress');
    const doneCount = countByStatus(mixTasks as Task[], 'done');

    expect(newCount).toBe(2);
    expect(inProgressCount).toBe(1);
    expect(doneCount).toBe(1);
  });

  it('2. countByStatus: должен возвращать 0, если массив задач пустой', () => {
    const newCount = countByStatus([], 'new');
    const doneCount = countByStatus([], 'done');

    expect(newCount).toBe(0);
    expect(doneCount).toBe(0);
  });

  it('3. calculateCompletionProgress: должен правильно вычислять процент прогресса выполнения списков', () => {
    const mockLists = [{ id: 'list-1', title: 'Тестовый список' }];

    const mixTasksWithListId: Partial<Task>[] = [
      { id: '1', listId: 'list-1', status: 'new' },
      { id: '2', listId: 'list-1', status: 'in_progress' },
      { id: '3', listId: 'list-1', status: 'done' },
      { id: '4', listId: 'list-1', status: 'new' }
    ];

    const result = calculateCompletionProgress(mockLists as TaskList[], mixTasksWithListId as Task[]);

    expect(result[0].progress).toBe(25);
  });

  it('4. calculateCompletionProgress: должен возвращать 0% прогресса для пустого списка задач', () => {
    const mockLists = [{ id: 'list-1', title: 'Пустой список' }];

    const result = calculateCompletionProgress(mockLists as TaskList[], []);

    expect(result[0].progress).toBe(0);
  });
});