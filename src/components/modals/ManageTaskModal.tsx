import type { Task, TPriority, TTaskStatus } from '../../types';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { formatDeadlineForInput, getTodayString } from '../../utils/date.ts';

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Task, 'id' | 'listId'>) => void;
  isPending: boolean;
  task: Task | null;
}

export const ManageTaskModal = ({ isOpen, onClose, onSubmit, isPending, task }: TProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TTaskStatus>(task?.status || 'new');
  const [priority, setPriority] = useState<TPriority>(task?.priority || 'low');
  const [deadline, setDeadline] = useState(task?.deadline ? formatDeadlineForInput(task.deadline) : '');

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    onSubmit({
      title,
      description,
      status,
      priority,
      deadline: new Date(deadline).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
         onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900 dark:text-white relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer">
          <X size={18}/>
        </button>

        <h2 className="text-xl font-bold mb-5">
          {task ? 'Редактировать задачу' : 'Создать новую задачу'}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Название задачи
              *</label>
            <input
              type="text"
              required
              disabled={isPending}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950"
              placeholder="Например, Подготовить отчет по ТЗ..."
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Описание</label>
            <textarea
              rows={3}
              disabled={isPending}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 resize-none"
              placeholder="Добавьте детали и подробности задачи..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Статус</label>
              <select
                value={status}
                disabled={isPending}
                onChange={(e) => setStatus(e.target.value as TTaskStatus)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 cursor-pointer text-slate-700 dark:text-slate-200"
              >
                <option value="new">Новая</option>
                <option value="in_progress">В работе</option>
                <option value="done">Готово</option>
              </select>
            </div>

            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Приоритет</label>
              <select
                value={priority}
                disabled={isPending}
                onChange={(e) => setPriority(e.target.value as TPriority)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 cursor-pointer text-slate-700 dark:text-slate-200"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Дедлайн
              *</label>
            <input
              type="date"
              required
              disabled={isPending}
              min={getTodayString()}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark] cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isPending || !title.trim() || !deadline}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
            >
              {isPending ? 'Сохранение...' : (task ? 'Сохранить' : 'Добавить')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};