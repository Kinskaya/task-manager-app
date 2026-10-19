import type { Task, TTaskStatus } from '../../types';
import { Pencil, Trash2 } from 'lucide-react';

type TProps = {
  task: Task;
  onStatusChange: (taskId: string, nextStatus: TTaskStatus) => void;
  taskStatusOptions: { value: TTaskStatus; label: string }[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewDetails: (task: Task) => void;
}

export const TaskRow = ({ task, onStatusChange, taskStatusOptions, onDelete, onEdit, onViewDetails }: TProps) => {
  const isOverdue = task.status !== 'done' && task.deadline && new Date(task.deadline) < new Date();

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_130px_120px_160px] items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all group relative cursor-pointer">
      <div onClick={() => onViewDetails(task)}
           className={task.status === 'done' ? 'line-through text-slate-400 font-medium' : 'text-slate-900 dark:text-white font-medium'}>
        <span className="md:hidden text-xs font-bold block text-slate-400 uppercase mb-1">Название:</span>
        {task.title}
      </div>
      <div className="flex flex-col items-start md:items-center">
        <span className="md:hidden text-xs font-bold block text-slate-400 uppercase mb-1">Статус:</span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TTaskStatus)}
          className={`px-3 py-1.5 text-xs font-bold rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none text-center shadow-sm w-[110px] ${
            task.status === 'new' ? 'bg-blue-100 text-blue-700' :
              task.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {taskStatusOptions.map((option) => (
            <option key={option.value} value={option.value} className="text-slate-900 bg-white font-medium">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-start md:items-center">
        <span className="md:hidden text-xs font-bold block text-slate-400 uppercase mb-1">Приоритет:</span>
        <span className={`px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-md text-center w-[85px] ${
          task.priority === 'high' ? 'bg-red-50 text-red-600' :
            task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
        }`}>
          {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
        </span>
      </div>
      <div className="text-slate-500 dark:text-slate-400 flex flex-col justify-center">
        <span className="md:hidden text-xs font-bold block text-slate-400 uppercase mb-1">Дедлайн:</span>
        <span className={isOverdue ? 'text-red-500 font-bold' : ''}>
          {new Date(task.deadline).toLocaleDateString('ru-RU')}
        </span>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10 opacity-0
            group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-l from-slate-50 via-slate-50
            pl-4 h-full md:from-white md:via-white dark:md:from-slate-900 dark:md:via-slate-900">
        <button
          onClick={() => onEdit(task)}
          className="text-slate-400 hover:text-blue-500 p-1.5 rounded-lg transition-colors cursor-pointer"
          title="Редактировать задачу"
        >
          <Pencil size={16} className="stroke-[2.25]"/>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
          title="Удалить задачу"
        >
          <Trash2 size={16} className="stroke-[2.25]"/>
        </button>
      </div>
    </div>
  );
};