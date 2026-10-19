import type { Task } from '../../types';
import { X } from 'lucide-react';

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  statusConfig: Record<string, { label: string; style: string }>;
  priorityConfig: Record<string, { label: string; style: string }>;
}

export const TaskViewModal = ({ isOpen, onClose, task, statusConfig, priorityConfig }: TProps) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
         onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900 dark:text-white relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg cursor-pointer">
          <X size={18}/>
        </button>

        <div className="space-y-5 text-left">
          <h2
            className="text-xl font-bold border-b border-slate-100 dark:border-slate-800 pb-2 text-slate-400 uppercase tracking-wider">
            Карточка задачи
          </h2>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Название
            </span>
            <h3
              className={`text-lg font-bold ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
              {task.title}
            </h3>
          </div>
          <div>
            <span
              className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Описание
            </span>
            <p
              className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850 min-h-[60px] whitespace-pre-line font-medium">
              {task.description || 'Описание отсутствует'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Статус
              </span>
              <span
                className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${statusConfig[task.status].style}`}>
                {statusConfig[task.status].label}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Приоритет
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md ${priorityConfig[task.priority].style}`}>
                {priorityConfig[task.priority].label}
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Дедлайн
            </span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {new Date(task.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};