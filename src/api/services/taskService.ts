import type { Task, TTaskStatus } from '../../types';
import { axiosInstance } from '../axiosInstance.ts';

export const taskService = {
  getTasksByListId: async (listId: string): Promise<Task[]> => {
    const response = await axiosInstance.get<Task[]>(`/lists/${listId}/tasks`);
    return response.data;
  },

  updateTaskStatus: async (taskId: string, status: TTaskStatus): Promise<Task> => {
    const response = await axiosInstance.patch<Task>(`/tasks/${taskId}`, { status });
    return response.data;
  },

  createTask: async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    const response = await axiosInstance.post<Task>(`/tasks`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await axiosInstance.delete<void>(`/tasks/${taskId}`);
  },

  updateTask: async (taskId: string, taskData: Omit<Task, 'id' | 'listId'>): Promise<Task> => {
    const response = await axiosInstance.put<Task>(`/tasks/${taskId}`, taskData);
    return response.data;
  },
};