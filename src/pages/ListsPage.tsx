import { useCreateTaskList, useDeleteTaskList, useTaskLists, useUpdateTaskList } from '../hooks/useTaskLists.ts';
import { useNavigate } from "react-router-dom";
import React, { useMemo, useState } from "react";
import { ManageTaskListModal } from '../components/modals/ManageTaskListModal.tsx';
import type { TaskList } from '../types';
import { Pencil, Trash2 } from 'lucide-react';

export const ListsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<TaskList | null>(null);
  const { data: lists, isLoading, isError, error } = useTaskLists();
  const { mutate: createList, isPending } = useCreateTaskList();
  const { mutate: deleteList } = useDeleteTaskList();
  const { mutate: updateList } = useUpdateTaskList();

  const filteredLists = useMemo(() => {
    if (!lists) return [];
    return lists.filter((list) =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [lists, searchQuery]);

  const handleClick = (listId: string) => {
    navigate(`/lists/${listId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить этот список и все задачи в нём?')) {
      deleteList(listId);
    }
  };

  const handleEditClick = (e: React.MouseEvent, list: TaskList) => {
    e.stopPropagation();
    setEditingList(list);
  };

  const handleModalSubmit = (title: string) => {
    if (editingList) {
      updateList(
        { id: editingList.id, title },
        {
          onSuccess: () => setEditingList(null),
        }
      );
    } else {
      createList(title, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <div
          className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-4 max-w-md text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">Не удалось загрузить списки задач</p>
          <p className="text-xs text-red-500 dark:text-red-500 mt-1">{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 sm:p-10">
      <div className="flex-col md:flex-row max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="m-auto">
            <h1 className="text-3xl text-center font-extrabold">Мои списки</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Управление проектами и задачами</p>
          </div>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-between">
          <input
            type="text"
            placeholder="Поиск списков..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto md:w-64 border border-slate-200 rounded-xl px-5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 text-base font-bold transition-colors shadow-sm whitespace-nowrap"
          >
            Добавить список
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLists.map((list) => (
            <div
              key={list.id}
              onClick={() => handleClick(list.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
                             rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative
                             overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 w-2 h-full ${
                list.colorIndicator === 'red' ? 'bg-red-500' :
                  list.colorIndicator === 'yellow' ? 'bg-amber-400' : 'bg-green-500'
              }`}/>
              <div className="pl-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{list.title}</h3>
                  <div
                    className="flex items-center gap-1.5 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleEditClick(e, list)}
                      className="text-slate-400 hover:text-blue-500 text-xs font-semibold p-1 rounded transition-colors"
                      title="Переименовать список"
                    >
                      <Pencil size={16} className="stroke-[2.25]"/>
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(e, list.id)}
                      className="text-slate-400 hover:text-red-500 text-base font-bold p-1 rounded transition-colors"
                      title="Удалить список"
                    >
                      <Trash2 size={16} className="stroke-[2.25]"/>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 my-4 text-center">
                  <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded-xl">
                    <span
                      className="block text-xl font-bold text-blue-600 dark:text-blue-400">{list.counters.new}</span>
                    <span className="text-[10px] uppercase font-semibold text-blue-500 tracking-wider">Новые</span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl">
                    <span
                      className="block text-xl font-bold text-amber-600 dark:text-amber-400">{list.counters.inProgress}</span>
                    <span className="text-[10px] uppercase font-semibold text-amber-500 tracking-wider">В работе</span>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/40 p-2 rounded-xl">
                    <span
                      className="block text-xl font-bold text-red-600 dark:text-red-400">{list.counters.overdue}</span>
                    <span className="text-[10px] uppercase font-semibold text-red-500 tracking-wider">Просроч.</span>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/40 p-2 rounded-xl">
                    <span
                      className="block text-xl font-bold text-green-600 dark:text-green-400">{list.counters.done}</span>
                    <span className="text-[10px] uppercase font-semibold text-green-500 tracking-wider">Готово</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Прогресс выполнения</span>
                    <span className="font-semibold">{list.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${list.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ManageTaskListModal
        key={editingList?.id || 'create-modal'}
        isOpen={isModalOpen || !!editingList}
        onClose={() => {
          setIsModalOpen(false);
          setEditingList(null);
        }}
        onSubmit={handleModalSubmit}
        isPending={isPending}
        defaultTitle={editingList?.title}
      />
    </div>
  );
};