import { useNavigate, useParams } from 'react-router-dom';
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask, useUpdateTaskStatus } from '../hooks/useTasks.ts';
import { sortTasks } from '../lib/sorting';
import { useTaskLists } from '../hooks/useTaskLists.ts';
import type { Task, TTaskStatus } from '../types';
import { useMemo, useState } from 'react';
import { TaskRow } from '../components/tasks/TaskRow.tsx';
import { ManageTaskModal, TaskViewModal } from '../components/modals';

const TASK_STATUS_OPTIONS: { value: TTaskStatus; label: string }[] = [
  { value: 'new', label: 'Новая' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'done', label: 'Готово' },
];

const FILTER_OPTIONS = [
  { value: 'all' as const, label: 'Все' },
  ...TASK_STATUS_OPTIONS
];

const STATUS_CONFIG = {
  new: { label: 'Новая', style: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'В работе', style: 'bg-amber-100 text-amber-700' },
  done: { label: 'Готово', style: 'bg-green-100 text-green-700' },
};

const PRIORITY_CONFIG = {
  high: { label: 'Высокий', style: 'bg-red-50 text-red-600' },
  medium: { label: 'Средний', style: 'bg-amber-50 text-amber-600' },
  low: { label: 'Низкий', style: 'bg-slate-100 text-slate-600' },
};

export const TasksPage = () => {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<TTaskStatus | 'all'>('all');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [taskToView, setTaskToView] = useState<Task | null>(null);

  const { data: tasks, isLoading, isError } = useTasks(listId || '');
  const { data: lists } = useTaskLists();
  const currentList = lists?.find(l => l.id === listId);

  const { mutate: updateStatus } = useUpdateTaskStatus();
  const { mutate: deleteTask } = useDeleteTask(listId || '');
  const { mutate: createTask, isPending: isCreating } = useCreateTask(listId || '');
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(listId || '');

  const isSaving = isCreating || isUpdating;

  const handleViewTask = (task: Task) => {
    setTaskToView(task);
    setIsDetailsOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true)
  };

  const filteredAndSortedTasks = useMemo(() => {
    if (!tasks) return [];

    const filtered = filterStatus === 'all'
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

    return sortTasks(filtered);
  }, [tasks, filterStatus]);

  const handleStatusChange = (taskId: string, newStatus: TTaskStatus) => {
    updateStatus({ taskId, status: newStatus });
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      deleteTask(taskId);
    }
  };

  const handleModalSubmit = (formData: Omit<Task, 'id' | 'listId'>) => {
    if (selectedTask) {
      updateTask(
        { taskId: selectedTask.id, ...formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedTask(null);
          },
        }
      );
    } else {
      createTask(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !tasks) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <p className="text-red-500 font-medium">Не удалось загрузить задачи для этого списка</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/lists')}
            className="mb-6 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Вернуться к спискам
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            + Новая задача
          </button>
        </div>

        <h1
          className="text-3xl font-extrabold tracking-tight mb-8">{currentList ? `Задачи списка: ${currentList.title}` : 'Задачи списка'}
        </h1>

        <div className="flex gap-2 mb-6">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilterStatus(value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                filterStatus === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">

          <div
            className="hidden md:grid grid-cols-[1fr_130px_120px_160px] bg-slate-50 dark:bg-slate-950 px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <div>Название задачи</div>
            <div className="text-center">Статус</div>
            <div className="text-center">Приоритет</div>
            <div>Дедлайн</div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredAndSortedTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                taskStatusOptions={TASK_STATUS_OPTIONS}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onViewDetails={handleViewTask}
              />
            ))}
            {filteredAndSortedTasks.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-400">
                В этом статусе задач пока нет
              </div>
            )}
            <ManageTaskModal
              key={selectedTask?.id || (isModalOpen ? 'create-task' : 'closed')}
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedTask(null);
              }}
              onSubmit={handleModalSubmit}
              isPending={isSaving}
              task={selectedTask}
            />
            <TaskViewModal
              isOpen={isDetailsOpen}
              onClose={() => {
                setIsDetailsOpen(false);
                setTaskToView(null);
              }}
              task={taskToView}
              statusConfig={STATUS_CONFIG}
              priorityConfig={PRIORITY_CONFIG}
            />
          </div>
        </div>
      </div>
    </div>
  );
};