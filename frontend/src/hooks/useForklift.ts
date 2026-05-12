import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { forkliftApi } from '../api/forkliftApi';
import type { ForkliftRequest } from '../types';

export const FORKLIFTS_KEY = 'forklifts';

export function useForkliftList(number: string) {
  return useQuery({
    queryKey: [FORKLIFTS_KEY, number],
    queryFn: () => forkliftApi.getAll(number),
  });
}

export function useCreateForklift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ForkliftRequest) => forkliftApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FORKLIFTS_KEY] });
    },
  });
}

export function useUpdateForklift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ForkliftRequest }) => forkliftApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FORKLIFTS_KEY] });
    },
  });
}

export function useDeleteForklift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => forkliftApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FORKLIFTS_KEY] });
    },
  });
}
