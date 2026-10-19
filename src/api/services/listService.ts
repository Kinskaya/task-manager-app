import type { TaskList } from '../../types';
import { axiosInstance } from '../axiosInstance.ts';

export const listService = {
  getLists: async (): Promise<TaskList[]> => {
    const response = await axiosInstance.get<TaskList[]>('/lists');
    return response.data;
  },

  createList: async (title: string): Promise<TaskList> => {
    const response = await axiosInstance.post<TaskList>('/lists', { title });
    return response.data;
  },

  deleteList: async (id: string): Promise<void> => {
    await axiosInstance.delete<void>(`/lists/${id}`);
  },

  updateList: async ({ id, title }: { id: string; title: string }): Promise<TaskList> => {
    const response = await axiosInstance.put<TaskList>(`/lists/${id}`, { title });
    return response.data;
  }

}