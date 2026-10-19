import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.ts';


const THEME_BUTTONS = [
  { value: 'light', label: 'Светлая', icon: Sun },
  { value: 'dark', label: 'Тёмная', icon: Moon },
  { value: 'system', label: 'Системная', icon: Monitor },
] as const;

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {THEME_BUTTONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            theme === value
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Icon size={14} className="stroke-[2.25]"/>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};