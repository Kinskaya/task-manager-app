import React, { useState } from 'react';

type TProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  isPending: boolean;
  defaultTitle?: string;
}

export const ManageTaskListModal = ({ isOpen, onClose, onSubmit, isPending, defaultTitle = '' }: TProps) => {
  const [title, setTitle] = useState(defaultTitle);
  const isEditMode = !!defaultTitle;

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit(title);
    setTitle('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl text-slate-900 dark:text-white">
        <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Редактировать список' : 'Создать новый список'}</h2>

        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            required
            autoFocus
            placeholder="Введите название списка (например, Учёба)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-950 mb-6 text-slate-900 dark:text-white"
          />

          <div className="flex justify-end gap-3">
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
              disabled={isPending || !title.trim()}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
            >
              {isPending
                ? (isEditMode ? 'Сохранение...' : 'Создание...')
                : (isEditMode ? 'Сохранить' : 'Добавить')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};