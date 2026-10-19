import { Outlet, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { CheckSquare } from 'lucide-react';

export const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      <header
        className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            onClick={() => navigate('/lists')}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <CheckSquare size={18} className="stroke-[2.5]"/>
            </div>
            <span
              className="font-extrabold tracking-tight text-base bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              TaskManager
            </span>
          </div>
          <ThemeToggle/>
        </div>
      </header>
      <main className="w-full">
        <Outlet/>
      </main>
    </div>
  );
};