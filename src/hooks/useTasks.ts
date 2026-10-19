import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task, TTaskStatus } from '../types';
import { taskService } from '../api/services/taskService.ts';

export function useTasks(listId: string) {
  return useQuery({
    queryKey: ['tasks', listId],
    queryFn: () => taskService.getTasksByListId(listId),
    enabled: Boolean(listId),
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TTaskStatus }) =>
      taskService.updateTaskStatus(taskId, status),

    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.listId] });
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });
}

export function useDeleteTask(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });
}

export function useCreateTask(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: Omit<Task, 'id' | 'listId'>) =>
      taskService.createTask({ listId, ...taskData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });
}

export function useUpdateTask(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, ...taskData }: { taskId: string } & Omit<Task, 'id' | 'listId'>) =>
      taskService.updateTask(taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });
}