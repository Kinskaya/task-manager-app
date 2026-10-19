import type { Task, TPriority } from '../types';

const PRIORITY_WEIGHT: Record<TPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function sortTasks(tasks: Task[]): Task[] {
  const now = new Date();

  return [...tasks].sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (a.status !== 'done' && b.status === 'done') return -1;

    if (a.status !== 'done' && b.status !== 'done') {
      const isOverdueA = new Date(a.deadline) < now;
      const isOverdueB = new Date(b.deadline) < now;

      if (isOverdueA && !isOverdueB) return -1;
      if (!isOverdueA && isOverdueB) return 1;
    }

    const timeA = new Date(a.deadline).getTime();
    const timeB = new Date(b.deadline).getTime();
    if (timeA !== timeB) {
      return timeA - timeB;
    }

    return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
  });
}