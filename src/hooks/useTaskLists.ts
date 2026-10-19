import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listService } from '../api/services/listService.ts';

export function useTaskLists() {
  return useQuery({
    queryKey: ['taskLists'],
    queryFn: listService.getLists,
  });
}

export function useCreateTaskList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listService.createList,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });
}

export function useDeleteTaskList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listService.deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });
}

export function useUpdateTaskList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listService.updateList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });
}