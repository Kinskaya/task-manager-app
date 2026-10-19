export type TPriority = 'low' | 'medium' | 'high';
export type TTaskStatus = 'new' | 'in_progress' | 'done';
export type TColorIndicator = 'red' | 'yellow' | 'green';
export type TTheme = 'light' | 'dark' | 'system';

export interface Task {
  id: string;
  listId: string;
  title: string;
  description: string;
  status: TTaskStatus;
  priority: TPriority;
  deadline: string;
}

export interface TaskList {
  id: string;
  title: string;
  colorIndicator: TColorIndicator;
  counters: {
    new: number;
    inProgress: number;
    done: number;
    overdue: number;
  };
  progress: number;
}

export interface ThemeContextType {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}