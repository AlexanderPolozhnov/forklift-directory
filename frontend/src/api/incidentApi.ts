import apiClient from './axios';
import type { IncidentRequest, IncidentResponse } from '../types';

export const incidentApi = {
  getByForkliftId: async (forkliftId: number): Promise<IncidentResponse[]> => {
    const response = await apiClient.get(`/forklifts/${forkliftId}/incidents`);
    return response.data;
  },

  create: async (forkliftId: number, data: IncidentRequest): Promise<IncidentResponse> => {
    const response = await apiClient.post(`/forklifts/${forkliftId}/incidents`, data);
    return response.data;
  },

  update: async (id: number, data: IncidentRequest): Promise<IncidentResponse> => {
    const response = await apiClient.put(`/incidents/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/incidents/${id}`);
  },
};
