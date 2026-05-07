import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { incidentApi } from '../api/incidentApi';
import type { IncidentRequest } from '../types';

export const INCIDENTS_KEY = 'incidents';

export function useIncidentList(forkliftId: number | null) {
  return useQuery({
    queryKey: [INCIDENTS_KEY, forkliftId],
    queryFn: () => incidentApi.getByForkliftId(forkliftId!),
    enabled: forkliftId !== null,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ forkliftId, data }: { forkliftId: number; data: IncidentRequest }) =>
      incidentApi.create(forkliftId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [INCIDENTS_KEY, variables.forkliftId] });
    },
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IncidentRequest }) => incidentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCIDENTS_KEY] });
    },
  });
}

export function useDeleteIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => incidentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCIDENTS_KEY] });
    },
  });
}
