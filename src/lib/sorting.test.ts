import { describe, expect, it } from 'vitest';
import { sortTasks } from './sorting';
import type { Task } from '../types';

describe('Алгоритм сортировки задач sortTasks()', () => {

  it('1. Должен ставить выполненные задачи (done) в самый низ списка', () => {
    const tasks: Partial<Task>[] = [
      { id: '1', status: 'done', deadline: '2026-10-20', priority: 'medium' },
      { id: '2', status: 'new', deadline: '2026-10-21', priority: 'medium' }
    ];
    const result = sortTasks(tasks as Task[]);

    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('1');
  });

  it('2. Должен поднимать незавершенные просроченные задачи на самый верх', () => {
    const tasks: Partial<Task>[] = [
      { id: '1', status: 'new', deadline: '2026-10-25', priority: 'medium' },
      { id: '2', status: 'in_progress', deadline: '2026-10-01', priority: 'medium' }
    ];
    const result = sortTasks(tasks as Task[]);

    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('1');
  });

  it('3. Должен сортировать непросроченные задачи: чем ближе дедлайн, тем выше', () => {
    const tasks: Partial<Task>[] = [
      { id: '1', status: 'new', deadline: '2026-10-25', priority: 'medium' },
      { id: '2', status: 'new', deadline: '2026-10-18', priority: 'medium' }
    ];
    const result = sortTasks(tasks as Task[]);

    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('1');
  });

  it('4. Должен использовать приоритет как tie-breaker при абсолютно одинаковых дедлайнах', () => {
    const tasks: Partial<Task>[] = [
      { id: '1', status: 'new', deadline: '2026-10-20', priority: 'low' },
      { id: '2', status: 'new', deadline: '2026-10-20', priority: 'high' }
    ];
    const result = sortTasks(tasks as Task[]);

    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('1');
  });

  it('5. Должен строго распределять приоритеты: high > medium > low', () => {
    const tasks: Partial<Task>[] = [
      { id: 'low', status: 'new', deadline: '2026-10-20', priority: 'low' },
      { id: 'high', status: 'new', deadline: '2026-10-20', priority: 'high' },
      { id: 'med', status: 'new', deadline: '2026-10-20', priority: 'medium' }
    ];
    const result = sortTasks(tasks as Task[]);

    expect(result[0].id).toBe('high');
    expect(result[1].id).toBe('med');
    expect(result[2].id).toBe('low');
  });

  it('6. Должен корректно сортировать две просроченные задачи между собой по близости дедлайна', () => {
    const tasks: Partial<Task>[] = [
      { id: 'older', status: 'new', deadline: '2026-10-01', priority: 'medium' },
      { id: 'newer', status: 'new', deadline: '2026-10-10', priority: 'medium' }
    ];
    const result = sortTasks(tasks as Task[]);

    expect(result[0].id).toBe('older');
    expect(result[1].id).toBe('newer');
  });

  it('7. Должен сохранять хронологию дедлайнов даже среди выполненных задач (done)', () => {
    const tasks: Partial<Task>[] = [
      { id: '1', status: 'done', deadline: '2026-10-25', priority: 'medium' },
      { id: '2', status: 'done', deadline: '2026-10-20', priority: 'medium' }
    ];
    const result = sortTasks(tasks as Task[]);

    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('1');
  });

  it('8. Не должен изменять (мутировать) исходный массив данных', () => {
    const tasks: Task[] = [
      {
        id: '1',
        listId: '1',
        title: 'T1',
        description: '',
        status: 'done',
        priority: 'medium',
        deadline: '2026-10-20'
      },
      { id: '2', listId: '1', title: 'T2', description: '', status: 'new', priority: 'medium', deadline: '2026-10-10' }
    ];
    const immutableCheck = [...tasks];

    sortTasks(tasks);

    expect(tasks[0].id).toBe(immutableCheck[0].id);
    expect(tasks[1].id).toBe(immutableCheck[1].id);
  });
});