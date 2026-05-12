import apiClient from './axios';
import type { AuthRequest, AuthResponse, ForkliftRequest, ForkliftResponse, PageResponse } from '../types';

export const authApi = {
  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
};

export const forkliftApi = {
  getAll: async (number: string = ''): Promise<PageResponse<ForkliftResponse>> => {
    const response = await apiClient.get('/forklifts', { params: { number, size: 1000 } });
    return response.data;
  },

  create: async (data: ForkliftRequest): Promise<ForkliftResponse> => {
    const response = await apiClient.post('/forklifts', data);
    return response.data;
  },

  update: async (id: number, data: ForkliftRequest): Promise<ForkliftResponse> => {
    const response = await apiClient.put(`/forklifts/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/forklifts/${id}`);
  },
};
