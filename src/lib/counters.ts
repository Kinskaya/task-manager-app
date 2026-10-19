import type { Task, TaskList, TColorIndicator } from '../types';

const MS_IN_DAY = 24 * 60 * 60 * 1000;

export const countByStatus = (tasks: Task[], status: Task['status']) =>
  tasks.filter((t) => t.status === status).length;

export const calculateCompletionProgress = (lists: TaskList[], tasks: Task[]) => {
  const now = new Date();

  return lists.map((list) => {
    const listTasks = tasks.filter((task) => task.listId === list.id);
    const total = listTasks.length;

    if (total === 0) {
      return {
        ...list,
        colorIndicator: 'green',
        counters: { new: 0, inProgress: 0, done: 0, overdue: 0 },
        progress: 0,
      };
    }

    const countOverdue = listTasks.filter((t) => t.status !== 'done' && t.deadline && new Date(t.deadline) < now).length;
    const activeTasks = listTasks.filter((t) => !t.deadline || new Date(t.deadline) >= now)
    const countNew = countByStatus(activeTasks, 'new');
    const countInProgress = countByStatus(activeTasks, 'in_progress');
    const countDone = countByStatus(listTasks, 'done');

    let color: TColorIndicator = 'green';

    if (countOverdue > 0) {
      color = 'red';
    } else {

      const hasUrgentTask = listTasks.some((t) => {
        if (t.status === 'done' || !t.deadline) return false;

        const msRemaining = new Date(t.deadline).getTime() - now.getTime();
        return msRemaining > 0 && msRemaining <= 2 * MS_IN_DAY;
      });

      if (hasUrgentTask) color = 'yellow';
    }

    const progressPercent = Math.round((countDone / total) * 100);

    return {
      ...list,
      colorIndicator: color,
      counters: {
        new: countNew,
        inProgress: countInProgress,
        done: countDone,
        overdue: countOverdue,
      },
      progress: progressPercent,
    };
  });
}
